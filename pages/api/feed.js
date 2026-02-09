import Parser from "rss-parser"
import { RSS_FEEDS, NEWS_KEYWORDS_DEFAULT, ARGENTINA_CONTEXT_KEYWORDS } from "@/config/constants"

let cachedRawItems = null
let cacheTime = 0
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

function normalizeText(str) {
  if (!str || typeof str !== "string") return ""
  return str
    .normalize("NFD")
    .replace(/\u0300/g, "")
    .toLowerCase()
}

function matchesKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return false
  const normalized = normalizeText(text)
  return keywords.some((kw) => normalized.includes(normalizeText(kw)))
}

export default async function handler(req, res) {
  try {
    const now = Date.now()
    const keywordsParam = req.query.keywords
    const sourcesParam = req.query.sources

    const keywords =
      typeof keywordsParam === "string" && keywordsParam.trim()
        ? keywordsParam.split(",").map((k) => k.trim()).filter(Boolean)
        : NEWS_KEYWORDS_DEFAULT

    const allowedSources =
      typeof sourcesParam === "string" && sourcesParam.trim()
        ? new Set(
            sourcesParam
              .split(",")
              .map((s) => s.trim().toLowerCase())
              .filter(Boolean)
          )
        : null

    // Fetch and cache raw items from all Argentine feeds
    if (!cachedRawItems || now - cacheTime >= CACHE_DURATION) {
      const parser = new Parser({
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; DolarArgentina/1.0; +https://github.com)",
        },
      })
      const allItems = []

      for (const feedConfig of RSS_FEEDS) {
        try {
          const feed = await parser.parseURL(feedConfig.url)
          const items = (feed.items || []).map((item) => ({
            title: item.title || "",
            link: item.link || "",
            pubDate: item.pubDate || "",
            source: feedConfig.name,
            sourceId: feedConfig.id,
            snippet: item.contentSnippet || item.content || "",
          }))
          allItems.push(...items)
        } catch (err) {
          console.warn(`Feed ${feedConfig.name} failed:`, err.message)
        }
      }

      cachedRawItems = allItems
      cacheTime = now
    }

    const fullText = (item) => `${item.title || ""} ${item.snippet || ""}`

    let filtered = cachedRawItems.filter((item) => {
      const matchKeyword =
        matchesKeywords(item.title, keywords) ||
        matchesKeywords(item.snippet, keywords)
      if (!matchKeyword) return false
      // Solo Argentina: debe mencionar explícitamente Argentina (excluye Chile, República Dominicana, etc.)
      const text = fullText(item)
      const matchArgentina =
        ARGENTINA_CONTEXT_KEYWORDS.some((kw) =>
          normalizeText(text).includes(normalizeText(kw))
        )
      if (!matchArgentina) return false
      if (allowedSources === null) return true
      const sourceMatch =
        allowedSources.has((item.sourceId || "").toLowerCase()) ||
        allowedSources.has((item.source || "").toLowerCase())
      return sourceMatch
    })

    filtered.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime()
      const dateB = new Date(b.pubDate).getTime()
      return dateB - dateA
    })

    const result = { items: filtered.slice(0, 50) }
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error fetching RSS feed:", error)
    return res.status(200).json({ items: [] })
  }
}
