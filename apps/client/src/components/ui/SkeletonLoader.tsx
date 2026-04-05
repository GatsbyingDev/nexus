interface SkeletonLoaderProps {
  className?: string;
}

export const SkeletonLoader = ({ className = "h-4 w-full" }: SkeletonLoaderProps) => {
  return <div className={`${className} animate-pulse rounded bg-surface-container-high`} />;
};
