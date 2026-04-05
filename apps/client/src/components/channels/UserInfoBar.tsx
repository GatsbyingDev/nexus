import { useAuthStore } from "@/stores/authStore";
import { useVoiceStore } from "@/stores/voiceStore";

export const UserInfoBar = () => {
  const user = useAuthStore((s) => s.user);
  const toggleMute = useVoiceStore((s) => s.toggleMute);
  const toggleDeafen = useVoiceStore((s) => s.toggleDeafen);

  return (
    <div className="flex items-center gap-2 border-t border-outline-variant bg-surface-container-low p-2">
      <div className="relative h-8 w-8 rounded-full bg-surface-container-highest">
        {user?.avatar && <img src={user.avatar} alt={user.displayName} className="h-full w-full rounded-full object-cover" />}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-tertiary ring-2 ring-surface-container-low" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user?.displayName ?? "Guest"}</p>
        <p className="truncate text-xs text-on-surface-variant">{user?.status ?? "offline"}</p>
      </div>
      <button onClick={toggleMute} className="rounded px-2 py-1 text-xs hover:bg-surface-container">Mic</button>
      <button onClick={toggleDeafen} className="rounded px-2 py-1 text-xs hover:bg-surface-container">Headset</button>
    </div>
  );
};
