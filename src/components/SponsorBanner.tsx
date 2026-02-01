'use client'

import { useState, useEffect } from 'react'
import {
    sponsorshipConfig,
    getRemainingDays,
    getProgressPercentage,
    getProgressStatus,
    getExpirationDate
} from '@/data/sponsorship'
import styles from './SponsorBanner.module.css'

export function SponsorBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isMinimized, setIsMinimized] = useState(false)

    // 記住用戶關閉狀態
    useEffect(() => {
        const hidden = localStorage.getItem('sponsor-banner-hidden')
        if (hidden === 'true') {
            setIsMinimized(true)
        }
    }, [])

    const handleMinimize = () => {
        setIsMinimized(true)
        localStorage.setItem('sponsor-banner-hidden', 'true')
    }

    const handleExpand = () => {
        setIsMinimized(false)
        localStorage.removeItem('sponsor-banner-hidden')
    }

    const remainingDays = getRemainingDays()
    const progress = getProgressPercentage()
    const status = getProgressStatus()
    const expirationDate = getExpirationDate()

    if (!isVisible) return null

    // 最小化狀態 - 只顯示小按鈕
    if (isMinimized) {
        return (
            <button
                className={styles.miniButton}
                onClick={handleExpand}
                title="展開贊助資訊"
            >
                ☕
            </button>
        )
    }

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <span className={styles.emoji}>☕</span>
                    <div className={styles.textGroup}>
                        <span className={styles.title}>喜歡這個工具嗎？</span>
                        <span className={styles.subtitle}>
                            目前贊助可維持至 {expirationDate}（{remainingDays} 天）
                        </span>
                    </div>
                </div>

                <div className={styles.center}>
                    <div className={styles.progressWrapper}>
                        <div
                            className={`${styles.progressBar} ${styles[status]}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={styles.progressLabel}>{progress}%</span>
                </div>

                <div className={styles.right}>
                    <a
                        href={sponsorshipConfig.donationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.donateButton}
                    >
                        ☕ 請我喝杯咖啡 ${sponsorshipConfig.coffeePrice}
                    </a>
                    <button
                        className={styles.closeButton}
                        onClick={handleMinimize}
                        title="最小化"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    )
}
