import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-10 duration-300
            ${toast.type === 'success' ? 'bg-white/90 border-[var(--primary-color)]/20' : 'bg-red-50/90 border-red-100'}
          `}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="text-[var(--primary-color)]" size={20} />
          ) : (
            <AlertCircle className="text-red-600" size={20} />
          )}
          
          <p className="text-sm font-bold text-slate-800 pr-4">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
