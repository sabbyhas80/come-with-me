"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export function Toast({ message, visible, onDismiss }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-lime text-dark font-jakarta font-semibold text-sm px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap">
      {message}
    </div>
  );
}
