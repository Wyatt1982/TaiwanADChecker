/**
 * 食藥署違規廣告爬蟲腳本
 * 
 * 資料來源：
 * 1. 食藥膨風廣告專區 - https://www.fda.gov.tw/TC/news.aspx?cid=5085
 * 
 * 使用方式：
 * npm run scrape
 * 
 * 注意事項：
 * - 請遵守網站使用規範，適當設定爬取間隔
 * - 建議設定排程每週執行一次更新
 */

import * as fs from 'fs'
import * as path from 'path'

// 爬蟲設定
const CONFIG = {
    FDA_NEWS_URL: 'https://www.fda.gov.tw/TC/news.aspx?cid=5085',
    DELAY_MS: 1500,
    MAX_PAGES: 5,
    OUTPUT_PATH: path.join(__dirname, '../src/data/scraped-cases.json'),
    TS_OUTPUT_PATH: path.join(__dirname, '../src/data/scraped-cases.ts'),
}

// 案例介面
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

// 延遲函數
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 發送 HTTP 請求
async function fetchPage(url: string): Promise<string> {
    console.log(`  🌐 Fetching: ${url}`)

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.text()
}

// 根據標題偵測類別
function detectCategory(title: string): string {
    if (title.includes('化粧品') || title.includes('化妝品') || title.includes('隱形眼鏡')) return 'COSMETICS'
    if (title.includes('醫療器材') || title.includes('血糖') || title.includes('牙科') || title.includes('雷射')) return 'MEDICAL_BEAUTY'
    if (title.includes('酒')) return 'ALCOHOL'
    if (title.includes('菸') || title.includes('電子煙')) return 'TOBACCO'
    return 'HEALTH_FOOD'
}

// 根據標題偵測違規類型
function detectViolationType(title: string): string {
    if (title.includes('管制藥品')) return '管制藥品廣告'
    if (title.includes('醫療器材')) return '未經核准醫療器材廣告'
    if (title.includes('藥品') || title.includes('藥物')) return '未經核准藥品廣告'
    return '違規廣告'
}

// 解析 HTML - 根據實際網頁結構
// HTML 結構: <a href="newsContent.aspx?cid=5085&amp;id=XXXXX" title="標題">標題</a>
function parseNewsLinks(html: string): Array<{ title: string; href: string; date: string }> {
    const results: Array<{ title: string; href: string; date: string }> = []

    // 匹配包含 cid=5085 的連結
    // 範例: href="newsContent.aspx?cid=5085&amp;id=31251" title="國外網站..."
    const linkRegex = /<a\s+href=["']newsContent\.aspx\?cid=5085[^"']*id=(\d+)["'][^>]*title=["']([^"']+)["'][^>]*>/gi

    let match
    while ((match = linkRegex.exec(html)) !== null) {
        const id = match[1]
        const title = match[2].trim()
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')

        if (title && title.length > 5) {
            results.push({
                title,
                href: `https://www.fda.gov.tw/TC/newsContent.aspx?cid=5085&id=${id}`,
                date: new Date().toISOString().split('T')[0],
            })
        }
    }

    // 如果上面的模式沒抓到，試試另一種格式
    if (results.length === 0) {
        const altRegex = /<a[^>]*href=["']newsContent\.aspx\?cid=5085[^"']*["'][^>]*>([^<]+)<\/a>/gi
        while ((match = altRegex.exec(html)) !== null) {
            const title = match[1].trim()
            if (title && title.length > 5 && !title.includes('下一頁') && !title.includes('上一頁')) {
                results.push({
                    title,
                    href: `https://www.fda.gov.tw/TC/${match[0].match(/href=["']([^"']+)["']/)?.[1] || ''}`,
                    date: new Date().toISOString().split('T')[0],
                })
            }
        }
    }

    // 嘗試從 HTML 中提取日期
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/g
    const dates: string[] = []
    while ((match = dateRegex.exec(html)) !== null) {
        dates.push(match[0])
    }

    // 將日期分配給結果（簡易對應）
    results.forEach((item, idx) => {
        if (dates[idx]) {
            item.date = dates[idx]
        }
    })

    return results
}

