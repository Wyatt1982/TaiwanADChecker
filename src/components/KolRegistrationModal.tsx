'use client'

import { useState } from 'react'
import { categoryOptions, priceRangeOptions, followerTiers } from '@/data/kol'
import styles from './KolRegistrationModal.module.css'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: KolFormData) => void
    onSkip: () => void
}

export interface KolFormData {
    instagram: string
    youtube: string
    tiktok: string
    email: string
    line: string
    categories: string[]
    priceRange: string
    followerTier: string
}

export function KolRegistrationModal({ isOpen, onClose, onSubmit, onSkip }: Props) {
    const [formData, setFormData] = useState<KolFormData>({
        instagram: '',
        youtube: '',
        tiktok: '',
        email: '',
        line: '',
        categories: [],
        priceRange: '',
        followerTier: '',
    })

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // 儲存到 localStorage
        localStorage.setItem('kol-profile', JSON.stringify(formData))
        localStorage.setItem('kol-registered', 'true')
        onSubmit(formData)
    }

    const handleSkip = () => {
        localStorage.setItem('kol-skipped', 'true')
        onSkip()
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerIcon}>👋</div>
                    <h2 className={styles.title}>如果你是創作者，可順手留下合作資料</h2>
                    <p className={styles.subtitle}>
                        想直接檢查廣告風險也沒問題。KOL / 創作者填寫後，
                        品牌廠商未來可能會主動聯繫你合作；
                        <br />
                        <span className={styles.optional}>消費者或一般使用者可直接跳過，功能不受影響。</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* 社群帳號 */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>📱 社群帳號</h3>
                        <div className={styles.inputGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <span className={styles.labelIcon}>📸</span> Instagram
                                </label>
                                <input
                                    type="text"
                                    placeholder="@your_handle"
                                    value={formData.instagram}
                                    onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <span className={styles.labelIcon}>🎬</span> YouTube
                                </label>
                                <input
                                    type="text"
                                    placeholder="頻道名稱或連結"
                                    value={formData.youtube}
                                    onChange={e => setFormData(prev => ({ ...prev, youtube: e.target.value }))}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <span className={styles.labelIcon}>🎵</span> TikTok
                                </label>
                                <input
                                    type="text"
                                    placeholder="@your_tiktok"
                                    value={formData.tiktok}
                                    onChange={e => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 聯繫方式 */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>📧 聯繫方式</h3>
                        <div className={styles.inputGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Line ID</label>
                                <input
                                    type="text"
                                    placeholder="line_id"
                                    value={formData.line}
                                    onChange={e => setFormData(prev => ({ ...prev, line: e.target.value }))}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 擅長類別 */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>🏷️ 擅長類別（可多選）</h3>
                        <div className={styles.categoryGrid}>
                            {categoryOptions.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`${styles.categoryChip} ${formData.categories.includes(cat.value) ? styles.selected : ''}`}
                                    onClick={() => handleCategoryToggle(cat.value)}
                                >
                                    <span className={styles.chipIcon}>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 粉絲規模 */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>👥 粉絲規模</h3>
                        <div className={styles.tierGrid}>
                            {followerTiers.map(tier => (
                                <button
                                    key={tier.value}
                                    type="button"
                                    className={`${styles.tierChip} ${formData.followerTier === tier.value ? styles.selected : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, followerTier: tier.value }))}
                                >
                                    {tier.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 業配價碼 */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>💰 業配價碼範圍</h3>
                        <div className={styles.priceGrid}>
                            {priceRangeOptions.map(price => (
                                <button
                                    key={price.value}
                                    type="button"
                                    className={`${styles.priceChip} ${formData.priceRange === price.value ? styles.selected : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, priceRange: price.value }))}
                                >
                                    {price.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 按鈕 */}
                    <div className={styles.actions}>
                        <button type="button" className={styles.skipButton} onClick={handleSkip}>
                            先直接使用工具 →
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            ✓ 儲存創作者資料
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
