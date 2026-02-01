'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import {
    getCurrentUser,
    isKol,
    getKolPrivacySettings,
    updateKolPrivacySettings,
    KolPrivacySettings,
} from '@/data/auth'
import styles from './page.module.css'

export default function KolSettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [settings, setSettings] = useState<KolPrivacySettings>({
        showEmail: false,
        showFollowerCount: true,
        allowContactRequest: true,
        showInDirectory: true,
    })

    useEffect(() => {
        // 檢查是否為 KOL
        const user = getCurrentUser()
        if (!user) {
            router.push('/auth/login')
            return
        }
        if (user.role !== 'kol') {
            router.push('/')
            return
        }

        // 載入設定
        const currentSettings = getKolPrivacySettings()
        setSettings(currentSettings)
        setLoading(false)
    }, [router])

    const handleToggle = (key: keyof KolPrivacySettings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key],
        }))
        setSaved(false)
    }

    const handleSave = () => {
        setSaving(true)
        updateKolPrivacySettings(settings)
        setTimeout(() => {
            setSaving(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        }, 500)
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <p className={styles.loading}>載入中...</p>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>🔒 隱私設定</h1>
                        <p className={styles.subtitle}>
                            控制您的個人資料在平台上的顯示方式
                        </p>
                    </header>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>資料顯示</h2>
                        <div className={styles.settingsList}>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingLabel}>
                                        📧 顯示電子郵件
                                    </span>
                                    <span className={styles.settingDesc}>
                                        允許廠商在 KOL 資料庫中看到您的 Email
                                    </span>
                                </div>
                                <button
                                    className={`${styles.toggle} ${settings.showEmail ? styles.toggleOn : ''}`}
                                    onClick={() => handleToggle('showEmail')}
                                >
                                    <span className={styles.toggleThumb}></span>
                                </button>
                            </div>

                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingLabel}>
                                        👥 顯示粉絲數量
                                    </span>
                                    <span className={styles.settingDesc}>
                                        在資料庫中顯示您的粉絲追蹤人數
                                    </span>
                                </div>
                                <button
                                    className={`${styles.toggle} ${settings.showFollowerCount ? styles.toggleOn : ''}`}
                                    onClick={() => handleToggle('showFollowerCount')}
                                >
                                    <span className={styles.toggleThumb}></span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>互動設定</h2>
                        <div className={styles.settingsList}>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingLabel}>
                                        💬 允許廠商聯繫
                                    </span>
                                    <span className={styles.settingDesc}>
                                        廠商可以透過平台發送合作邀請給您
                                    </span>
                                </div>
                                <button
                                    className={`${styles.toggle} ${settings.allowContactRequest ? styles.toggleOn : ''}`}
                                    onClick={() => handleToggle('allowContactRequest')}
                                >
                                    <span className={styles.toggleThumb}></span>
                                </button>
                            </div>

                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingLabel}>
                                        📋 出現在 KOL 資料庫
                                    </span>
                                    <span className={styles.settingDesc}>
                                        關閉後，廠商將無法在資料庫中搜尋到您
                                    </span>
                                </div>
                                <button
                                    className={`${styles.toggle} ${settings.showInDirectory ? styles.toggleOn : ''}`}
                                    onClick={() => handleToggle('showInDirectory')}
                                >
                                    <span className={styles.toggleThumb}></span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className={styles.actions}>
                        <button
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? '儲存中...' : saved ? '✓ 已儲存' : '儲存設定'}
                        </button>
                    </div>

                    <div className={styles.notice}>
                        <p>
                            <strong>⚠️ 注意：</strong>
                            關閉「出現在 KOL 資料庫」將使廠商無法直接找到您，
                            但仍可透過徵人專區主動接洽合作機會。
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}
