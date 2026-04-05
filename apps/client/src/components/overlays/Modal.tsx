import { type PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren {
  onClose?: () => void;
}

export const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container p-5" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
