/**
 * 食藥署違規廣告爬蟲腳本
 *
 * 資料來源：
 * 1. 食藥膨風廣告專區 - https://www.fda.gov.tw/TC/news.aspx?cid=5085
 *
 * 使用方式：
 * npm run update-cases
 *
 * 可選環境變數：
 * - SCRAPE_MAX_PAGES: 最多抓取頁數，預設 30
 * - SCRAPE_MAX_EMPTY_PAGES: 連續幾頁沒資料就停止，預設 2
 * - SCRAPE_DELAY_MS: 每頁請求間隔，預設 800ms
 */

import * as fs from 'fs'
import * as path from 'path'
import { load } from 'cheerio'

interface ScrapedCase {
    id: string
    title: string
    category: string
    violationType: string
    violationText: string
    url: string
    date: string
    authority: string
    source: string
}

interface ParsedNewsLink {
    href: string
    title: string
    date: string | null
}

const FDA_BASE_URL = 'https://www.fda.gov.tw'
const FDA_TC_BASE_URL = `${FDA_BASE_URL}/TC/`

function getNumberEnv(name: string, fallback: number): number {
    const value = process.env[name]
    if (!value) return fallback

    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const CONFIG = {
    FDA_NEWS_URL: `${FDA_TC_BASE_URL}news.aspx?cid=5085`,
    DELAY_MS: getNumberEnv('SCRAPE_DELAY_MS', 800),
    MAX_PAGES: getNumberEnv('SCRAPE_MAX_PAGES', 30),
    MAX_EMPTY_PAGES: getNumberEnv('SCRAPE_MAX_EMPTY_PAGES', 2),
    OUTPUT_PATH: path.join(__dirname, '../src/data/scraped-cases.json'),
    TS_OUTPUT_PATH: path.join(__dirname, '../src/data/scraped-cases.ts'),
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPage(url: string): Promise<string> {
    console.log(`  🌐 Fetching: ${url}`)

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.text()
}

function decodeHtmlEntities(value: string): string {
    return value
        .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(parseInt(num, 10)))
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
}

function normalizeText(value: string): string {
    return decodeHtmlEntities(value)
        .replace(/\s+/g, ' ')
        .trim()
}

function normalizeUrl(href: string): string {
    return new URL(decodeHtmlEntities(href.trim()), FDA_TC_BASE_URL).toString()
}

function formatDate(year: number, month: number, day: number): string {
    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
}

function extractIsoDate(text: string): string | null {
    const normalized = normalizeText(text)

    const gregorianMatch = normalized.match(/\b(20\d{2})[./-](\d{1,2})[./-](\d{1,2})\b/)
    if (gregorianMatch) {
        return formatDate(Number(gregorianMatch[1]), Number(gregorianMatch[2]), Number(gregorianMatch[3]))
    }

    const rocMatch = normalized.match(/\b(1\d{2})[./-](\d{1,2})[./-](\d{1,2})\b/)
    if (rocMatch) {
        return formatDate(Number(rocMatch[1]) + 1911, Number(rocMatch[2]), Number(rocMatch[3]))
    }

    return null
}

function extractMaxPage(html: string): number | null {
    const matches = [...html.matchAll(/[?&]pn=(\d+)/g)]
        .map((match) => Number(match[1]))
        .filter((value) => Number.isFinite(value))

    if (matches.length === 0) return null
    return Math.max(...matches)
}

function extractDateFromContext(rawTextCandidates: Array<string | undefined>): string | null {
    for (const text of rawTextCandidates) {
        if (!text) continue
        const date = extractIsoDate(text)
        if (date) return date
    }

    return null
}

function parseNewsLinks(html: string): ParsedNewsLink[] {
    const $ = load(html)
    const results = new Map<string, ParsedNewsLink>()

    $('a[href*="newsContent.aspx?cid=5085"]').each((_, element) => {
        const anchor = $(element)
        const hrefAttr = anchor.attr('href')
        if (!hrefAttr) return

        const href = normalizeUrl(hrefAttr)
        const title = normalizeText(anchor.attr('title') || anchor.text())

        if (!title || title.length < 6) return
        if (title.includes('上一頁') || title.includes('下一頁') || title.includes('第一頁') || title.includes('最後一頁')) {
            return
        }

        const date = extractDateFromContext([
            anchor.closest('tr').text(),
            anchor.closest('li').text(),
            anchor.closest('.newslist, .news_list, .list, .list-group-item, article, .row').text(),
            anchor.parent().text(),
        ])

        results.set(href, {
            href,
            title,
            date,
        })
    })

    return Array.from(results.values())
}

function detectCategory(title: string): string {
    const normalized = title.toLowerCase()

    if (
        title.includes('藥品') ||
        title.includes('藥物') ||
        /viagra|cialis|levitra|zolpidem|zopiclone|triazolam|clonazepam|alprazolam|flunitrazepam|halcion/i.test(normalized)
    ) {
        return 'MEDICINE'
    }

    if (title.includes('化粧品') || title.includes('化妝品') || title.includes('隱形眼鏡') || title.includes('保養品')) {
        return 'COSMETICS'
    }

    if (title.includes('醫療器材') || title.includes('血糖') || title.includes('牙科') || title.includes('雷射') || title.includes('診所')) {
        return 'MEDICAL_BEAUTY'
    }

    if (title.includes('酒')) return 'ALCOHOL'
    if (title.includes('菸') || title.includes('電子煙')) return 'TOBACCO'

    return 'HEALTH_FOOD'
}

function detectViolationType(title: string): string {
    if (title.includes('管制藥品')) return '管制藥品廣告'
    if (title.includes('醫療器材')) return '未經核准醫療器材廣告'
    if (title.includes('藥品') || title.includes('藥物')) return '未經核准藥品廣告'
    if (title.includes('化粧品') || title.includes('化妝品')) return '化粧品違規廣告'
    return '違規廣告'
}

function createStableId(url: string, index: number): string {
    const urlObject = new URL(url)
    const newsId = urlObject.searchParams.get('id')
    return newsId ? `scraped-fda-${newsId}` : `scraped-fda-${index + 1}`
}

function sortCasesByDate(cases: ScrapedCase[]): ScrapedCase[] {
    return [...cases].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()

        if (dateA !== dateB) return dateB - dateA
        return a.title.localeCompare(b.title, 'zh-Hant')
    })
}

