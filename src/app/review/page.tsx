'use client'

import { useState, useEffect } from 'react'
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
import styles from './page.module.css'

type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

interface Issue {
    type: string
    text: string
    severity: RiskLevel
    law?: string
    suggestion?: string
}

interface ReviewData {
    riskLevel: RiskLevel
    riskScore: number
    issues: Issue[]
    suggestions: string[]
    revisedContent: string
    processingTime: number
    provider?: 'openai' | 'anthropic' | 'gemini' | 'mock'
    audienceMode?: ReviewAudienceMode
}

export default function ReviewPage() {
    const mockAuthEnabled = isMockAuthEnabled()
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReviewData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [audienceMode, setAudienceMode] = useState<ReviewAudienceMode>('business')
    const [showKolModal, setShowKolModal] = useState(false)
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null)
    const [isServiceAvailable, setIsServiceAvailable] = useState(true)
    const [usageStatus, setUsageStatus] = useState({ used: 0, limit: 1, remaining: 1, isLoggedIn: false })
    const modeConfig = reviewModeConfigs[audienceMode]

    // 檢查是否需要顯示 KOL 註冊表單
    useEffect(() => {
        const savedMode = localStorage.getItem('review-audience-mode')
        const queryMode = searchParams.get('mode')
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

        // 檢查服務狀態
        const status = getServiceStatus()
        setServiceStatus(status)
        setIsServiceAvailable(isLLMAvailable())

        // 取得使用狀態
        setUsageStatus(getUsageStatus())

        // 監聽登入狀態變化
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
        // 檢查使用限制
        if (!canUseReview()) {
            setError(usageStatus.isLoggedIn
                ? '今日審核次數已達上限（10 次），請明天再試。'
                : '今日審核次數已達上限，請明天再試。')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        // 檢查服務是否可用
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

            // 處理 rate limit 錯誤
            if (response.status === 429) {
                setError(responseData.error || '請求次數超過限制，請稍後再試')
                // 同步後端的使用量資訊
                setUsageStatus(prev => ({
                    ...prev,
                    remaining: 0,
                }))
                return
            }

            if (!response.ok) {
                throw new Error(responseData.error || '審核服務暫時無法使用')
            }

            setResult(responseData)

            // 使用後端回傳的使用量資訊（更準確）
            if (responseData.usage) {
                setUsageStatus(prev => ({
                    ...prev,
                    remaining: responseData.usage.remaining,
                    limit: responseData.usage.limit,
                }))
            } else {
                // 前端備用記錄
                recordUsage()
                setUsageStatus(getUsageStatus())
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '發生未知錯誤')
        } finally {
            setLoading(false)
        }
    }

    const handleKolSubmit = () => {
        setShowKolModal(false)
    }

    const handleKolSkip = () => {
        setShowKolModal(false)
    }

    return (
        <>
            <Navbar />

            {/* KOL 註冊表單 */}
            {audienceMode === 'business' && (
                <KolRegistrationModal
                    isOpen={showKolModal}
                    onClose={() => setShowKolModal(false)}
                    onSubmit={handleKolSubmit}
                    onSkip={handleKolSkip}
                />
            )}

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{modeConfig.pageTitle}</h1>
                        <p className={styles.subtitle}>
                            {modeConfig.pageSubtitle}
                        </p>

                        {/* 使用量顯示 */}
                        <div className={styles.usageInfo}>
                            <span className={styles.usageLabel}>
                                今日剩餘：{usageStatus.remaining}/{usageStatus.limit} 次
                            </span>
                            {!usageStatus.isLoggedIn && mockAuthEnabled && (
                                <Link href="/auth/login" className={styles.upgradeLink}>
                                    登入獲得更多額度 →
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* 服務暫停提示 */}
                    {!isServiceAvailable && serviceStatus && (
                        <div className={styles.maintenanceBanner}>
                            <span className={styles.maintenanceIcon}>🚧</span>
                            <div className={styles.maintenanceContent}>
                                <h3>服務暫停中</h3>
                                <p>{serviceStatus.maintenanceMessage}</p>
                            </div>
                        </div>
                    )}

                    <div className={styles.content}>
                        <div className={styles.formSection}>
                            <div className={styles.card}>
                                <ReviewForm
                                    mode={audienceMode}
                                    onModeChange={handleModeChange}
                                    onSubmit={handleSubmit}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        <div className={styles.resultSection}>
                            {loading && (
                                <div className={styles.loadingState}>
                                    <div className={styles.spinner}></div>
                                    <p>{modeConfig.loadingTitle}</p>
                                    <p className={styles.loadingHint}>
                                        {modeConfig.loadingHint}
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className={styles.errorState}>
                                    <span className={styles.errorIcon}>⚠️</span>
                                    <p>{error}</p>
                                    <button
                                        onClick={() => setError(null)}
                                        className={styles.retryBtn}
                                    >
                                        重試
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
                                />
                            )}

                            {!result && !loading && !error && (
                                <div className={styles.emptyState}>
                                    <span className={styles.emptyIcon}>📝</span>
                                    <h3>{modeConfig.emptyTitle}</h3>
                                    <p>{modeConfig.emptyDescription}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
