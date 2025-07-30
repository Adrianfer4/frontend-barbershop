interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ModalCliente({ show, onClose, title, children }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#c1cccf] p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold transition"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-amber-500 text-center mb-6 uppercase tracking-wide" style={{ fontFamily: "'Russo One', sans-serif" }}>
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}