// 爬取食藥膨風廣告專區
async function scrapeFDANews(pages: number = 1): Promise<ScrapedCase[]> {
    const cases: ScrapedCase[] = []
    const seenTitles = new Set<string>()

    console.log('🔍 開始爬取食藥膨風廣告專區...')
    console.log(`   目標頁數: ${pages}`)

    for (let page = 1; page <= pages; page++) {
        console.log(`\n📄 正在爬取第 ${page} 頁...`)

        try {
            const url = `${CONFIG.FDA_NEWS_URL}&pn=${page}`
            const html = await fetchPage(url)

            // 解析連結
            const links = parseNewsLinks(html)
            console.log(`   找到 ${links.length} 個連結`)

            for (const link of links) {
                // 去重
                if (seenTitles.has(link.title)) continue
                seenTitles.add(link.title)

                const caseItem: ScrapedCase = {
                    id: `scraped-${Date.now()}-${cases.length}`,
                    title: link.title,
                    category: detectCategory(link.title),
                    violationType: detectViolationType(link.title),
                    violationText: `「${link.title}」`,
                    url: link.href,
                    date: link.date,
                    authority: '衛生福利部食品藥物管理署',
                    source: '食藥膨風廣告專區',
                }

                cases.push(caseItem)
                console.log(`   ✅ ${link.title.substring(0, 50)}...`)
            }

            await delay(CONFIG.DELAY_MS)
        } catch (error) {
            console.error(`  ❌ 爬取第 ${page} 頁失敗:`, error)
        }
    }

    console.log(`\n✅ 完成！共爬取 ${cases.length} 筆案例`)
    return cases
}

// 儲存到 JSON 檔案
function saveToFile(cases: ScrapedCase[]): void {
    const outputData = {
        lastUpdated: new Date().toISOString(),
        totalCount: cases.length,
        cases: cases,
    }

    const dir = path.dirname(CONFIG.OUTPUT_PATH)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(CONFIG.OUTPUT_PATH, JSON.stringify(outputData, null, 2), 'utf-8')
    console.log(`\n💾 JSON 已儲存至 ${CONFIG.OUTPUT_PATH}`)
}

// 產生 TypeScript 格式的案例程式碼
function generateTypeScriptCode(cases: ScrapedCase[]): void {
    const lines: string[] = []

    lines.push('// 自動爬取的案例')
    lines.push('// 產生時間: ' + new Date().toISOString())
    lines.push('// 來源: 食藥署膨風廣告專區')
    lines.push('')
    lines.push('export const scrapedCases = [')

    cases.forEach((c) => {
        lines.push(`    {`)
        lines.push(`        id: '${c.id}',`)
        lines.push(`        category: '${c.category}',`)
        lines.push(`        title: '${c.title.replace(/'/g, "\\'")}',`)
        lines.push(`        description: '食藥署公告違規廣告案例',`)
        lines.push(`        violationType: '${c.violationType}',`)
        lines.push(`        violationText: '${c.violationText.replace(/'/g, "\\'")}',`)
        lines.push(`        penalty: '移送地方衛生局處辦',`)
        lines.push(`        fineAmount: 0,`)
        lines.push(`        date: '${c.date}',`)
        lines.push(`        authority: '${c.authority}',`)
        lines.push(`        source: '${c.source}',`)
        lines.push(`        sourceUrl: '${c.url}'`)
        lines.push(`    },`)
    })

    lines.push(']')

    fs.writeFileSync(CONFIG.TS_OUTPUT_PATH, lines.join('\n'), 'utf-8')
    console.log(`📝 TypeScript 已產生至 ${CONFIG.TS_OUTPUT_PATH}`)
}

// 主程式
async function main(): Promise<void> {
    console.log('🚀 食藥署違規廣告爬蟲啟動')
    console.log('='.repeat(50))

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