async function scrapeFDANews(maxPages: number = CONFIG.MAX_PAGES): Promise<ScrapedCase[]> {
    const scrapedCases: ScrapedCase[] = []
    const seenUrls = new Set<string>()
    let effectiveMaxPages = maxPages
    let emptyPageCount = 0

    console.log('🔍 開始爬取食藥膨風廣告專區...')
    console.log(`   預設最多頁數: ${maxPages}`)

    for (let page = 1; page <= effectiveMaxPages; page++) {
        console.log(`\n📄 正在爬取第 ${page} 頁...`)

        try {
            const url = `${CONFIG.FDA_NEWS_URL}&pn=${page}`
            const html = await fetchPage(url)

            if (page === 1) {
                const discoveredMaxPage = extractMaxPage(html)
                if (discoveredMaxPage) {
                    effectiveMaxPages = Math.min(maxPages, discoveredMaxPage)
                    console.log(`   🔢 偵測到總頁數約 ${discoveredMaxPage} 頁，本次最多抓取 ${effectiveMaxPages} 頁`)
                }
            }

            const links = parseNewsLinks(html)
            console.log(`   找到 ${links.length} 個連結`)

            if (links.length === 0) {
                emptyPageCount += 1
                if (emptyPageCount >= CONFIG.MAX_EMPTY_PAGES) {
                    console.log(`   ⏹️ 連續 ${CONFIG.MAX_EMPTY_PAGES} 頁無資料，提前停止`)
                    break
                }

                await delay(CONFIG.DELAY_MS)
                continue
            }

            emptyPageCount = 0

            for (const link of links) {
                if (seenUrls.has(link.href)) continue
                seenUrls.add(link.href)

                const caseItem: ScrapedCase = {
                    id: createStableId(link.href, scrapedCases.length),
                    title: link.title,
                    category: detectCategory(link.title),
                    violationType: detectViolationType(link.title),
                    violationText: `「${link.title}」`,
                    url: link.href,
                    date: link.date || new Date().toISOString().split('T')[0],
                    authority: '衛生福利部食品藥物管理署',
                    source: '食藥膨風廣告專區',
                }

                scrapedCases.push(caseItem)
                console.log(`   ✅ ${link.title.substring(0, 60)}...`)
            }

            await delay(CONFIG.DELAY_MS)
        } catch (error) {
            console.error(`  ❌ 爬取第 ${page} 頁失敗:`, error)
        }
    }

    const sortedCases = sortCasesByDate(scrapedCases)
    console.log(`\n✅ 完成！共爬取 ${sortedCases.length} 筆案例`)
    return sortedCases
}

