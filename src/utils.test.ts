import { describe, it, expect, vi } from 'vitest';
import { cx, getHour, clamp, getFullDateLabel, isEventLive } from './utils/index';

describe('utils', () => {
    it('cx joins classes correctly', () => {
        expect(cx('a', 'b')).toBe('a b');
        expect(cx('a', false, 'b', null)).toBe('a b');
    });

    it('clamp works correctly', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(15, 0, 10)).toBe(10);
    });

    it('getHour extracts time correctly', () => {
        // 2026-01-25T03:00:00Z is 21:00 in Mexico City (CST/UTC-6)
        expect(getHour('2026-01-25T03:00:00Z')).toBe('21:00');
    });

    it('getFullDateLabel returns human readable Spanish date', () => {
        expect(getFullDateLabel('2026-01-24T21:00:00')).toContain('24');
        expect(getFullDateLabel('invalid-date')).toBe('Fecha inválida');
    });

    it('isEventLive checks range correctly', () => {
        // Mock "Now" to be 2026-01-24T12:00:00Z
        const MOCK_NOW = new Date('2026-01-24T12:00:00Z');
        vi.useFakeTimers();
        vi.setSystemTime(MOCK_NOW);

        const oneHourAgo = new Date(MOCK_NOW.getTime() - 60 * 60 * 1000).toISOString();
        const oneHourFromNow = new Date(MOCK_NOW.getTime() + 60 * 60 * 1000).toISOString();
        const threeHoursAgo = new Date(MOCK_NOW.getTime() - 3 * 60 * 60 * 1000).toISOString();

        // importing isEventLive from utils to test it
        // We need to re-import or rely on module scope. 
        // Ideally we import it at the top, but let's check imports first.
        // Assuming isEventLive is imported.
        expect(isEventLive(oneHourAgo, oneHourFromNow)).toBe(true); // Active
        expect(isEventLive(threeHoursAgo, oneHourAgo)).toBe(false); // Ended
        expect(isEventLive(oneHourFromNow)).toBe(false); // Future

        vi.useRealTimers();
    });
});
