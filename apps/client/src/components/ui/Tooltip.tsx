import { type PropsWithChildren, useState } from "react";

interface TooltipProps extends PropsWithChildren {
  content: string;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-surface-container-high px-2 py-1 text-xs text-on-surface">
          {content}
        </span>
      )}
    </span>
  );
};
