"use client"

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { RefreshCw } from "lucide-react";
import { 
  DOLLAR_TYPE_COLORS, 
  DOLLAR_TYPE_NAMES, 
  TIME_RANGE_OPTIONS,
  DEFAULT_ACTIVE_TYPES
} from "@/config/constants";
import Header from "@/components/Header";
import DollarTicker from "@/components/DollarTicker";
import DollarCards from "@/components/DollarCards";
import HistoricalChart from "@/components/HistoricalChart";
import CurrencyConverter from "@/components/CurrencyConverter";
import HelpTooltip from "@/components/HelpTooltip";
import Footer from "@/components/Footer";

const AUTO_REFRESH_MINUTES = 5

export default function Home() {
  const [dollarRates, setDollarRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [theme, setTheme] = useState("light")
  const [historicalData, setHistoricalData] = useState([])
  const [activeTypes, setActiveTypes] = useState(["oficial", "blue"])
  const [timeRange, setTimeRange] = useState("30d")
  const [showHelp, setShowHelp] = useState(true)

  // Fetch current dollar rates
  const fetchDollarRates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("https://dolarapi.com/v1/dolares")
      if (!response.ok) {
        throw new Error("No se pudo cargar la información")
      }
      const data = await response.json()
      setDollarRates(data)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [])

  // Fetch historical dollar rates
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch("/api/historical-dollar")
      if (!response.ok) {
        throw new Error("Failed to fetch historical data")
      }
      const data = await response.json()
      setHistoricalData(processHistoricalData(data))
    } catch (err) {
      console.error("Error fetching historical data:", err)
      generateMockHistoricalData()
    }
  }

  // Process historical data for the chart
  const processHistoricalData = (data) => {
    const dataMap = new Map()

    data.forEach((item) => {
      const date = new Date(item.fecha).toISOString().split("T")[0]

      if (!dataMap.has(date)) {
        dataMap.set(date, { date: date })
      }

      const entry = dataMap.get(date)
      if (item.casa) {
        entry[item.casa] = Number.parseFloat(item.venta).toFixed(2)
      }
    })

    return Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // Generate mock historical data as fallback
  const generateMockHistoricalData = () => {
    const today = new Date()
    const data = []

    for (let i = 90; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const baseValue = 900
      const entry = { date: dateStr }
      entry.oficial = (baseValue + Math.random() * 50).toFixed(2)
      entry.blue = (baseValue * (1.5 + Math.random() * 0.3)).toFixed(2)

      data.push(entry)
    }

    setHistoricalData(data)
  }

  // Generate mini chart data for each dollar type
  const generateMiniChartData = (type) => {
    if (!historicalData.length) return []

    return [...historicalData]
      .slice(-7)
      .filter((item) => item[type])
      .map((item) => ({
        date: item.date,
        value: Number.parseFloat(item[type]),
      }))
  }

  // Toggle dollar type in chart
  const toggleDollarType = (type) => {
    if (activeTypes.includes(type)) {
      if (activeTypes.length > 1) {
        setActiveTypes(activeTypes.filter((t) => t !== type))
      }
    } else {
      setActiveTypes([...activeTypes, type])
    }

    if (showHelp) {
      setShowHelp(false)
    }
  }

  // Calculate percentage change for a dollar type
  const calculateChange = (type) => {
    if (!historicalData.length) return { value: 0, isUp: true }

    const filteredData = historicalData.filter((item) => item[type])
    if (filteredData.length < 2) return { value: 0, isUp: true }

    const latest = Number.parseFloat(filteredData[filteredData.length - 1][type])
    const previous = Number.parseFloat(filteredData[filteredData.length - 2][type])

    const change = ((latest - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(2),
      isUp: change >= 0,
    }
  }

  // Get min and max values for a mini chart
  const getMiniChartMinMax = (data) => {
    if (!data || data.length === 0) return { min: 0, max: 0 }

    const values = data.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const buffer = (max - min) * 0.1

    return { min: min - buffer, max: max + buffer }
  }

  // Filter data by time range
  const getFilteredData = () => {
    if (!historicalData.length) return []

    const now = new Date()
    let filtered = [...historicalData]

    switch (timeRange) {
      case "7d": {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(now.getDate() - 7)
        filtered = filtered.filter((item) => new Date(item.date) >= sevenDaysAgo)
        break
      }
      case "30d": {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(now.getDate() - 30)
        filtered = filtered.filter((item) => new Date(item.date) >= thirtyDaysAgo)
        break
      }
      case "90d": {
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(now.getDate() - 90)
        filtered = filtered.filter((item) => new Date(item.date) >= ninetyDaysAgo)
        break
      }
      case "all":
        break
    }

    return filtered
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark")
  }

  // Initialize theme and fetch data
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

    setTheme(savedTheme)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }

    fetchDollarRates()
    fetchHistoricalData()
  }, [fetchDollarRates])

  // Auto-refresh cotizaciones cada N minutos
  useEffect(() => {
    if (!lastUpdated || error) return
    const interval = setInterval(fetchDollarRates, AUTO_REFRESH_MINUTES * 60 * 1000)
    return () => clearInterval(interval)
  }, [lastUpdated, error, fetchDollarRates])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"}`}
    >
      <Head>
        <title>Cotización del Dólar en Argentina</title>
        <meta name="description" content="Cotización actualizada del dólar en Argentina: oficial, blue, bolsa, cripto y más." />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <DollarTicker dollarRates={dollarRates} theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cotizaciones actuales</h2>
            {lastUpdated && !error && (
              <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Última actualización: {lastUpdated.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {error && (
              <span className={`text-sm ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>{error}</span>
            )}
            <button
              onClick={fetchDollarRates}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium ${theme === "dark" ? "bg-[hsl(var(--primary))] hover:opacity-90" : "bg-[hsl(var(--primary))] hover:opacity-90"} text-white transition-all shadow-sm`}
              disabled={loading}
              aria-label="Actualizar cotizaciones"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>
          </div>
        </div>

        <HelpTooltip theme={theme} showHelp={showHelp} setShowHelp={setShowHelp} />

        <DollarCards
          dollarRates={dollarRates}
          loading={loading}
          error={error}
          onRetry={fetchDollarRates}
          theme={theme}
          activeTypes={activeTypes}
          toggleDollarType={toggleDollarType}
          generateMiniChartData={generateMiniChartData}
          calculateChange={calculateChange}
          getMiniChartMinMax={getMiniChartMinMax}
          dollarTypeColors={DOLLAR_TYPE_COLORS}
        />

        <HistoricalChart
          theme={theme}
          historicalData={historicalData}
          getFilteredData={getFilteredData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          activeTypes={activeTypes}
          toggleDollarType={toggleDollarType}
          dollarTypeColors={DOLLAR_TYPE_COLORS}
          dollarTypeNames={DOLLAR_TYPE_NAMES}
        />

        <CurrencyConverter 
          dollarTypes={dollarRates} 
          theme={theme} 
        />
      </main>

      <Footer theme={theme} />
    </div>
  )
}