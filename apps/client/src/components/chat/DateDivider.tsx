interface DateDividerProps {
  date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <div className="my-3 flex items-center gap-3 px-4 text-xs text-on-surface-variant">
      <span className="h-px flex-1 bg-outline-variant" />
      <span>{date}</span>
      <span className="h-px flex-1 bg-outline-variant" />
    </div>
  );
};
