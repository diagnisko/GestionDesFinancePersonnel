interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const variantClass: Record<string, string> = {
  danger: 'bg-loss hover:bg-loss/90 text-white',
  warning: 'bg-brass hover:bg-brass/90 text-ink-950',
  info: 'bg-info hover:bg-info/90 text-white',
};

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Fermer" onClick={onCancel} className="absolute inset-0 bg-black/70 animate-fade" />
      <div className="relative panel max-w-sm w-full p-6 shadow-2xl shadow-black/40 animate-scale-in">
        <h3 className="font-display text-lg text-paper mb-2">{title}</h3>
        <p className="text-sm text-paper-dim mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border hairline text-paper hover:bg-ink-850 transition-colors text-sm">
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${variantClass[variant]}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
