import DollarCard from "./DollarCard";
import LoadingSkeleton from "./LoadingSkeleton";

export default function DollarCards({ 
  dollarRates, 
  loading, 
  error, 
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
      <div className={`p-4 mb-6 rounded-md ${theme === "dark" ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"}`}>
        {error}
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