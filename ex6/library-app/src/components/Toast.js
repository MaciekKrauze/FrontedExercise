'use client';
import { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    const color =
        toast.type === 'success'
            ? 'bg-green-500'
            : 'bg-red-500';

    return (
        <div
            className={`${color} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between w-80 animate-slideIn`}
        >
            <span>{toast.message}</span>

            {/* Ikonka X z czystego SVG */}
            <button onClick={() => onClose(toast.id)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
        </div>
    );
}
