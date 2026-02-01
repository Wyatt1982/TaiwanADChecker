'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { sponsorshipConfig, getRemainingDays, getProgressPercentage } from '@/data/sponsorship'
import styles from './page.module.css'

interface PlatformStats {
    totalReviews: number
    totalKols: number
    monthlyActiveUsers: number
    avgDailyReviews: number
}

export default function SponsorDashboardPage() {
    const [stats, setStats] = useState<PlatformStats>({
        totalReviews: 0,
        totalKols: 0,
        monthlyActiveUsers: 0,
        avgDailyReviews: 0,
    })

    useEffect(() => {
        // 模擬數據 - 實際應用會從 API 獲取
        const savedStats = localStorage.getItem('admin-stats')
        if (savedStats) {
            const parsed = JSON.parse(savedStats)
            setStats({
                totalReviews: parsed.totalReviews || 156,
                totalKols: parsed.totalKols || 23,
                monthlyActiveUsers: 89,
                avgDailyReviews: Math.round(parsed.totalReviews / 30) || 5,
            })
        } else {
            setStats({
                totalReviews: 156,
                totalKols: 23,
                monthlyActiveUsers: 89,
                avgDailyReviews: 5,
            })
        }
    }, [])

    const remainingDays = getRemainingDays()
    const progress = getProgressPercentage()

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>💼 贊助商專區</h1>
                        <p className={styles.subtitle}>
                            感謝您考慮贊助 AI 快審通！以下是平台的運營數據。
                        </p>
                    </div>

                    {/* 平台數據 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>📊 平台數據</h2>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>📝</span>
                                <div className={styles.statContent}>
                                    <span className={styles.statValue}>{stats.totalReviews.toLocaleString()}</span>
                                    <span className={styles.statLabel}>累計審核次數</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>👥</span>
                                <div className={styles.statContent}>
                                    <span className={styles.statValue}>{stats.totalKols}</span>
                                    <span className={styles.statLabel}>註冊 KOL</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>📈</span>
                                <div className={styles.statContent}>
                                    <span className={styles.statValue}>{stats.monthlyActiveUsers}</span>
                                    <span className={styles.statLabel}>月活躍用戶</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>⚡</span>
                                <div className={styles.statContent}>
                                    <span className={styles.statValue}>{stats.avgDailyReviews}</span>
                                    <span className={styles.statLabel}>日均審核次數</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 營運狀態 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>💰 營運狀態</h2>
                        <div className={styles.fundCard}>
                            <div className={styles.fundHeader}>
                                <p className={styles.fundDesc}>
                                    本平台為<strong>公益性質</strong>，提供 KOL 與品牌免費的廣告法規審核服務。
                                    目前依靠社群贊助維持 LLM API 費用與伺服器成本。
                                </p>
                            </div>
                            <div className={styles.fundProgress}>
                                <div className={styles.progressLabel}>
                                    <span>資金進度</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className={styles.fundInfo}>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>目前餘額</span>
                                    <span className={styles.fundValue}>NT$ {sponsorshipConfig.currentBalance.toLocaleString()}</span>
                                </div>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>每月成本</span>
                                    <span className={styles.fundValue}>NT$ {sponsorshipConfig.monthlyCost.toLocaleString()}</span>
                                </div>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>可維持</span>
                                    <span className={styles.fundValue}>{remainingDays} 天</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 贊助方案 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>🎁 贊助方案</h2>
                        <div className={styles.plansGrid}>
                            <div className={`${styles.planCard} ${styles.planGold}`}>
                                <div className={styles.planBadge}>🥇 金級贊助</div>
                                <div className={styles.planPrice}>NT$ 5,000+</div>
                                <ul className={styles.planFeatures}>
                                    <li>✅ 首頁金級贊助商標誌（大）</li>
                                    <li>✅ 品牌連結 + 描述文字</li>
                                    <li>✅ 社群媒體感謝推文</li>
                                    <li>✅ 優先技術支援</li>
                                </ul>
                            </div>
                            <div className={`${styles.planCard} ${styles.planSilver}`}>
                                <div className={styles.planBadge}>🥈 銀級贊助</div>
                                <div className={styles.planPrice}>NT$ 2,000+</div>
                                <ul className={styles.planFeatures}>
                                    <li>✅ 首頁銀級贊助商標誌（中）</li>
                                    <li>✅ 品牌連結</li>
                                    <li>✅ 社群媒體感謝</li>
                                </ul>
                            </div>
                            <div className={`${styles.planCard} ${styles.planBronze}`}>
                                <div className={styles.planBadge}>🥉 銅級贊助</div>
                                <div className={styles.planPrice}>NT$ 500+</div>
                                <ul className={styles.planFeatures}>
                                    <li>✅ 首頁銅級感謝名單</li>
                                    <li>✅ 名稱顯示</li>
                                </ul>
                            </div>
                            <div className={`${styles.planCard} ${styles.planCoffee}`}>
                                <div className={styles.planBadge}>☕ 請喝咖啡</div>
                                <div className={styles.planPrice}>NT$ 100+</div>
                                <ul className={styles.planFeatures}>
                                    <li>✅ 支持者感謝名單</li>
                                    <li>✅ 給開發者溫暖 ☕</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 聯絡方式 */}
                    <section className={styles.section}>
                        <div className={styles.contactCard}>
                            <h2 className={styles.contactTitle}>📧 洽詢贊助</h2>
                            <p className={styles.contactDesc}>
                                如有贊助意願或任何問題，歡迎來信洽詢：
                            </p>
                            <a href="mailto:sponsor@kol-helper.tw" className={styles.contactBtn}>
                                sponsor@kol-helper.tw
                            </a>
                            <div className={styles.contactNote}>
                                <p>或透過以下方式聯繫我們：</p>
                                <ul>
                                    <li>GitHub Sponsors（即將推出）</li>
                                    <li>Buy Me a Coffee（即將推出）</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 返回首頁 */}
                    <div className={styles.backLink}>
                        <Link href="/">← 返回首頁</Link>
                    </div>
                </div>
            </main>
        </>
    )
}