function saveToFile(cases: ScrapedCase[]): void {
    const outputData = {
        lastUpdated: new Date().toISOString(),
        totalCount: cases.length,
        cases,
    }

    const dir = path.dirname(CONFIG.OUTPUT_PATH)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(CONFIG.OUTPUT_PATH, JSON.stringify(outputData, null, 2), 'utf-8')
    console.log(`\n💾 JSON 已儲存至 ${CONFIG.OUTPUT_PATH}`)
}

function escapeTsString(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function generateTypeScriptCode(cases: ScrapedCase[]): void {
    const lines: string[] = []

    lines.push('// 自動爬取的案例')
    lines.push(`// 產生時間: ${new Date().toISOString()}`)
    lines.push('// 來源: 食藥署膨風廣告專區')
    lines.push('')
    lines.push('export const scrapedCases = [')

    cases.forEach((c) => {
        lines.push('    {')
        lines.push(`        id: '${escapeTsString(c.id)}',`)
        lines.push(`        category: '${escapeTsString(c.category)}',`)
        lines.push(`        title: '${escapeTsString(c.title)}',`)
        lines.push("        description: '食藥署公告違規廣告案例',")
        lines.push(`        violationType: '${escapeTsString(c.violationType)}',`)
        lines.push(`        violationText: '${escapeTsString(c.violationText)}',`)
        lines.push("        penalty: '移送地方衛生局處辦',")
        lines.push('        fineAmount: 0,')
        lines.push(`        date: '${escapeTsString(c.date)}',`)
        lines.push(`        authority: '${escapeTsString(c.authority)}',`)
        lines.push(`        source: '${escapeTsString(c.source)}',`)
        lines.push(`        sourceUrl: '${escapeTsString(c.url)}'`)
        lines.push('    },')
    })

    lines.push(']')

    fs.writeFileSync(CONFIG.TS_OUTPUT_PATH, lines.join('\n'), 'utf-8')
    console.log(`📝 TypeScript 已產生至 ${CONFIG.TS_OUTPUT_PATH}`)
}

async function main(): Promise<void> {
    console.log('🚀 食藥署違規廣告爬蟲啟動')
    console.log('='.repeat(50))
    console.log(`頁數上限: ${CONFIG.MAX_PAGES}`)
    console.log(`連續空頁停止門檻: ${CONFIG.MAX_EMPTY_PAGES}`)

    try {
        const cases = await scrapeFDANews(CONFIG.MAX_PAGES)

        if (cases.length > 0) {
            saveToFile(cases)
            generateTypeScriptCode(cases)
        } else {
            console.log('⚠️ 未爬取到任何案例')
        }

        console.log('\n' + '='.repeat(50))
        console.log('🎉 爬蟲執行完成！')
    } catch (error) {
        console.error('❌ 爬蟲執行失敗:', error)
        process.exit(1)
    }
}

main()
