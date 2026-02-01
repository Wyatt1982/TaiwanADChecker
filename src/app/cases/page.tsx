'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { penaltyCases, categoryLabels, formatCurrency, formatDate } from '@/data/regulations'
import styles from './page.module.css'

type CategoryFilter = 'ALL' | string

export default function CasesPage() {
    const [filter, setFilter] = useState<CategoryFilter>('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    // 搜尋與篩選邏輯
    const filteredCases = useMemo(() => {
        let cases = penaltyCases

        // 類別篩選
        if (filter !== 'ALL') {
            cases = cases.filter(c => c.category === filter)
        }

        // 關鍵字搜尋
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            cases = cases.filter(c =>
                c.title.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query) ||
                c.violationText.toLowerCase().includes(query) ||
                c.violationType.toLowerCase().includes(query)
            )
        }

        return cases
    }, [filter, searchQuery])

    // 計算統計 (基於篩選後的結果)
    const totalFines = filteredCases.reduce((sum, c) => sum + c.fineAmount, 0)
    const avgFine = filteredCases.length > 0 ? Math.round(totalFines / filteredCases.length) : 0

    // 取得所有類別
    const categories = [...new Set(penaltyCases.map(c => c.category))]

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>開罰案例庫</h1>
                        <p className={styles.subtitle}>
                            真實的違規開罰案例，從這些案例中學習如何避免觸法
                        </p>
                    </div>

                    {/* 搜尋框 */}
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="搜尋案例關鍵字（如：膠原蛋白、治療、保證...）"
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

                    {/* 統計 */}
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{filteredCases.length}</span>
                            <span className={styles.statLabel}>
                                {searchQuery || filter !== 'ALL' ? '筆符合結果' : '件案例'}
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{formatCurrency(totalFines)}</span>
                            <span className={styles.statLabel}>總罰款金額</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{formatCurrency(avgFine)}</span>
                            <span className={styles.statLabel}>平均罰款</span>
                        </div>
                    </div>

                    {/* 篩選 */}
                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterBtn} ${filter === 'ALL' ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            全部
                        </button>
                        {categories.map(category => {
                            const info = categoryLabels[category] || { label: category, icon: '📋' }
                            return (
                                <button
                                    key={category}
                                    className={`${styles.filterBtn} ${filter === category ? styles.filterBtnActive : ''}`}
                                    onClick={() => setFilter(category)}
                                >
                                    {info.icon} {info.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* 案例列表 */}
                    <div className={styles.casesList}>
                        {filteredCases.map(caseItem => {
                            const categoryInfo = categoryLabels[caseItem.category] || { label: caseItem.category, icon: '📋' }

                            return (
                                <article key={caseItem.id} className={styles.caseCard}>
                                    <div className={styles.caseHeader}>
                                        <span className={styles.categoryBadge}>
                                            {categoryInfo.icon} {categoryInfo.label}
                                        </span>
                                        <span className={styles.caseDate}>{formatDate(caseItem.date)}</span>
                                    </div>

                                    <h3 className={styles.caseTitle}>{caseItem.title}</h3>
                                    <p className={styles.caseDesc}>{caseItem.description}</p>

                                    <div className={styles.violationBox}>
                                        <div className={styles.violationHeader}>
                                            <span className={styles.violationLabel}>⚠️ 違規類型</span>
                                            <span className={styles.violationType}>{caseItem.violationType}</span>
                                        </div>
                                        <blockquote className={styles.violationText}>
                                            {caseItem.violationText}
                                        </blockquote>
                                    </div>

                                    <div className={styles.caseFooter}>
                                        <div className={styles.penaltyInfo}>
                                            <span className={styles.penaltyLabel}>裁罰金額</span>
                                            <span className={styles.penaltyAmount}>{formatCurrency(caseItem.fineAmount)}</span>
                                        </div>
                                        <div className={styles.authority}>
                                            <span className={styles.authorityLabel}>裁罰機關</span>
                                            <span className={styles.authorityName}>{caseItem.authority}</span>
                                        </div>
                                    </div>

                                    {caseItem.source && (
                                        <div className={styles.sourceInfo}>
                                            <span className={styles.sourceLabel}>📄 資料來源：</span>
                                            {caseItem.sourceUrl ? (
                                                <a
                                                    href={caseItem.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.sourceLink}
                                                >
                                                    {caseItem.source} →
                                                </a>
                                            ) : (
                                                <span className={styles.sourceName}>{caseItem.source}</span>
                                            )}
                                        </div>
                                    )}
                                </article>
                            )
                        })}
                    </div>

                    {filteredCases.length === 0 && (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📭</span>
                            <p>此類別尚無案例</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
