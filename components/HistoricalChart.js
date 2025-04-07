import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import TimeRangeSelector from "@/components/TimeRangeSelector"
import ChartLegend from "@/components/ChartLegend"

export default function HistoricalChart({
  theme,
  historicalData,
  getFilteredData,
  timeRange,
  setTimeRange,
  activeTypes,
  toggleDollarType,
  dollarTypeColors,
  dollarTypeNames
}) {
  if (!historicalData.length) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Evolución del Dólar</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            ({activeTypes.length} {activeTypes.length === 1 ? "tipo seleccionado" : "tipos seleccionados"})
          </div>
        </div>
        
        <TimeRangeSelector theme={theme} timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      {/* Gráfico */}
      <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={getFilteredData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#444" : "#eee"} />
            <XAxis
              dataKey="date"
              tick={{ fill: theme === "dark" ? "#ccc" : "#333" }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.getDate() + "/" + (date.getMonth() + 1)
              }}
            />
            <YAxis tick={{ fill: theme === "dark" ? "#ccc" : "#333" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "#fff" : "#333",
                border: `1px solid ${theme === "dark" ? "#555" : "#ddd"}`,
              }}
              labelFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-AR")
              }}
              formatter={(value, name) => [`$${value}`, dollarTypeNames[name] || name]}
            />
            <ChartLegend 
              activeTypes={activeTypes} 
              toggleDollarType={toggleDollarType} 
              dollarTypeNames={dollarTypeNames} 
            />

            {Object.keys(dollarTypeColors)
              .filter((type) => activeTypes.includes(type))
              .map((type) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={type}
                  stroke={dollarTypeColors[type]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}