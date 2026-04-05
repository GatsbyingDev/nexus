import { AddServerButton } from "@/components/navigation/AddServerButton";
import { ServerIcon } from "@/components/navigation/ServerIcon";

export const ServerSidebar = () => (
  <aside className="flex w-[72px] flex-col items-center gap-2 border-r border-outline-variant bg-surface-container-low py-3">
    <ServerIcon active label="N" />
    <ServerIcon label="Dev" />
    <ServerIcon label="UI" />
    <AddServerButton />
  </aside>
);
