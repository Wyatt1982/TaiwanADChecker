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

const reviewStudioCopy: Record<
    ReviewAudienceMode,
    {
        eyebrow: string
        headline: string
        lead: string
        deliverables: string[]
        noteTitle: string
        notes: string[]
    }
> = {
    business: {
        eyebrow: 'Beauty Compliance Desk',
        headline: '把每一段準備發布的內容，先變成更穩的版本',
        lead: '從療程介紹、商品頁、KOL 合作稿到客服私訊，這一頁的任務是讓你的內容在發布前就長得更像專業品牌，而不是風險來源。',
        deliverables: [
            '高風險句與法規依據',
            '較安全的改寫方向',
            '可當內部送審紀錄的結果頁',
        ],
        noteTitle: '這次送審特別適合檢查',
        notes: ['療程案例分享', '效果見證與對比圖文案', '客服私訊與社群貼文'],
    },
    consumer: {
        eyebrow: 'Consumer Ad Check',
        headline: '先判斷這則廣告是不是說得太滿，再決定要不要相信',
        lead: '如果你是看到限動、商品頁或推銷話術的人，這裡會用白話方式拆出可疑點，幫你先做風險辨識，再決定下一步要不要查證或反映。',
        deliverables: [
            '可疑重點與高風險特徵',
            '保留證據與查證方向',
            '官方申訴 / 檢舉連結提示',
        ],
        noteTitle: '這次辨識常見於',
        notes: ['團購貼文與限動', '保健品或醫美商品頁', '客服強力推銷話術'],
    },
}

const touchpointTags = ['商品頁', '社群貼文', '私訊話術', '合作腳本', '案例分享']

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
    const modeCopy = reviewStudioCopy[audienceMode]

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
                <section className={styles.hero}>
                    <div className={styles.heroAuraLeft}></div>
                    <div className={styles.heroAuraRight}></div>
                    <div className={`${styles.container} ${styles.heroGrid}`}>
                        <div className={styles.heroCopy}>
                            <span className={styles.eyebrow}>{modeCopy.eyebrow}</span>
                            <h1 className={styles.title}>
                                {modeConfig.pageTitle}
                                <span className={styles.titleAccent}>{modeCopy.headline}</span>
                            </h1>
                            <p className={styles.subtitle}>
                                {modeConfig.pageSubtitle}
                                {' '}
                                {modeCopy.lead}
                            </p>

                            <div className={styles.touchpointRow}>
                                {touchpointTags.map((tag) => (
                                    <span key={tag} className={styles.touchpointTag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.usageRow}>
                                <div className={styles.usageCard}>
                                    <span className={styles.usageLabel}>今日剩餘額度</span>
                                    <strong>{usageStatus.remaining}/{usageStatus.limit}</strong>
                                </div>
                                <div className={styles.usageCard}>
                                    <span className={styles.usageLabel}>目前輸出</span>
                                    <strong>{audienceMode === 'business' ? '送審報告' : '風險辨識報告'}</strong>
                                </div>
                                {mockAuthEnabled && !usageStatus.isLoggedIn && (
                                    <Link href="/auth/login" className={styles.loginLink}>
                                        登入獲得更多額度
                                    </Link>
                                )}
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <div className={styles.panelCard}>
                                <span className={styles.panelEyebrow}>YOU WILL GET</span>
                                <div className={styles.deliverableList}>
                                    {modeCopy.deliverables.map((item) => (
                                        <div key={item} className={styles.deliverableItem}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.panelCardWarm}>
                                <span className={styles.panelEyebrow}>{modeCopy.noteTitle}</span>
                                <ul className={styles.noteList}>
                                    {modeCopy.notes.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </section>

                {!isServiceAvailable && serviceStatus && (
                    <div className={`${styles.container} ${styles.bannerWrap}`}>
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
                    <div className={`${styles.container} ${styles.workspaceGrid}`}>
                        <div className={styles.formShell}>
                            <div className={styles.shellLabel}>Review Setup</div>
                            <div className={styles.formCard}>
                                <ReviewForm
                                    mode={audienceMode}
                                    onModeChange={handleModeChange}
                                    onSubmit={handleSubmit}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        <div className={styles.resultShell}>
                            <div className={styles.shellLabel}>Report View</div>
                            <div className={styles.resultCard}>
                                {loading && (
                                    <div className={styles.loadingState}>
                                        <div className={styles.spinner}></div>
                                        <p className={styles.loadingTitle}>{modeConfig.loadingTitle}</p>
                                        <p className={styles.loadingHint}>{modeConfig.loadingHint}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className={styles.errorState}>
                                        <span className={styles.errorIcon}>⚠️</span>
                                        <h3>這次分析沒有完成</h3>
                                        <p>{error}</p>
                                        <button onClick={() => setError(null)} className={styles.retryBtn}>
                                            回到編輯狀態
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
                                        <span className={styles.emptyEyebrow}>Report Preview</span>
                                        <h3>{modeConfig.emptyTitle}</h3>
                                        <p>{modeConfig.emptyDescription}</p>
                                        <div className={styles.emptyChecklist}>
                                            {modeCopy.deliverables.map((item) => (
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
                </section>
            </main>
        </>
    )
}
