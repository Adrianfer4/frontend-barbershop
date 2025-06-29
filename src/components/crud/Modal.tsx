import type { ReactNode } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({
  show,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg max-w-lg shadow-xl relative">
        {title && (
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
