export const DMSidebar = () => (
  <aside className="w-[240px] border-r border-outline-variant bg-surface-container p-3">
    <h2 className="mb-3 text-xs font-semibold uppercase text-on-surface-variant">Direct Messages</h2>
    <div className="space-y-1">
      <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-surface-container-high">Alice</button>
      <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-surface-container-high">Bob</button>
    </div>
  </aside>
);
