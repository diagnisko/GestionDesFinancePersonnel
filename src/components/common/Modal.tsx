import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidthClass?: string;
}

/**
 * Conteneur de modale générique — utilisé pour toute action isolée
 * (ajout de transaction, confirmation, etc.) afin qu'elle ne soit jamais
 * mélangée à la mise en page d'une page en particulier.
 */
export default function Modal({ isOpen, onClose, title, description, children, maxWidthClass = 'max-w-md' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 animate-fade"
      />
      <div className={`relative w-full ${maxWidthClass} panel shadow-2xl shadow-black/40 p-6 animate-scale-in`}>
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 className="font-display text-lg text-paper">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-paper-faint hover:text-paper transition-colors shrink-0 -mt-1 -mr-1 p-1 rounded"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        {description && <p className="text-sm text-paper-dim mb-5">{description}</p>}
        {children}
      </div>
    </div>
  );
}
