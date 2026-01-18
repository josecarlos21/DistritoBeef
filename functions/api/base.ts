import { DatasetSchema } from '../../src/schemas/dataset';

type PagesFunctionHandler = (context: { request: Request; env: Record<string, unknown> }) => Promise<Response> | Response;

export const onRequest: PagesFunctionHandler = async ({ request, env }) => {
    const datasetUrl = env?.DATASET_URL as string | undefined;
    const send = (data: unknown, etag: string) => {
        const incomingEtag = request.headers.get('If-None-Match');
        if (incomingEtag && incomingEtag === etag) {
            return new Response(null, { status: 304 });
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                'ETag': etag,
            },
        });
    };

    const computeEtag = async (body: unknown) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(body));
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    try {
        let payload: unknown;

        if (datasetUrl) {
            const upstream = await fetch(datasetUrl);
            if (!upstream.ok) {
                return new Response(`Dataset fetch failed ${upstream.status}`, { status: 502 });
            }
            payload = await upstream.json();
        } else {
            const localModule = await import('../../src/context/base.json');
            payload = (localModule as { default?: unknown }).default ?? localModule;
        }

        const parsed = DatasetSchema.safeParse(payload);
        if (!parsed.success) {
            return new Response('Dataset inválido', { status: 422 });
        }

        const etag = await computeEtag(parsed.data.EVENTS_MASTER);
        return send(parsed.data, etag);
    } catch (e) {
        return new Response(`Error dataset: ${e instanceof Error ? e.message : 'desconocido'}`, { status: 500 });
    }
};
