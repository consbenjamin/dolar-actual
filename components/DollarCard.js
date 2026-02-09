import { CheckSquare, Square, ArrowUp, ArrowDown } from "lucide-react"
import MiniChart from "@/components/MiniChart";

export default function DollarCard({
  rate,
  theme,
  isSelected,
  toggleDollarType,
  miniChartData,
  change,
  minMax,
  dollarTypeColors
}) {
  const accentColor = dollarTypeColors[rate.casa] || "#94a3b8"

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => toggleDollarType(rate.casa)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleDollarType(rate.casa)}
      className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer select-none ${theme === "dark" ? "bg-[hsl(var(--card))] border-gray-700" : "bg-[hsl(var(--card))] border-gray-200"} ${isSelected ? "ring-2 shadow-lg" : "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"}`}
      style={{
        borderLeft: `4px solid ${isSelected ? accentColor : "transparent"}`,
        "--tw-ring-color": accentColor,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {isSelected ? (
            <CheckSquare size={18} className="text-blue-500" />
          ) : (
            <Square size={18} className="text-gray-400" />
          )}
          <h3 className="text-lg font-medium">{rate.nombre}</h3>
        </div>
        <div className={`flex items-center text-sm ${change.isUp ? "text-green-500" : "text-red-500"}`}>
          {change.isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span>{change.value}%</span>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Compra</p>
          <p className="text-2xl font-bold">
            ${rate.compra === "No Cotiza" ? "-" : Number.parseFloat(rate.compra).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Venta</p>
          <p className="text-2xl font-bold">${Number.parseFloat(rate.venta).toFixed(2)}</p>
        </div>
      </div>

      <MiniChart 
        rate={rate} 
        theme={theme} 
        miniChartData={miniChartData} 
        minMax={minMax} 
        dollarTypeColors={dollarTypeColors} 
      />

      <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
        Actualizado: {new Date(rate.fechaActualizacion).toLocaleString("es-AR")}
      </p>
    </div>
  )
}