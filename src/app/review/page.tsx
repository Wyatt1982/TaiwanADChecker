'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ReviewForm } from '@/components/review/ReviewForm'
import { ReviewResult } from '@/components/review/ReviewResult'
import { KolRegistrationModal } from '@/components/KolRegistrationModal'
import { getServiceStatus, isLLMAvailable, ServiceStatus } from '@/data/serviceStatus'
import { parseReviewAudienceMode, reviewModeConfigs, type ReviewAudienceMode } from '@/data/reviewModes'
import { getUsageStatus, canUseReview, recordUsage } from '@/data/usageLimit'
import { isMockAuthEnabled } from '@/lib/mockAuth'
import type { ReviewApiResult } from '@/types/review'
import styles from './page.module.css'

const pageNotes: Record<
    ReviewAudienceMode,
    {
        eyebrow: string
        headline: string
        description: string
        bullets: string[]
    }
> = {
    business: {
        eyebrow: '經營者模式',
        headline: '發布前先做一次乾淨的合規檢查',
        description: '適合美業品牌、小編、診所、KOL 與保健商品團隊。把商品頁、社群貼文、私訊與合作稿先送審，再決定是否上線。',
        bullets: ['高風險語句', '法規依據', '改寫方向'],
    },
    consumer: {
        eyebrow: '消費者模式',
        headline: '下單前先判斷一則廣告是不是講得太滿',
        description: '適合一般消費者與團購跟單者。先辨識可疑點、保留證據，再決定是否相信或是否需要反映。',
        bullets: ['可疑重點', '查證方向', '官方資源'],
    },
}

