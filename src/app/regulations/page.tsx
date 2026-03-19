'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { regulations, penaltyCases, categoryLabels, formatCurrency, formatDate } from '@/data/regulations'
import styles from './page.module.css'

export default function RegulationsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const latestPenaltyCases = penaltyCases.slice(0, 3)

    // 搜尋過濾
    const filteredRegulations = useMemo(() => {
        if (!searchQuery.trim()) return regulations

        const query = searchQuery.toLowerCase()
        return regulations.filter(reg =>
            reg.title.toLowerCase().includes(query) ||
            reg.content.toLowerCase().includes(query) ||
            reg.source.toLowerCase().includes(query) ||
            reg.bannedPhrases.some(phrase => phrase.toLowerCase().includes(query))
        )
    }, [searchQuery])

    // 按類別分組
    const groupedRegulations = filteredRegulations.reduce((acc, reg) => {
        if (!acc[reg.category]) {
            acc[reg.category] = []
        }
        acc[reg.category].push(reg)
        return acc
    }, {} as Record<string, typeof regulations>)

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <span className={styles.eyebrow}>法規中心</span>
                        <h1 className={styles.title}>法規庫</h1>
                        <p className={styles.subtitle}>
                            台灣廣告相關法規彙整，先看條文重點，再切到開罰案例理解實際風險。
                        </p>
                        <div className={styles.libraryTabs}>
                            <Link href="/regulations" className={`${styles.libraryTab} ${styles.libraryTabActive}`}>
                                法規條文
                            </Link>
                            <Link href="/cases" className={styles.libraryTab}>
                                開罰案例
                            </Link>
                        </div>
                    </div>

                    {/* 搜尋框 */}
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="搜尋法規關鍵字（如：治療、保證、效果...）"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                className={styles.clearBtn}
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* 法規統計 */}
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{filteredRegulations.length}</span>
                            <span className={styles.statLabel}>
                                {searchQuery ? '筆符合結果' : '條法規'}
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{Object.keys(groupedRegulations).length}</span>
                            <span className={styles.statLabel}>個類別</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{penaltyCases.length}</span>
                            <span className={styles.statLabel}>件開罰案例</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>4-400萬</span>
                            <span className={styles.statLabel}>罰款範圍</span>
                        </div>
                    </div>

                    <section className={styles.overviewSection}>
                        <div className={styles.overviewIntro}>
                            <span className={styles.sectionTag}>法規中心摘要</span>
                            <h2 className={styles.sectionTitle}>先看條文，再看真實開罰案例</h2>
                            <p className={styles.sectionLead}>
                                條文本身告訴你不能怎麼說，開罰案例則讓你看到實際會踩線的句子。
                                兩者一起看，會比單看法條更容易抓到風險感。
                            </p>
                            <Link href="/cases" className={styles.sectionLink}>
                                前往完整開罰案例庫
                            </Link>
                        </div>

                        <div className={styles.casePreviewPanel}>
                            <div className={styles.casePreviewHeader}>
                                <div>
                                    <span className={styles.sectionTag}>最新案例</span>
                                    <h3 className={styles.casePreviewTitle}>最近更新的開罰案例</h3>
                                </div>
                                <Link href="/cases" className={styles.casePreviewMore}>
                                    查看全部
                                </Link>
                            </div>

                            <div className={styles.casePreviewGrid}>
                                {latestPenaltyCases.map((caseItem) => {
                                    const categoryInfo = categoryLabels[caseItem.category] || { label: caseItem.category, icon: '📋' }

                                    return (
                                        <article key={caseItem.id} className={styles.casePreviewCard}>
                                            <div className={styles.casePreviewMeta}>
                                                <span className={styles.casePreviewBadge}>
                                                    {categoryInfo.icon} {categoryInfo.label}
                                                </span>
                                                <span className={styles.casePreviewDate}>{formatDate(caseItem.date)}</span>
                                            </div>
                                            <h4 className={styles.casePreviewCaseTitle}>{caseItem.title}</h4>
                                            <p className={styles.casePreviewText}>{caseItem.violationText}</p>
                                            <div className={styles.casePreviewFooter}>
                                                <span className={styles.casePreviewAuthority}>{caseItem.authority}</span>
                                                <span className={styles.casePreviewPenalty}>{caseItem.penalty}</span>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 法規列表 */}
                    <div className={styles.regulationsList}>
                        {Object.entries(groupedRegulations).map(([category, regs]) => {
                            const categoryInfo = categoryLabels[category] || { label: category, icon: '📋' }

                            return (
                                <section key={category} className={styles.categorySection}>
                                    <h2 className={styles.categoryTitle}>
                                        <span className={styles.categoryIcon}>{categoryInfo.icon}</span>
                                        {categoryInfo.label}
                                    </h2>

                                    <div className={styles.cardsGrid}>
                                        {regs.map((reg) => (
                                            <article key={reg.id} className={styles.regCard}>
                                                <div className={styles.regHeader}>
                                                    <h3 className={styles.regTitle}>{reg.title}</h3>
                                                    <span className={styles.regSource}>{reg.source}</span>
                                                </div>

                                                <div className={styles.regContent}>
                                                    <p>{reg.content}</p>
                                                </div>

                                                <div className={styles.regPenalty}>
                                                    <span className={styles.penaltyLabel}>罰則</span>
                                                    <span className={styles.penaltyAmount}>
                                                        {formatCurrency(reg.minFine)} ~ {formatCurrency(reg.maxFine)}
                                                    </span>
                                                </div>

                                                {reg.bannedPhrases.length > 0 && (
                                                    <div className={styles.bannedPhrases}>
                                                        <span className={styles.bannedLabel}>⚠️ 禁用詞彙</span>
                                                        <div className={styles.phrasesList}>
                                                            {reg.bannedPhrases.map((phrase, idx) => (
                                                                <span key={idx} className={styles.phraseTag}>
                                                                    {phrase}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {reg.sourceUrl && (
                                                    <a
                                                        href={reg.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.sourceLink}
                                                    >
                                                        查看法規原文 →
                                                    </a>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            )
                        })}
                    </div>

                    {filteredRegulations.length === 0 && (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📭</span>
                            <p>找不到符合「{searchQuery}」的法規</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
