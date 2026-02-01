'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import {
    platformOptions,
    contentTypeOptions,
    budgetOptions
} from '@/types/marketplace'
import { productTypeOptions } from '@/data/jobs'
import styles from './page.module.css'

export default function PostJobPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [formData, setFormData] = useState({
        brandName: '',
        contactEmail: '',
        title: '',
        description: '',
        productType: '',
        platforms: [] as string[],
        contentTypes: [] as string[],
        followerMin: '',
        budget: '',
        deadline: '',
        requirements: '',
    })

    const handlePlatformChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(value)
                ? prev.platforms.filter(p => p !== value)
                : [...prev.platforms, value]
        }))
    }

    const handleContentTypeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            contentTypes: prev.contentTypes.includes(value)
                ? prev.contentTypes.filter(c => c !== value)
                : [...prev.contentTypes, value]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // 模擬提交 - 實際應用會呼叫 API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 儲存到 localStorage 模擬
        const existingJobs = JSON.parse(localStorage.getItem('user-jobs') || '[]')
        const newJob = {
            id: Date.now().toString(),
            ...formData,
            status: 'pending', // 待審核
            createdAt: new Date().toISOString(),
            expiresAt: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
        localStorage.setItem('user-jobs', JSON.stringify([...existingJobs, newJob]))

        setIsSubmitting(false)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <>
                <Navbar />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.successCard}>
                            <span className={styles.successIcon}>✅</span>
                            <h2>徵人資訊已送出！</h2>
                            <p>我們將在審核後上架您的徵人資訊，通常需要 1-2 個工作天。</p>
                            <p className={styles.note}>審核通過後將寄送通知到 {formData.contactEmail}</p>
                            <button
                                onClick={() => router.push('/jobs')}
                                className={styles.backBtn}
                            >
                                返回徵人專區
                            </button>
                        </div>
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
                    <div className={styles.header}>
                        <h1 className={styles.title}>✏️ 發布徵人資訊</h1>
                        <p className={styles.subtitle}>
                            填寫以下資訊，讓 KOL 看到您的合作機會
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* 品牌資訊 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>🏢 品牌資訊</h2>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label className={styles.label}>品牌/公司名稱 *</label>
                                    <input
                                        type="text"
                                        value={formData.brandName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                                        className={styles.input}
                                        required
                                        placeholder="例：美肌保養品牌"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>聯繫 Email *</label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                                        className={styles.input}
                                        required
                                        placeholder="marketing@company.com"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 案件資訊 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>📋 案件資訊</h2>
                            <div className={styles.field}>
                                <label className={styles.label}>徵人標題 *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className={styles.input}
                                    required
                                    placeholder="例：徵求美妝 KOL 合作推廣新品"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>案件說明 *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className={styles.textarea}
                                    required
                                    rows={4}
                                    placeholder="詳細說明合作內容、產品特色、希望的呈現方式..."
                                />
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label className={styles.label}>產品類型 *</label>
                                    <select
                                        value={formData.productType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                                        className={styles.select}
                                        required
                                    >
                                        <option value="">請選擇</option>
                                        {productTypeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>截止日期</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                        className={styles.input}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* KOL 需求 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>🎯 KOL 需求</h2>
                            <div className={styles.field}>
                                <label className={styles.label}>目標平台 *</label>
                                <div className={styles.checkboxGroup}>
                                    {platformOptions.map(opt => (
                                        <label key={opt.value} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={formData.platforms.includes(opt.value)}
                                                onChange={() => handlePlatformChange(opt.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>內容類型 *</label>
                                <div className={styles.checkboxGroup}>
                                    {contentTypeOptions.map(opt => (
                                        <label key={opt.value} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={formData.contentTypes.includes(opt.value)}
                                                onChange={() => handleContentTypeChange(opt.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label className={styles.label}>最低粉絲數</label>
                                    <input
                                        type="number"
                                        value={formData.followerMin}
                                        onChange={(e) => setFormData(prev => ({ ...prev, followerMin: e.target.value }))}
                                        className={styles.input}
                                        placeholder="例：10000"
                                        min={0}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>預算範圍</label>
                                    <select
                                        value={formData.budget}
                                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                                        className={styles.select}
                                    >
                                        <option value="">請選擇</option>
                                        {budgetOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>其他要求</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                                    className={styles.textarea}
                                    rows={2}
                                    placeholder="例：需有相關產品業配經驗、粉絲互動率 > 3% 等"
                                />
                            </div>
                        </section>

                        {/* 提交按鈕 */}
                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className={styles.cancelBtn}
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '送出中...' : '送出徵人資訊'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
