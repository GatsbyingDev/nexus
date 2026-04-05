import { useState } from "react";
import type { IMessage } from "@nexus/shared/src/types";
import { ReactionPicker } from "./ReactionPicker";

interface MessageContextMenuProps {
  message: IMessage;
}

export const MessageContextMenu = ({ message }: MessageContextMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="opacity-0 transition group-hover:opacity-100 text-on-surface-variant">
        •••
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 rounded-md border border-outline-variant bg-surface-container p-1 text-xs">
          <button className="block w-full rounded px-2 py-1 text-left hover:bg-surface-container-high">Reply</button>
          <button className="block w-full rounded px-2 py-1 text-left hover:bg-surface-container-high">Edit</button>
          <button className="block w-full rounded px-2 py-1 text-left hover:bg-surface-container-high">Delete</button>
          <div className="mt-1 border-t border-outline-variant pt-1">
            <ReactionPicker onSelect={() => setOpen(false)} />
          </div>
          <p className="mt-1 truncate px-2 text-[10px] text-on-surface-variant">{message._id}</p>
        </div>
      )}
    </div>
  );
};
