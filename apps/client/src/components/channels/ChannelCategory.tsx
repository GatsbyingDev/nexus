import { useState, type PropsWithChildren } from "react";

interface ChannelCategoryProps extends PropsWithChildren {
  title: string;
}

export const ChannelCategory = ({ title, children }: ChannelCategoryProps) => {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-1 flex w-full items-center justify-between px-2 text-left text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant"
      >
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && <div>{children}</div>}
    </section>
  );
};
