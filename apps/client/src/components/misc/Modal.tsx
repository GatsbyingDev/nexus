import type { PropsWithChildren } from "react";

export const Modal = ({ children }: PropsWithChildren) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">{children}</div>
);
