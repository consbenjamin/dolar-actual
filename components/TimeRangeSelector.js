import { TIME_RANGE_OPTIONS } from "@/config/constants";

export default function TimeRangeSelector({ theme, timeRange, setTimeRange }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-[hsl(var(--border))]">
      {TIME_RANGE_OPTIONS.map((range) => (
        <button
          key={range.value}
          onClick={() => setTimeRange(range.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            timeRange === range.value
              ? "bg-[hsl(var(--primary))] text-white"
              : theme === "dark"
                ? "bg-[hsl(var(--muted))] text-gray-300 hover:bg-gray-600"
                : "bg-[hsl(var(--muted))] text-gray-700 hover:bg-gray-200"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}