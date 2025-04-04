

export default function ChartLegend({ activeTypes, toggleDollarType, dollarTypeNames }) {
  return (
    <Legend
      onClick={(e) => toggleDollarType(e.dataKey)}
      formatter={(value, entry) => (
        <span style={{ color: activeTypes.includes(entry.dataKey) ? entry.color : "#999" }}>
          {dollarTypeNames[value] || value}
        </span>
      )}
    />
  )
}