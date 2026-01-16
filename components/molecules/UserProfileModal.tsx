import React from 'react';
import { X, MapPin, MessageCircle, UserPlus, Music, Shield } from 'lucide-react';
import { UserData } from '../../types';
import { GlassContainer, IconButton } from '../atoms';
import { useLocale } from '../../src/context/LocaleContext';
import { triggerHaptic } from '../../src/utils';

interface UserProfileModalProps {
    user: UserData | null;
    onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    const { t } = useLocale();

    if (!user) return null;

    const tags = ["Local", "Bear", "House Music", "Gym"];

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black-85 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-300">
                <GlassContainer strong className="overflow-hidden">

                    {/* Cover / Header */}
                    <div className="h-32 bg-gradient-to-br from-[var(--c)] to-[#1a120b] relative">
                        <div className="absolute top-3 right-3">
                            <IconButton Icon={X} onClick={onClose} label={t('action.close')} />
                        </div>
                    </div>

                    {/* Avatar & Main Info */}
                    <div className="px-6 relative -mt-12 flex flex-col items-center text-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-[32px] border-4 border-[#14110C] overflow-hidden shadow-2xl bg-[#14110C]">
                                <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            {user.online && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-ok border-4 border-[#14110C] rounded-full" />
                            )}
                        </div>

                        <div className="mt-4">
                            <h2 className="text-2xl font-black text-white font-display flex items-center justify-center gap-2">
                                {user.name}, {user.age}
                                <Shield size={16} className="text-o" fill="currentColor" />
                            </h2>
                            <div className="flex items-center justify-center gap-1.5 mt-1 text-s">
                                <MapPin size={12} />
                                <span className="text-xs font-bold uppercase tracking-wide">{t('profile.ago')} {user.dist} {t('profile.distance')}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 w-full mt-6 mb-6">
                            <button onClick={() => triggerHaptic('medium')} className="h-12 rounded-xl bg-white text-black font-black uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition">
                                <UserPlus size={16} strokeWidth={2.5} />
                                {t('profile.connect')}
                            </button>
                            <button onClick={() => triggerHaptic('medium')} className="h-12 rounded-xl border border-white-20 bg-white/5 text-white font-black uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition">
                                <MessageCircle size={16} strokeWidth={2.5} />
                                {t('profile.message')}
                            </button>
                        </div>

                        {/* Details */}
                        <div className="w-full text-left space-y-4 mb-6">
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-[.2em] text-f mb-2">{t('profile.interests')}</div>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white-10 text-[10px] font-bold text-m">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-[9px] font-black uppercase tracking-[.2em] text-f mb-2">{t('profile.seen')}</div>
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white-5">
                                    <Music size={16} className="text-o" />
                                    <div>
                                        <div className="text-xs font-bold text-white">Blue Chairs Beach Club</div>
                                        <div className="text-[9px] text-f">{t('profile.ago')} 15 {t('profile.minutes')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </GlassContainer>
            </div>
        </div>
    );
};
