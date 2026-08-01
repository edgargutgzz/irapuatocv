export default function ChartSkeleton({ height = 420 }: { height?: number }) {
  return (
    <div className="w-full animate-pulse" style={{ height }}>
      <div className="flex flex-col justify-between h-full pb-8 pr-6 pl-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-2 rounded" style={{ backgroundColor: "var(--gridline)" }} />
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--gridline)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
