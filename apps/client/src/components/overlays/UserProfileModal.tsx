import type { IUser } from "@nexus/shared/src/types";
import { Modal } from "./Modal";

interface UserProfileModalProps {
  user: IUser;
  onClose: () => void;
}

export const UserProfileModal = ({ user, onClose }: UserProfileModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className="mb-3 h-24 rounded-lg bg-primary-container/30" />
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-surface-container-highest" />
        <div>
          <h3 className="font-headline text-xl">{user.displayName}</h3>
          <p className="text-sm text-on-surface-variant">@{user.username}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-on-surface-variant">Status: {user.customStatus || user.status}</p>
    </Modal>
  );
};
