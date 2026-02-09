import DollarCard from "@/components/DollarCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function DollarCards({ 
  dollarRates, 
  loading, 
  error, 
  onRetry,
  theme, 
  activeTypes, 
  toggleDollarType,
  generateMiniChartData,
  calculateChange,
  getMiniChartMinMax,
  dollarTypeColors
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array(3).fill().map((_, index) => (
          <LoadingSkeleton key={index} theme={theme} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 mb-6 rounded-xl border ${theme === "dark" ? "bg-red-950/30 border-red-800 text-red-200" : "bg-red-50 border-red-200 text-red-800"}`}>
        <p className="mb-3">{error}</p>
        <button
          onClick={() => typeof onRetry === "function" && onRetry()}
          className={`px-4 py-2 rounded-lg font-medium ${theme === "dark" ? "bg-red-800 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"} text-white transition-colors`}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {dollarRates.map((rate) => (
        <DollarCard
          key={rate.casa}
          rate={rate}
          theme={theme}
          isSelected={activeTypes.includes(rate.casa)}
          toggleDollarType={toggleDollarType}
          miniChartData={generateMiniChartData(rate.casa)}
          change={calculateChange(rate.casa)}
          minMax={getMiniChartMinMax(generateMiniChartData(rate.casa))}
          dollarTypeColors={dollarTypeColors}
        />
      ))}
    </div>
  )
}