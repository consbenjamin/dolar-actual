"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Sun, Moon, RefreshCw, ArrowUp, ArrowDown, CheckSquare, Square, HelpCircle, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from "recharts"

export default function Home() {
  const [dollarRates, setDollarRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState("light")
  const [historicalData, setHistoricalData] = useState([])
  const [activeTypes, setActiveTypes] = useState(["oficial", "blue"])
  const [timeRange, setTimeRange] = useState("30d") // '7d', '30d', '90d', 'all'
  const [showHelp, setShowHelp] = useState(true)

  // Fetch current dollar rates
  const fetchDollarRates = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://dolarapi.com/v1/dolares")
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const data = await response.json()
      setDollarRates(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Fetch historical dollar rates
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch("/api/historical-dollar")
      if (!response.ok) {
        throw new Error("Failed to fetch historical data")
      }
      const data = await response.json()

      // Process the data for the chart
      const processedData = processHistoricalData(data)
      setHistoricalData(processedData)
    } catch (err) {
      console.error("Error fetching historical data:", err)
      // Fallback to mock data if API fails
      generateMockHistoricalData()
    }
  }

  // Process historical data for the chart
  const processHistoricalData = (data) => {
    // Group data by date and dollar type
    const dataMap = new Map()

    data.forEach((item) => {
      const date = new Date(item.fecha).toISOString().split("T")[0] // YYYY-MM-DD

      if (!dataMap.has(date)) {
        dataMap.set(date, {
          date: date,
        })
      }

      const entry = dataMap.get(date)

      // Add each dollar type as a property
      if (item.casa) {
        entry[item.casa] = Number.parseFloat(item.venta).toFixed(2)
      }
    })

    // Convert map to array and sort by date
    const chartData = Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date))

    return chartData
  }

  // Generate mock historical data as fallback
  const generateMockHistoricalData = () => {
    const today = new Date()
    const data = []

    for (let i = 90; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Base values with some random fluctuation
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

    // Get last 7 days of data for the mini chart
    const last7Days = [...historicalData]
      .slice(-7)
      .filter((item) => item[type])
      .map((item) => ({
        date: item.date,
        value: Number.parseFloat(item[type]),
      }))

    return last7Days
  }

  // Toggle dollar type in chart
  const toggleDollarType = (type) => {
    if (activeTypes.includes(type)) {
      // Don't remove if it's the last active type
      if (activeTypes.length > 1) {
        setActiveTypes(activeTypes.filter((t) => t !== type))
      }
    } else {
      setActiveTypes([...activeTypes, type])
    }

    // Hide help tooltip after first interaction
    if (showHelp) {
      setShowHelp(false)
    }
  }

  // Filter data by time range
  const getFilteredData = () => {
    if (!historicalData.length) return []

    const now = new Date()
    let filtered = [...historicalData]

    switch (timeRange) {
      case "7d":
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(now.getDate() - 7)
        filtered = filtered.filter((item) => new Date(item.date) >= sevenDaysAgo)
        break
      case "30d":
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(now.getDate() - 30)
        filtered = filtered.filter((item) => new Date(item.date) >= thirtyDaysAgo)
        break
      case "90d":
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(now.getDate() - 90)
        filtered = filtered.filter((item) => new Date(item.date) >= ninetyDaysAgo)
        break
      // 'all' case doesn't need filtering
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
    // Check for saved theme
    const savedTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

    setTheme(savedTheme)

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }

    fetchDollarRates()
    fetchHistoricalData()
  }, [])

  // Dollar type colors for the chart
  const dollarTypeColors = {
    oficial: "#4CAF50",
    blue: "#2196F3",
    bolsa: "#FF9800",
    contadoconliqui: "#9C27B0",
    cripto: "#F44336",
    mayorista: "#00BCD4",
    solidario: "#795548",
    turista: "#607D8B",
  }

  // Dollar type display names
  const dollarTypeNames = {
    oficial: "Dólar Oficial",
    blue: "Dólar Blue",
    bolsa: "Dólar Bolsa",
    contadoconliqui: "Contado con Liqui",
    cripto: "Dólar Cripto",
    mayorista: "Dólar Mayorista",
    solidario: "Dólar Solidario",
    turista: "Dólar Turista",
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

    // Add a small buffer for better visualization
    const buffer = (max - min) * 0.1
    return {
      min: min - buffer,
      max: max + buffer,
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <Head>
        <title>Cotización del Dólar en Argentina</title>
        <meta name="description" content="Cotización actualizada del dólar en Argentina" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={`py-4 px-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dólar Argentina</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Cotizaciones Actuales</h2>
          <button
            onClick={fetchDollarRates}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>

        {/* Help tooltip */}
        {showHelp && (
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
        )}

        {error && (
          <div
            className={`p-4 mb-6 rounded-md ${theme === "dark" ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"}`}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading
            ? Array(3)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg shadow-md animate-pulse ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
                  >
                    <div className={`h-6 w-24 mb-4 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    <div className={`h-10 w-32 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
                  </div>
                ))
            : dollarRates.map((rate) => {
                const miniChartData = generateMiniChartData(rate.casa)
                const change = calculateChange(rate.casa)
                const { min, max } = getMiniChartMinMax(miniChartData)
                const isSelected = activeTypes.includes(rate.casa)

                return (
                  <div
                    key={rate.casa}
                    className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"} transition-all duration-200 ${isSelected ? "ring-2" : "hover:shadow-lg"}`}
                    onClick={() => toggleDollarType(rate.casa)}
                    style={{
                      cursor: "pointer",
                      borderLeft: isSelected ? `4px solid ${dollarTypeColors[rate.casa] || "#ccc"}` : "none",
                      ringColor: dollarTypeColors[rate.casa] || "#ccc",
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

                    {/* Mini chart with improved visualization */}
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
                            <YAxis domain={[min, max]} hide={true} />
                            <XAxis dataKey="date" hide={true} />
                            {/* Add reference lines for min and max values */}
                            <ReferenceLine y={min} stroke={theme === "dark" ? "#555" : "#eee"} strokeDasharray="3 3" />
                            <ReferenceLine y={max} stroke={theme === "dark" ? "#555" : "#eee"} strokeDasharray="3 3" />
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

                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      Actualizado: {new Date(rate.fechaActualizacion).toLocaleString("es-AR")}
                    </p>
                  </div>
                )
              })}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Evolución del Dólar</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              ({activeTypes.length} {activeTypes.length === 1 ? "tipo seleccionado" : "tipos seleccionados"})
            </div>
          </div>

          {/* Simple time range selector */}
          <div className="flex rounded-md overflow-hidden">
            {[
              { value: "7d", label: "7D" },
              { value: "30d", label: "30D" },
              { value: "90d", label: "90D" },
              { value: "all", label: "Todo" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm ${
                  timeRange === range.value
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg shadow-md mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          {!historicalData.length ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
                <Legend
                  onClick={(e) => toggleDollarType(e.dataKey)}
                  formatter={(value, entry) => (
                    <span style={{ color: activeTypes.includes(entry.dataKey) ? entry.color : "#999" }}>
                      {dollarTypeNames[value] || value}
                    </span>
                  )}
                />

                {/* Only render lines for active dollar types */}
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
          )}
        </div>
      </main>

      <footer
        className={`py-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Datos proporcionados por{" "}
            <a href="https://dolarapi.com/" target="_blank" rel="noopener noreferrer" className="underline">
              DolarAPI
            </a>{" "}
            y{" "}
            <a href="https://argentinadatos.com/" target="_blank" rel="noopener noreferrer" className="underline">
              ArgentinaDatos
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

