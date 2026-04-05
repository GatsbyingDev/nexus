import { Modal } from "./Modal";

interface ServerSettingsModalProps {
  onClose: () => void;
}

export const ServerSettingsModal = ({ onClose }: ServerSettingsModalProps) => {
  const tabs = ["Overview", "Roles", "Members", "Channels", "Invites", "Danger"];

  return (
    <Modal onClose={onClose}>
      <h3 className="font-headline text-xl">Server Settings</h3>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {tabs.map((tab) => (
          <button key={tab} className="rounded bg-surface-container-low px-3 py-2 text-sm hover:bg-surface-container-high">
            {tab}
          </button>
        ))}
      </div>
    </Modal>
  );
};
