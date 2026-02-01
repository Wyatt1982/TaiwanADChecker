'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { ReviewForm } from '@/components/review/ReviewForm'
import { ReviewResult } from '@/components/review/ReviewResult'
import { KolRegistrationModal } from '@/components/KolRegistrationModal'
import { getServiceStatus, isLLMAvailable, ServiceStatus } from '@/data/serviceStatus'
import { getUsageStatus, canUseReview, recordUsage } from '@/data/usageLimit'
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
}

export default function ReviewPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReviewData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showKolModal, setShowKolModal] = useState(false)
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null)
    const [isServiceAvailable, setIsServiceAvailable] = useState(true)
    const [usageStatus, setUsageStatus] = useState({ used: 0, limit: 1, remaining: 1, isLoggedIn: false })

    // 檢查是否需要顯示 KOL 註冊表單
    useEffect(() => {
        const registered = localStorage.getItem('kol-registered')
        const skipped = localStorage.getItem('kol-skipped')
        if (!registered && !skipped) {
            setShowKolModal(true)
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
    }, [])

    const handleSubmit = async (data: {
        content: string
        productType: string
        contentType: string
    }) => {
        // 檢查使用限制
        if (!canUseReview()) {
            setError(usageStatus.isLoggedIn
                ? '今日審核次數已達上限（10 次），請明天再試。'
                : '今日審核次數已達上限。登入會員可獲得每日 10 次的審核額度！')
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
            <KolRegistrationModal
                isOpen={showKolModal}
                onClose={() => setShowKolModal(false)}
                onSubmit={handleKolSubmit}
                onSkip={handleKolSkip}
            />

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>文案審核</h1>
                        <p className={styles.subtitle}>
                            貼上您的廣告文案，AI 將分析法規風險並提供修改建議
                        </p>

                        {/* 使用量顯示 */}
                        <div className={styles.usageInfo}>
                            <span className={styles.usageLabel}>
                                今日剩餘：{usageStatus.remaining}/{usageStatus.limit} 次
                            </span>
                            {!usageStatus.isLoggedIn && (
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
                                <ReviewForm onSubmit={handleSubmit} loading={loading} />
                            </div>
                        </div>

                        <div className={styles.resultSection}>
                            {loading && (
                                <div className={styles.loadingState}>
                                    <div className={styles.spinner}></div>
                                    <p>AI 正在分析您的文案...</p>
                                    <p className={styles.loadingHint}>
                                        正在比對法規知識庫與開罰案例
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
                                    <h3>準備好開始了嗎？</h3>
                                    <p>
                                        在左側輸入您的廣告文案，
                                        <br />
                                        系統將即時分析法規風險
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