export default function ReviewPage() {
    const mockAuthEnabled = isMockAuthEnabled()
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReviewApiResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [audienceMode, setAudienceMode] = useState<ReviewAudienceMode>('business')
    const [showKolModal, setShowKolModal] = useState(false)
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null)
    const [isServiceAvailable, setIsServiceAvailable] = useState(true)
    const [usageStatus, setUsageStatus] = useState({ used: 0, limit: 1, remaining: 1, isLoggedIn: false })

    const modeConfig = reviewModeConfigs[audienceMode]
    const note = pageNotes[audienceMode]

    useEffect(() => {
        const queryMode = searchParams.get('mode')
        const savedMode = localStorage.getItem('review-audience-mode')
        const initialMode = queryMode
            ? parseReviewAudienceMode(queryMode)
            : parseReviewAudienceMode(savedMode)

        setAudienceMode(initialMode)

        const registered = localStorage.getItem('kol-registered')
        const skipped = localStorage.getItem('kol-skipped')
        if (initialMode === 'business' && !registered && !skipped) {
            setShowKolModal(true)
        } else {
            setShowKolModal(false)
        }

        const status = getServiceStatus()
        setServiceStatus(status)
        setIsServiceAvailable(isLLMAvailable())
        setUsageStatus(getUsageStatus())

        const handleAuthChange = () => {
            setUsageStatus(getUsageStatus())
        }

        window.addEventListener('auth-change', handleAuthChange)
        return () => window.removeEventListener('auth-change', handleAuthChange)
    }, [searchParams])

    useEffect(() => {
        localStorage.setItem('review-audience-mode', audienceMode)

        const params = new URLSearchParams(searchParams.toString())
        if (params.get('mode') !== audienceMode) {
            params.set('mode', audienceMode)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }

        if (audienceMode === 'consumer') {
            setShowKolModal(false)
        }
    }, [audienceMode, pathname, router, searchParams])

    const handleModeChange = (nextMode: ReviewAudienceMode) => {
        setAudienceMode(nextMode)
        setResult(null)
        setError(null)
    }

    const handleSubmit = async (data: {
        content: string
        productType: string
        contentType: string
        audienceMode: ReviewAudienceMode
    }) => {
        if (!canUseReview()) {
            setError(
                usageStatus.isLoggedIn
                    ? '今日審核次數已達上限（10 次），請明天再試。'
                    : '今日審核次數已達上限，請明天再試。'
            )
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        if (!isLLMAvailable()) {
            const status = getServiceStatus()
            setError(status.maintenanceMessage || '系統維護中，請稍後再試。')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const responseData = await response.json()

            if (response.status === 429) {
                setError(responseData.error || '請求次數超過限制，請稍後再試')
                setUsageStatus((prev) => ({
                    ...prev,
                    remaining: 0,
                }))
                return
            }

            if (!response.ok) {
                throw new Error(responseData.error || '審核服務暫時無法使用')
            }

            setResult(responseData)

            if (responseData.usage) {
                setUsageStatus((prev) => ({
                    ...prev,
                    remaining: responseData.usage.remaining,
                    limit: responseData.usage.limit,
                }))
            } else {
                recordUsage()
                setUsageStatus(getUsageStatus())
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '發生未知錯誤')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />

            {audienceMode === 'business' && (
                <KolRegistrationModal
                    isOpen={showKolModal}
                    onClose={() => setShowKolModal(false)}
                    onSubmit={() => setShowKolModal(false)}
                    onSkip={() => setShowKolModal(false)}
                />
            )}

            <main className={styles.main}>
                <section className={styles.topSection}>
                    <div className={styles.container}>
                        <div className={styles.topGrid}>
                            <div className={styles.topCopy}>
                                <span className={styles.eyebrow}>{note.eyebrow}</span>
                                <h1 className={styles.title}>{modeConfig.pageTitle}</h1>
                                <p className={styles.subtitle}>{note.headline}</p>
                                <p className={styles.lead}>{note.description}</p>

                                <div className={styles.tagRow}>
                                    {note.bullets.map((item) => (
                                        <span key={item} className={styles.tag}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <aside className={styles.summaryCard}>
                                <div className={styles.summaryStat}>
                                    <span>今日剩餘額度</span>
                                    <strong>{usageStatus.remaining}/{usageStatus.limit}</strong>
                                </div>
                                <div className={styles.summaryStat}>
                                    <span>結果類型</span>
                                    <strong>{audienceMode === 'business' ? '送審報告' : '辨識報告'}</strong>
                                </div>
                                {mockAuthEnabled && !usageStatus.isLoggedIn && (
                                    <Link href="/auth/login" className={styles.loginLink}>
                                        登入獲得更多額度
                                    </Link>
                                )}
                            </aside>
                        </div>
                    </div>
                </section>

                {!isServiceAvailable && serviceStatus && (
                    <div className={styles.container}>
                        <div className={styles.maintenanceBanner}>
                            <span className={styles.maintenanceIcon}>🚧</span>
                            <div className={styles.maintenanceContent}>
                                <h3>服務暫停中</h3>
                                <p>{serviceStatus.maintenanceMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <section className={styles.workspace}>
                    <div className={styles.container}>
                        <div className={styles.workspaceGrid}>
                            <div className={styles.formColumn}>
                                <div className={styles.columnLabel}>送審設定</div>
                                <div className={styles.panel}>
                                    <ReviewForm
                                        mode={audienceMode}
                                        onModeChange={handleModeChange}
                                        onSubmit={handleSubmit}
                                        loading={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles.resultColumn}>
                                <div className={styles.columnLabel}>審核結果</div>
                                <div className={styles.panel}>
                                    {loading && (
                                        <div className={styles.loadingState}>
                                            <div className={styles.spinner}></div>
                                            <h3>{modeConfig.loadingTitle}</h3>
                                            <p>{modeConfig.loadingHint}</p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className={styles.errorState}>
                                            <span className={styles.errorIcon}>⚠️</span>
                                            <h3>這次分析沒有完成</h3>
                                            <p>{error}</p>
                                            <button onClick={() => setError(null)} className={styles.retryBtn}>
                                                關閉訊息
                                            </button>
                                        </div>
                                    )}

                                    {result && !loading && (
                                        <ReviewResult
                                            mode={result.audienceMode ?? audienceMode}
                                            riskLevel={result.riskLevel}
                                            riskScore={result.riskScore}
                                            issues={result.issues}
                                            suggestions={result.suggestions}
                                            revisedContent={result.revisedContent}
                                            processingTime={result.processingTime}
                                            provider={result.provider}
                                            similarCases={result.similarCases}
                                            lawSummary={result.lawSummary}
                                        />
                                    )}

                                    {!result && !loading && !error && (
                                        <div className={styles.emptyState}>
                                            <span className={styles.emptyLabel}>尚未送出內容</span>
                                            <h3>{modeConfig.emptyTitle}</h3>
                                            <p>{modeConfig.emptyDescription}</p>
                                            <div className={styles.emptyList}>
                                                {note.bullets.map((item) => (
                                                    <div key={item} className={styles.emptyItem}>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
