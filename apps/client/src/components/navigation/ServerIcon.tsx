interface ServerIconProps {
  name: string;
  icon?: string;
  active?: boolean;
}

export const ServerIcon = ({ name, icon, active = false }: ServerIconProps) => {
  return (
    <div className="relative group">
      {active && <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-on-surface" />}
      <div className={`grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-surface-container-high transition-all ${active ? "rounded-xl bg-primary-container" : "hover:rounded-xl hover:bg-primary-container"}`}>
        {icon ? (
          <img src={icon} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-on-surface">{name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div className="pointer-events-none absolute left-14 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-surface-container-high px-2 py-1 text-xs text-on-surface group-hover:block">
        {name}
      </div>
    </div>
  );
};
