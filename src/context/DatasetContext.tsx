import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DatasetLoadResult, loadDataset } from '@/services/datasetProvider';
import { EventData } from '@/types';

type DatasetStatus = 'loading' | 'ready' | 'fallback' | 'error';

interface DatasetContextValue {
    events: EventData[];
    status: DatasetStatus;
    message?: string;
    updatedAt?: number;
    etag?: string;
    reload: (force?: boolean) => Promise<void>;
}

const DatasetContext = createContext<DatasetContextValue | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [status, setStatus] = useState<DatasetStatus>('loading');
    const [message, setMessage] = useState<string>();
    const [updatedAt, setUpdatedAt] = useState<number>();
    const [etag, setEtag] = useState<string>();

    const handleResult = (result: DatasetLoadResult) => {
        setEvents(result.events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
        setUpdatedAt(result.updatedAt);
        setEtag(result.etag);
        if (result.status === 'fresh' || result.status === 'cache') {
            setStatus('ready');
        } else if (result.status === 'fallback') {
            setStatus('fallback');
        } else {
            setStatus('error');
        }
        setMessage(result.message);
    };

    const load = useCallback(async (force = false) => {
        const result = await loadDataset(force);
        handleResult(result);
    }, []);

    useEffect(() => {
        load(false);
    }, [load]);

    return (
        <DatasetContext.Provider value={{
            events,
            status,
            message,
            updatedAt,
            etag,
            reload: load,
        }}>
            {children}
        </DatasetContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataset = () => {
    const context = useContext(DatasetContext);
    if (!context) {
        throw new Error('useDataset must be used within a DatasetProvider');
    }
    return context;
};

