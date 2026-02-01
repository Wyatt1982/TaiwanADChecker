'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { mockJobPostings, filterJobs, productTypeOptions } from '@/data/jobs'
import {
    platformOptions,
    contentTypeOptions,
    budgetOptions
} from '@/types/marketplace'
import type { JobPosting } from '@/types/marketplace'
import styles from './page.module.css'

export function JobsList() {
    const [jobs, setJobs] = useState<JobPosting[]>([])
    const [search, setSearch] = useState('')
    const [platform, setPlatform] = useState('')
    const [contentType, setContentType] = useState('')
    const [productType, setProductType] = useState('')
    const [budget, setBudget] = useState('')

    useEffect(() => {
        const filtered = filterJobs(mockJobPostings, {
            search,
            platform: platform || undefined,
            contentType: contentType || undefined,
            productType: productType || undefined,
            budget: budget || undefined,
        })
        setJobs(filtered)
    }, [search, platform, contentType, productType, budget])

    const clearFilters = () => {
        setSearch('')
        setPlatform('')
        setContentType('')
        setProductType('')
        setBudget('')
    }

    const getPlatformLabel = (value: string) =>
        platformOptions.find(p => p.value === value)?.label || value
    const getContentTypeLabel = (value: string) =>
        contentTypeOptions.find(c => c.value === value)?.label || value
    const getBudgetLabel = (value: string) =>
        budgetOptions.find(b => b.value === value)?.label || value
    const getDaysLeft = (deadline: string) => {
        const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return days
    }

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <h1 className={styles.title}>📋 徵人專區</h1>
                            <p className={styles.subtitle}>瀏覽品牌合作機會，找到適合你的業配案件</p>
                        </div>
                        <Link href="/jobs/post" className={styles.postBtn}>✏️ 發布徵人</Link>
                    </div>
                    <div className={styles.filters}>
                        <div className={styles.searchRow}>
                            <input type="text" placeholder="搜尋案件名稱、品牌或說明..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
                        </div>
                        <div className={styles.filterRow}>
                            <select value={productType} onChange={(e) => setProductType(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有產品類型</option>
                                {productTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有平台</option>
                                {platformOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={contentType} onChange={(e) => setContentType(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有內容類型</option>
                                {contentTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={budget} onChange={(e) => setBudget(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有預算</option>
                                {budgetOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <button onClick={clearFilters} className={styles.clearBtn}>清除篩選</button>
                        </div>
                    </div>
                    <div className={styles.resultStats}>
                        <span>共 {jobs.length} 個徵人案件</span>
                    </div>
                    <div className={styles.jobList}>
                        {jobs.map(job => {
                            const daysLeft = getDaysLeft(job.deadline || job.expiresAt)
                            return (
                                <div key={job.id} className={styles.jobCard}>
                                    <div className={styles.jobHeader}>
                                        <div className={styles.brandInfo}>
                                            <div className={styles.brandLogo}>
                                                {job.brandLogo ? <img src={job.brandLogo} alt={job.brandName} /> : <span>🏢</span>}
                                            </div>
                                            <div>
                                                <span className={styles.brandName}>{job.brandName}</span>
                                                <span className={styles.productType}>{job.productType}</span>
                                            </div>
                                        </div>
                                        <div className={styles.deadline}>
                                            {daysLeft > 0 ? (
                                                <span className={daysLeft <= 7 ? styles.urgent : ''}>剩餘 {daysLeft} 天</span>
                                            ) : (
                                                <span className={styles.expired}>已截止</span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className={styles.jobTitle}>{job.title}</h3>
                                    <p className={styles.jobDesc}>{job.description}</p>
                                    <div className={styles.jobTags}>
                                        <div className={styles.tagGroup}>
                                            <span className={styles.tagLabel}>平台：</span>
                                            {job.platforms.map(p => <span key={p} className={styles.tag}>{getPlatformLabel(p)}</span>)}
                                        </div>
                                        <div className={styles.tagGroup}>
                                            <span className={styles.tagLabel}>類型：</span>
                                            {job.contentTypes.map(c => <span key={c} className={styles.tag}>{getContentTypeLabel(c)}</span>)}
                                        </div>
                                    </div>
                                    <div className={styles.jobMeta}>
                                        {job.followerMin && (
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaIcon}>👥</span>
                                                <span>粉絲數 {job.followerMin.toLocaleString()}+</span>
                                            </div>
                                        )}
                                        {job.budget && (
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaIcon}>💰</span>
                                                <span>{getBudgetLabel(job.budget)}</span>
                                            </div>
                                        )}
                                    </div>
                                    {job.requirements && (
                                        <div className={styles.requirements}>
                                            <strong>其他要求：</strong>{job.requirements}
                                        </div>
                                    )}
                                    <div className={styles.jobActions}>
                                        <a href={`mailto:${job.contactEmail}?subject=應徵：${job.title}`} className={styles.applyBtn}>✉️ 我要應徵</a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {jobs.length === 0 && (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📋</span>
                            <h3>目前沒有符合條件的案件</h3>
                            <p>請嘗試調整篩選條件，或稍後再來看看</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
