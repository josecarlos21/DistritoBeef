import React, { useRef, useState } from 'react';
import { Download, Upload, Info } from 'lucide-react';
import { GlassContainer, IconButton } from '../atoms';
import { useLocale } from '@/context/LocaleContext';
import { useAppStore } from '@/store/useAppStore';
import { exportBackup, parseBackup } from '@/utils/backup';

export const BackupPanel: React.FC = () => {
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [lastExport, setLastExport] = useState<string>();

  const handleExport = () => {
    const payload = exportBackup(useAppStore.getState());
    const data = JSON.stringify(payload, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distrito-backup-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setLastExport(payload.exportedAt);
    setMessage('Backup exportado');
    setError(undefined);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseBackup(text);
      useAppStore.getState().restoreFromBackup(parsed.state);
      setMessage('Backup importado');
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al importar');
      setMessage(undefined);
    }
  };

  return (
    <GlassContainer strong className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-black/30 border border-b flex items-center justify-center">
            <Info size={16} className="text-o" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[.18em] text-tx">Respaldos</div>
            <div className="text-[9px] font-bold text-f uppercase tracking-[.18em]">Export / Import</div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
          }}
        />
        <IconButton Icon={Upload} onClick={() => fileInputRef.current?.click()} label="Importar" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="h-11 rounded-2xl bg-o text-black text-[10px] font-black uppercase tracking-[.18em] flex items-center justify-center gap-2 active:scale-[.99]"
        >
          <Download size={14} /> {t('action.export', 'Exportar')}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-11 rounded-2xl border border-white/15 text-[10px] font-black uppercase tracking-[.18em] text-tx flex items-center justify-center gap-2 active:scale-[.99] bg-black/30"
        >
          <Upload size={14} /> {t('action.import', 'Importar')}
        </button>
      </div>

      {lastExport && (
        <div className="text-[9px] font-bold text-f uppercase tracking-[.18em]">Último backup: {new Date(lastExport).toLocaleString()}</div>
      )}
      {message && <div className="text-[9px] font-black uppercase tracking-[.18em] text-ok">{message}</div>}
      {error && <div className="text-[9px] font-black uppercase tracking-[.18em] text-red-400">{error}</div>}
    </GlassContainer>
  );
};
