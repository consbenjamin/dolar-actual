export const DOLLAR_TYPE_COLORS = {
  oficial: "#4CAF50",
  blue: "#2196F3",
  bolsa: "#FF9800",
  contadoconliqui: "#9C27B0",
  cripto: "#F44336",
  mayorista: "#00BCD4",
  solidario: "#795548",
  turista: "#607D8B",
}

export const DOLLAR_TYPE_NAMES = {
  oficial: "Dólar Oficial",
  blue: "Dólar Blue",
  bolsa: "Dólar Bolsa",
  contadoconliqui: "Contado con Liqui",
  cripto: "Dólar Cripto",
  mayorista: "Dólar Mayorista",
  solidario: "Dólar Solidario",
  turista: "Dólar Turista",
}

export const TIME_RANGE_OPTIONS = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "all", label: "Todo" },
]

export const DEFAULT_ACTIVE_TYPES = ["oficial", "blue"]

// Solo fuentes argentinas de economía y noticias (URLs verificadas)
export const RSS_FEEDS = [
  { id: "infobae", url: "https://www.infobae.com/arc/outboundfeeds/rss/", name: "Infobae" },
  { id: "ambito", url: "https://www.ambito.com/rss/pages/economia.xml", name: "Ámbito" },
  { id: "lanacion", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml", name: "La Nación" },
]

// Obligatorio: la noticia debe mencionar Argentina (evita Chile, República Dominicana, etc.)
export const ARGENTINA_CONTEXT_KEYWORDS = [
  "Argentina",
  "argentina",
  "argentino",
  "argentinos",
  "BCRA",
  "Buenos Aires",
  "CABA",
  "peso argentino",
  "Milei",
  "AFIP",
  "Banco Central",
  "dólar blue",
  "dolar blue",
  "cepo cambiario",
  "lanacion.com",
  "infobae.com",
  "ambito.com",
]

// Keywords por defecto: dólar y economía argentina
export const NEWS_KEYWORDS_DEFAULT = [
  "dólar",
  "dolar",
  "BCRA",
  "cepo",
  "tipo de cambio",
  "cotización",
  "inflación",
  "inflacion",
  "economía",
  "economia",
  "reservas",
  "peso",
  "dólar blue",
  "dolar blue",
  "dólar oficial",
  "dolar oficial",
  "Milei",
  "ministerio de economía",
]

// Opciones para personalizar (términos de economía argentina)
export const NEWS_KEYWORDS_OPTIONS = [
  { id: "dolar", label: "Dólar", term: "dólar" },
  { id: "bcra", label: "BCRA", term: "BCRA" },
  { id: "cepo", label: "Cepo", term: "cepo" },
  { id: "inflacion", label: "Inflación", term: "inflación" },
  { id: "economia", label: "Economía", term: "economía" },
  { id: "reservas", label: "Reservas", term: "reservas" },
  { id: "tipo-cambio", label: "Tipo de cambio", term: "tipo de cambio" },
  { id: "peso", label: "Peso", term: "peso" },
  { id: "milei", label: "Milei", term: "Milei" },
  { id: "ministerio", label: "Ministerio de Economía", term: "ministerio de economía" },
]