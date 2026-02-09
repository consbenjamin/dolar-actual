"use client"
import { useState, useEffect, useMemo } from "react"
import { AlertCircle, ArrowRightLeft, RefreshCw } from "lucide-react"

const MODES = { ARS_TO_USD: "ARS_TO_USD", USD_TO_ARS: "USD_TO_ARS" }

export default function CurrencyConverter({ dollarTypes, theme }) {
  const [amount, setAmount] = useState("1000")
  const [selectedType, setSelectedType] = useState("blue")
  const [mode, setMode] = useState(MODES.ARS_TO_USD)
  const [errors, setErrors] = useState({ amount: "" })

  const validateAmount = (value) => {
    if (value === "") {
      setErrors((e) => ({ ...e, amount: "Ingrese un monto" }))
      return false
    }
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setErrors((e) => ({ ...e, amount: "Debe ser un número válido" }))
      return false
    }
    if (numValue <= 0) {
      setErrors((e) => ({ ...e, amount: "El monto debe ser mayor a 0" }))
      return false
    }
    setErrors((e) => ({ ...e, amount: "" }))
    return true
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value)
      validateAmount(value)
    }
  }

  const type = dollarTypes.find((t) => t.casa === selectedType)
  const numericAmount = parseFloat(amount) || 0
  const isValidAmount = numericAmount > 0 && !isNaN(numericAmount)

  const conversion = useMemo(() => {
    if (!type || !isValidAmount) return { buy: 0, sell: 0, arsFromUsd: 0 }
    const compra = type.compra === "No Cotiza" ? 0 : parseFloat(type.compra)
    const venta = parseFloat(type.venta)
    if (mode === MODES.ARS_TO_USD) {
      return {
        buy: compra ? (numericAmount / compra).toFixed(2) : 0,
        sell: (numericAmount / venta).toFixed(2),
        arsFromUsd: null,
      }
    }
    return {
      buy: (numericAmount * compra).toFixed(2),
      sell: (numericAmount * venta).toFixed(2),
      arsFromUsd: numericAmount,
    }
  }, [type, numericAmount, isValidAmount, mode])

  const handleReset = () => {
    setAmount("1000")
    setSelectedType("blue")
    setMode(MODES.ARS_TO_USD)
    setErrors({ amount: "" })
  }

  const showResult = isValidAmount && type && (mode === MODES.USD_TO_ARS ? conversion.sell : Number(conversion.sell) > 0)

  return (
    <div className={`p-6 rounded-xl border mb-6 ${theme === "dark" ? "bg-[hsl(var(--card))] border-gray-700" : "bg-[hsl(var(--card))] border-gray-200"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold tracking-tight">Calculadora</h3>
        <button
          onClick={handleReset}
          className={`p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          aria-label="Reiniciar calculadora"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setMode(mode === MODES.ARS_TO_USD ? MODES.USD_TO_ARS : MODES.ARS_TO_USD)}
        className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border text-sm font-medium ${theme === "dark" ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"}`}
      >
        <ArrowRightLeft size={16} />
        {mode === MODES.ARS_TO_USD ? "ARS → USD" : "USD → ARS"}
      </button>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor="amount-input" className="block mb-2 text-sm font-medium">
            {mode === MODES.ARS_TO_USD ? "Monto en ARS" : "Monto en USD"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {mode === MODES.ARS_TO_USD ? "$" : "US$"}
            </div>
            <input
              id="amount-input"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              onBlur={() => validateAmount(amount)}
              className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.amount ? "border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"} ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
              placeholder={mode === MODES.ARS_TO_USD ? "Ej: 1000" : "Ej: 100"}
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
            className={`w-full py-2.5 px-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
          >
            {dollarTypes.map((t) => (
              <option key={t.casa} value={t.casa}>{t.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {showResult && (
        <div className={`mt-4 p-4 rounded-xl ${theme === "dark" ? "bg-primary/10 border border-primary/20" : "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"}`}>
          <h4 className="font-semibold text-sm mb-3 uppercase tracking-wide opacity-80">Resultado</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
              <p className="text-sm opacity-80">Compra</p>
              <p className="text-xl font-bold font-mono">
                {mode === MODES.ARS_TO_USD ? `${conversion.buy} USD` : `$ ${conversion.buy}`}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
              <p className="text-sm opacity-80">Venta</p>
              <p className="text-xl font-bold font-mono">
                {mode === MODES.ARS_TO_USD ? `${conversion.sell} USD` : `$ ${conversion.sell}`}
              </p>
            </div>
          </div>
          {type && (
            <p className={`mt-3 pt-3 border-t text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              1 USD = {parseFloat(type.venta).toFixed(2)} ARS (venta)
            </p>
          )}
        </div>
      )}
    </div>
  )
}