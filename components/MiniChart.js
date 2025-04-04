import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts"

export default function MiniChart({ rate, theme, miniChartData, minMax, dollarTypeColors }) {
  return (
    <div className="h-20 mt-2 relative">
      <div className="absolute top-0 left-0 text-xs text-gray-500 dark:text-gray-400">7 días</div>
      {miniChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={miniChartData} margin={{ top: 15, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${rate.casa}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={dollarTypeColors[rate.casa] || "#8884d8"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={dollarTypeColors[rate.casa] || "#8884d8"}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <YAxis domain={[minMax.min, minMax.max]} hide={true} />
            <XAxis dataKey="date" hide={true} />
            <ReferenceLine y={minMax.min} stroke={theme === "dark" ? "#555" : "#eee"} strokeDasharray="3 3" />
            <ReferenceLine y={minMax.max} stroke={theme === "dark" ? "#555" : "#eee"} strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "#fff" : "#333",
                border: `1px solid ${theme === "dark" ? "#555" : "#ddd"}`,
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, ""]}
              labelFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-AR")
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={dollarTypeColors[rate.casa] || "#8884d8"}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${rate.casa})`}
              dot={{ r: 3, fill: dollarTypeColors[rate.casa] || "#8884d8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No hay datos históricos
        </div>
      )}
    </div>
  )
}