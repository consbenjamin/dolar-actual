"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rss, RefreshCw, SlidersHorizontal, X } from "lucide-react"
import { RSS_FEEDS, NEWS_KEYWORDS_OPTIONS } from "@/config/constants"

const REFRESH_MINUTES = 15
const STORAGE_KEYWORDS = "dolar-news-keywords"
const STORAGE_SOURCES = "dolar-news-sources"

const defaultKeywordIds = ["dolar", "bcra", "cepo"]
const defaultSourceIds = RSS_FEEDS.map((f) => f.id)

function loadStored(key, defaultValue) {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (_) {}
  return defaultValue
}

export default function NewsFeed({ theme }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedKeywordIds, setSelectedKeywordIds] = useState(defaultKeywordIds)
  const [selectedSourceIds, setSelectedSourceIds] = useState(defaultSourceIds)

  useEffect(() => {
    setSelectedKeywordIds(loadStored(STORAGE_KEYWORDS, defaultKeywordIds))
    setSelectedSourceIds(loadStored(STORAGE_SOURCES, defaultSourceIds))
  }, [])

  const saveKeywords = useCallback((ids) => {
    setSelectedKeywordIds(ids)
    try {
      localStorage.setItem(STORAGE_KEYWORDS, JSON.stringify(ids))
    } catch (_) {}
  }, [])

  const saveSources = useCallback((ids) => {
    setSelectedSourceIds(ids)
    try {
      localStorage.setItem(STORAGE_SOURCES, JSON.stringify(ids))
    } catch (_) {}
  }, [])

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const keywords = selectedKeywordIds
        .map((id) => NEWS_KEYWORDS_OPTIONS.find((o) => o.id === id)?.term)
        .filter(Boolean)
      const sources = selectedSourceIds.filter(Boolean)
      const params = new URLSearchParams()
      if (keywords.length) params.set("keywords", keywords.join(","))
      if (sources.length) params.set("sources", sources.join(","))
      const url = `/api/feed${params.toString() ? `?${params.toString()}` : ""}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Error al cargar noticias")
      const data = await res.json()
      setItems(data.items || [])
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [selectedKeywordIds, selectedSourceIds])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  useEffect(() => {
    if (items.length === 0) return
    const interval = setInterval(fetchFeed, REFRESH_MINUTES * 60 * 1000)
    return () => clearInterval(interval)
  }, [items.length, fetchFeed])

  const toggleKeyword = (id) => {
    const next = selectedKeywordIds.includes(id)
      ? selectedKeywordIds.filter((k) => k !== id)
      : [...selectedKeywordIds, id]
    if (next.length) saveKeywords(next)
  }

  const toggleSource = (id) => {
    const next = selectedSourceIds.includes(id)
      ? selectedSourceIds.filter((s) => s !== id)
      : [...selectedSourceIds, id]
    if (next.length) saveSources(next)
  }

  const isDark = theme === "dark"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative flex flex-col w-full min-h-[280px] lg:h-full lg:min-h-0 overflow-hidden rounded-xl border ${isDark ? "bg-[hsl(var(--card))] border-white/10" : "bg-[hsl(var(--card))] border-black/8"}       shadow-sm`}
    >
      {/* Barra de acento superior (estilo dashboard) */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary))]/70 to-transparent"
        aria-hidden
      />

      <header
        className={`flex items-center justify-between gap-3 px-4 py-3 shrink-0 border-b ${isDark ? "border-white/10" : "border-black/8"}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider ${isDark ? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]" : "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"}`}
          >
            <Rss size={12} className="shrink-0" />
            <span>Feed</span>
          </div>
          <span
            className={`text-sm font-semibold tracking-tight truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            Noticias Argentina
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400 hover:text-gray-200" : "hover:bg-black/5 text-gray-500 hover:text-gray-800"}`}
            aria-label="Filtros"
            title="Filtros"
          >
            <SlidersHorizontal size={18} />
          </button>
          <button
            onClick={fetchFeed}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400 hover:text-gray-200 disabled:opacity-50" : "hover:bg-black/5 text-gray-500 hover:text-gray-800 disabled:opacity-50"}`}
            aria-label="Actualizar"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`shrink-0 overflow-hidden border-b ${isDark ? "border-white/10 bg-white/5" : "border-black/8 bg-black/[0.02]"}`}
          >
          <div className="px-4 py-3 flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Filtros
            </span>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className={`p-1 rounded ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>
          </div>
          <div className="px-4 pb-3 space-y-2.5 text-xs">
            <div>
              <p className="mb-1.5 text-[hsl(var(--muted-foreground))]">Temas</p>
              <div className="flex flex-wrap gap-1.5">
                {NEWS_KEYWORDS_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-colors font-medium ${selectedKeywordIds.includes(opt.id) ? "bg-[hsl(var(--primary))] text-white" : isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-black/5 text-gray-700 hover:bg-black/10"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedKeywordIds.includes(opt.id)}
                      onChange={() => toggleKeyword(opt.id)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[hsl(var(--muted-foreground))]">Fuentes</p>
              <div className="flex flex-wrap gap-1.5">
                {RSS_FEEDS.map((feed) => (
                  <label
                    key={feed.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-colors font-medium ${selectedSourceIds.includes(feed.id) ? "bg-[hsl(var(--primary))] text-white" : isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-black/5 text-gray-700 hover:bg-black/10"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSourceIds.includes(feed.id)}
                      onChange={() => toggleSource(feed.id)}
                      className="sr-only"
                    />
                    {feed.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`news-feed-scroll flex-1 min-h-[180px] lg:min-h-0 max-h-[45vh] sm:max-h-[50vh] lg:max-h-none overflow-y-auto px-0`}
        role="list"
      >
        <AnimatePresence mode="wait">
          {loading && items.length === 0 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 px-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent mb-3"
              />
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Cargando feed…</span>
            </motion.div>
          )}
          {error && items.length === 0 && (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`mx-4 mt-4 p-3 rounded-lg text-xs font-medium ${isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"}`}
            >
              {error}
            </motion.div>
          )}
          {!loading && items.length === 0 && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 px-4 text-center"
            >
              <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                No hay noticias con los filtros elegidos.
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] opacity-80">
                Probá agregar más temas o fuentes.
              </p>
            </motion.div>
          )}
          {items.length > 0 && (
            <motion.ul
              key="list"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } } }}
              className="divide-y divide-[hsl(var(--border))]"
            >
              {items.map((item, index) => (
                <motion.li
                  key={`${item.link}-${index}`}
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.25 }}
                >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col gap-1.5 pl-4 pr-4 py-3 border-l-2 border-transparent hover:border-[hsl(var(--primary))] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-inset ${isDark ? "hover:bg-white/5" : "hover:bg-black/[0.03]"}`}
                >
                  <span
                    className={`text-sm font-medium leading-snug line-clamp-2 ${isDark ? "text-gray-100 group-hover:text-white" : "text-gray-900 group-hover:text-gray-800"}`}
                  >
                    {item.title}
                  </span>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${isDark ? "bg-white/10 text-gray-400" : "bg-black/5 text-gray-500"}`}
                    >
                      {item.source}
                    </span>
                    <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tabular-nums">
                      {item.pubDate
                        ? new Date(item.pubDate).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
