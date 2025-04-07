import axios from "axios"

// Simple in-memory cache
let cachedData = null
let cacheTime = 0
const CACHE_DURATION = 1800 * 1000 //30 minutes

export default async function handler(req, res) {
  try {
    // Check if we have valid cached data
    const now = Date.now()
    if (cachedData && now - cacheTime < CACHE_DURATION) {
      return res.status(200).json(cachedData)
    }

    // If not in cache, fetch from external API
    const response = await axios.get("https://api.argentinadatos.com/v1/cotizaciones/dolares", {
      headers: {
        "Content-Type": "application/json",
      },
    })

    const responseData = response.data

    if (!Array.isArray(responseData) || responseData.length === 0) {
      console.error("Error: Unexpected format from external API.")
      return res.status(500).json({ error: "Internal Server Error" })
    }

    
    const formattedData = responseData.map((dolarData) => ({
      casa: dolarData.casa,
      compra: dolarData.compra,
      venta: dolarData.venta,
      fecha: dolarData.fecha,
    }))

    
    cachedData = formattedData
    cacheTime = now

    return res.status(200).json(formattedData)
  } catch (error) {
    console.error("Error fetching dollar exchange rate:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

