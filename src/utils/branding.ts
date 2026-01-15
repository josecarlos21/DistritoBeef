import { TrackType } from '../../types';

export const getTrackStyles = (track: TrackType) => {
    switch (track) {
        case 'beefdip':
            return {
                badgeBg: 'bg-orange-500/20',
                badgeText: 'text-orange-400',
                solidBg: 'bg-orange-500',
                solidText: 'text-black',
                border: 'border-orange-500/20'
            };
        case 'bearadise':
            return {
                badgeBg: 'bg-purple-500/20',
                badgeText: 'text-purple-400',
                solidBg: 'bg-purple-600',
                solidText: 'text-white',
                border: 'border-purple-500/20'
            };
        case 'community':
        default:
            return {
                badgeBg: 'bg-blue-500/20',
                badgeText: 'text-blue-400',
                solidBg: 'bg-blue-500',
                solidText: 'text-white',
                border: 'border-blue-500/20'
            };
    }
};

export const getTrackLabel = (track: TrackType): string => {
    switch (track) {
        case 'beefdip': return 'BEEF';
        case 'bearadise': return 'BEARADISE';
        case 'community': return 'COMMUNITY';
        default: return track.toUpperCase();
    }
};
