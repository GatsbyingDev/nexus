export const UserInfoBar = () => (
  <div className="flex items-center gap-2 border-t border-outline-variant bg-surface-container-low p-2">
    <div className="h-8 w-8 rounded-full bg-surface-container-highest" />
    <div className="flex-1">
      <p className="text-sm font-semibold">Nexus User</p>
      <p className="text-xs text-on-surface-variant">online</p>
    </div>
    <button className="rounded px-2 py-1 text-xs hover:bg-surface-container">Mic</button>
    <button className="rounded px-2 py-1 text-xs hover:bg-surface-container">Headset</button>
  </div>
);
