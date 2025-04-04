import { TIME_RANGE_OPTIONS } from "@/config/constants";

export default function TimeRangeSelector({ theme, timeRange, setTimeRange }) {
  return (
    <div className="flex rounded-md overflow-hidden">
      {TIME_RANGE_OPTIONS.map((range) => (
        <button
          key={range.value}
          onClick={() => setTimeRange(range.value)}
          className={`px-3 py-1 text-sm ${
            timeRange === range.value
              ? theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}