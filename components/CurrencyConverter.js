"use client"
import { useState, useEffect } from "react"
import { AlertCircle, ArrowRight, RefreshCw } from "lucide-react"

export default function CurrencyConverter({ dollarTypes, theme }) {
  const [amount, setAmount] = useState("1000")
  const [selectedType, setSelectedType] = useState("blue")
  const [conversion, setConversion] = useState({ buy: 0, sell: 0 })
  const [errors, setErrors] = useState({ amount: "" })
  const [isCalculated, setIsCalculated] = useState(false)

  const validateAmount = (value) => {
    if (value === "") {
      setErrors({...errors, amount: "Ingrese un monto"})
      return false
    }
    
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setErrors({...errors, amount: "Debe ser un número válido"})
      return false
    }
    
    if (numValue <= 0) {
      setErrors({...errors, amount: "El monto debe ser mayor a 0"})
      return false
    }
    
    setErrors({...errors, amount: ""})
    return true
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value)
      validateAmount(value)
    }
  }

  const handleCalculate = () => {
    if (!validateAmount(amount)) return
    
    const type = dollarTypes.find(t => t.casa === selectedType)
    if (!type) return
    
    const numericAmount = parseFloat(amount)
    setConversion({
      buy: type.compra === "No Cotiza" ? 0 : (numericAmount / parseFloat(type.compra)).toFixed(2),
      sell: (numericAmount / parseFloat(type.venta)).toFixed(2)
    })
    setIsCalculated(true)
  }

  // Resetear calculadora
  const handleReset = () => {
    setAmount("1000")
    setSelectedType("blue")
    setConversion({ buy: 0, sell: 0 })
    setIsCalculated(false)
    setErrors({ amount: "" })
  }

  useEffect(() => {
    if (isCalculated) {
      handleCalculate()
    }
  }, [selectedType])

  return (
    <div className={`p-4 rounded-lg shadow-md mb-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Calculadora de Conversión</h3>
        {isCalculated && (
          <button
            onClick={handleReset}
            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            aria-label="Reiniciar calculadora"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex-1">
          <label htmlFor="amount-input" className="block mb-2 text-sm font-medium">
            Monto en ARS
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              id="amount-input"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              onBlur={() => validateAmount(amount)}
              className={`block w-full pl-8 p-2 rounded border ${errors.amount ? "border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"} ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
              placeholder="Ej: 1000"
              aria-invalid={!!errors.amount}
              aria-describedby="amount-error"
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
              <AlertCircle className="mr-1" size={14} /> {errors.amount}
            </p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="dollar-type" className="block mb-2 text-sm font-medium">
            Tipo de dólar
          </label>
          <select
            id="dollar-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`w-full p-2 rounded border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
          >
            {dollarTypes.map(type => (
              <option key={type.casa} value={type.casa}>{type.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={!!errors.amount}
        className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md ${errors.amount ? "bg-gray-400 cursor-not-allowed" : theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
      >
        Calcular <ArrowRight size={16} />
      </button>

      {conversion.buy > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-600"}`}></span>
            Resultado de la conversión
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-3 rounded bg-white dark:bg-gray-700/50 shadow-sm">
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                Compra
              </p>
              <p className="text-xl font-bold">
                {conversion.buy} <span className="text-sm font-normal">USD</span>
              </p>
            </div>
            <div className="p-3 rounded bg-white dark:bg-gray-700/50 shadow-sm">
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                Venta
              </p>
              <p className="text-xl font-bold">
                {conversion.sell} <span className="text-sm font-normal">USD</span>
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/50">
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <span className="font-medium">Tipo de cambio:</span> 1 USD = {parseFloat(dollarTypes.find(t => t.casa === selectedType)?.venta || 0).toFixed(2)} ARS
            </p>
          </div>
        </div>
      )}
    </div>
  )
}