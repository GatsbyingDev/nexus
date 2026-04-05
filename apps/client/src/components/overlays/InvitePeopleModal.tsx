import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "./Modal";

interface InvitePeopleModalProps {
  inviteLink: string;
  onClose: () => void;
}

export const InvitePeopleModal = ({ inviteLink, onClose }: InvitePeopleModalProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <Modal onClose={onClose}>
      <h3 className="font-headline text-xl">Invite People</h3>
      <div className="mt-4 flex gap-2">
        <input value={inviteLink} readOnly className="flex-1 rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" />
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            toast.success("Invite copied");
          }}
          className="rounded bg-primary-container px-3 py-2 text-sm font-semibold text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </Modal>
  );
};
