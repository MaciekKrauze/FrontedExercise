'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import Toast from './Toast';

export default function ToastContainer({ toasts, removeToast }) {
    const [mounted, setMounted] = useState(false);
    const [root, setRoot] = useState(null);

    useEffect(() => {
        setMounted(true);
        setRoot(document.getElementById("toast-root"));
    }, []);

    if (!mounted || !root) return null;

    return createPortal(
        <div className="fixed top-4 right-4 space-y-3 z-50">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>,
        root
    );
}
