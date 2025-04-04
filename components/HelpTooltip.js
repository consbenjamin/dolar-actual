import { HelpCircle, X } from "lucide-react"

export default function HelpTooltip({ theme, showHelp, setShowHelp }) {
  if (!showHelp) return null

  return (
    <div
      className={`p-4 mb-6 rounded-md flex items-start gap-3 ${theme === "dark" ? "bg-blue-900/50 text-blue-100" : "bg-blue-50 text-blue-800"} border ${theme === "dark" ? "border-blue-800" : "border-blue-200"}`}
    >
      <HelpCircle className="flex-shrink-0 mt-0.5" size={18} />
      <div>
        <p className="font-medium mb-1">Consejo</p>
        <p className="text-sm">
          Haz clic en las tarjetas para mostrar u ocultar ese tipo de dólar en el gráfico histórico. El borde
          coloreado indica que está seleccionado.
        </p>
      </div>
      <button
        onClick={() => setShowHelp(false)}
        className={`ml-auto p-1 rounded-full ${theme === "dark" ? "hover:bg-blue-800/50" : "hover:bg-blue-100"}`}
        aria-label="Cerrar ayuda"
      >
        <X size={16} />
      </button>
    </div>
  )
}