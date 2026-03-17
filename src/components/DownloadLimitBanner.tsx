'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getDownloadStatus,
    DownloadStatus,
    brandPlans,
    setBrandPlanType,
    PlanType,
} from '@/data/downloadLimit'
import { getCurrentUser } from '@/data/auth'
import { isMockAuthEnabled } from '@/lib/mockAuth'
import styles from './DownloadLimitBanner.module.css'

interface Props {
    onDownload?: () => boolean
    showUpgradeOptions?: boolean
}

export function DownloadLimitBanner({ onDownload, showUpgradeOptions = false }: Props) {
    const mockAuthEnabled = isMockAuthEnabled()
    const [status, setStatus] = useState<DownloadStatus | null>(null)
    const [showPlans, setShowPlans] = useState(false)

    useEffect(() => {
        const loadStatus = () => {
            setStatus(getDownloadStatus())
        }
        loadStatus()

        // 監聽 storage 變化
        window.addEventListener('storage', loadStatus)
        return () => window.removeEventListener('storage', loadStatus)
    }, [])

    const handleUpgrade = (plan: PlanType) => {
        // 模擬升級（實際應導向付款頁面）
        setBrandPlanType(plan)
        setStatus(getDownloadStatus())
        setShowPlans(false)
        alert(`已升級至「${brandPlans.find(p => p.type === plan)?.name}」方案！`)
    }

    if (!status) return null

    const user = getCurrentUser()
    const isLoggedIn = !!user

    // 未登入提示
    if (!isLoggedIn) {
        return (
            <div className={styles.banner}>
                <div className={styles.content}>
                    <span className={styles.icon}>🔐</span>
                    <div className={styles.text}>
                        <strong>{mockAuthEnabled ? '登入以下載 KOL 資料' : '會員功能暫時停用'}</strong>
                        <span>
                            {mockAuthEnabled
                                ? '免費註冊廠商帳號，每月可下載 3 筆資料'
                                : '正式環境已停用測試登入，KOL 名單下載功能將於正式會員系統完成後開放'}
                        </span>
                    </div>
                </div>
                {mockAuthEnabled && (
                    <Link href="/auth/login" className={styles.btn}>
                        立即登入
                    </Link>
                )}
            </div>
        )
    }

    // KOL 帳號
    if (user.role === 'kol') {
        return (
            <div className={`${styles.banner} ${styles.info}`}>
                <div className={styles.content}>
                    <span className={styles.icon}>💡</span>
                    <div className={styles.text}>
                        <strong>KOL 專屬功能</strong>
                        <span>想被廠商找到？前往<Link href="/settings/kol">隱私設定</Link>確認您的資料已公開</span>
                    </div>
                </div>
            </div>
        )
    }

    // 管理員
    if (user.role === 'admin') {
        return null // 管理員不顯示限制
    }

    // 廠商 - 顯示配額
    const usagePercent = status.limit > 0 ? (status.used / status.limit) * 100 : 0
    const isLow = status.remaining <= 3 && status.remaining > 0
    const isEmpty = status.remaining === 0

    return (
        <div className={`${styles.banner} ${isEmpty ? styles.warning : isLow ? styles.caution : ''}`}>
            <div className={styles.content}>
                <span className={styles.icon}>{isEmpty ? '⚠️' : '📊'}</span>
                <div className={styles.text}>
                    <strong>
                        本月下載額度：{status.used} / {status.limit}
                    </strong>
                    <span>
                        {isEmpty
                            ? '額度已用完，升級方案獲得更多'
                            : `剩餘 ${status.remaining} 次`}
                    </span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                </div>
            </div>

            {showUpgradeOptions && (
                <button
                    className={styles.upgradeBtn}
                    onClick={() => setShowPlans(!showPlans)}
                >
                    {showPlans ? '收起' : '升級方案'}
                </button>
            )}

            {showPlans && (
                <div className={styles.plansModal}>
                    <div className={styles.plansGrid}>
                        {brandPlans.map(plan => (
                            <div
                                key={plan.type}
                                className={`${styles.planCard} ${status.planType === plan.type ? styles.current : ''}`}
                            >
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.planPrice}>
                                    {plan.price === 0 ? '免費' : `$${plan.price}/月`}
                                </div>
                                <div className={styles.planLimit}>
                                    每月 {plan.downloadLimit} 次下載
                                </div>
                                <ul className={styles.planFeatures}>
                                    {plan.features.map((f, i) => (
                                        <li key={i}>✓ {f}</li>
                                    ))}
                                </ul>
                                {status.planType === plan.type ? (
                                    <span className={styles.currentBadge}>目前方案</span>
                                ) : (
                                    <button
                                        className={styles.selectBtn}
                                        onClick={() => handleUpgrade(plan.type)}
                                    >
                                        {plan.price === 0 ? '選擇' : '升級'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
