import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

const ToastContext = createContext<(message: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number>();

  const show = useCallback((msg: string) => {
    window.clearTimeout(timer.current);
    setMessage(msg);
    setVisible(true);
    timer.current = window.setTimeout(() => setVisible(false), 2600);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {message && <div className={`toast ${visible ? "is-visible" : ""}`}>{message}</div>}
      </div>
    </ToastContext.Provider>
  );
}
