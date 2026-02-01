'use client'

import { useState, useEffect } from 'react'
import { getServiceStatus } from '@/data/serviceStatus'
import { ComingSoon } from '@/components/ComingSoon'

// 原本的完整 KOL 頁面內容（暫存以便日後恢復）
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { DownloadLimitBanner } from '@/components/DownloadLimitBanner'
import { mockKolProfiles, filterKols, exportKolsToCsv } from '@/data/kols'
import { isLoggedIn } from '@/data/auth'
import { getDownloadStatus, recordDownload } from '@/data/downloadLimit'
import {
    platformOptions,
    contentTypeOptions,
    followerRangeOptions,
    regionOptions
} from '@/types/marketplace'
import type { KolProfile } from '@/types/marketplace'
import styles from './page.module.css'

export default function KolsPage() {
    const [isEnabled, setIsEnabled] = useState(false)  // 預設關閉

    useEffect(() => {
        const status = getServiceStatus()
        setIsEnabled(status.kolDatabaseEnabled)
    }, [])

    // 功能未開啟時顯示建置中頁面
    if (!isEnabled) {
        return (
            <ComingSoon
                title="KOL 資料庫"
                description="搜尋合適的 KOL，找到最佳的合作夥伴"
                icon="🔍"
            />
        )
    }

    // 以下為功能開啟後的完整頁面
    return <KolsPageContent />
}

// 完整的 KOL 頁面內容
function KolsPageContent() {
    const [kols, setKols] = useState<KolProfile[]>([])
    const [search, setSearch] = useState('')
    const [platform, setPlatform] = useState('')
    const [contentType, setContentType] = useState('')
    const [followerRange, setFollowerRange] = useState('')
    const [region, setRegion] = useState('')
    const [acceptingOnly, setAcceptingOnly] = useState(false)
    const [selectedKols, setSelectedKols] = useState<Set<string>>(new Set())
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [showLoginPrompt, setShowLoginPrompt] = useState(false)

    useEffect(() => {
        setIsUserLoggedIn(isLoggedIn())
        const handleAuthChange = () => setIsUserLoggedIn(isLoggedIn())
        window.addEventListener('auth-change', handleAuthChange)

        const filtered = filterKols(mockKolProfiles, {
            search,
            platform: platform || undefined,
            contentType: contentType || undefined,
            followerRange: followerRange || undefined,
            region: region || undefined,
            acceptingWork: acceptingOnly ? true : undefined,
        })
        setKols(filtered)

        return () => window.removeEventListener('auth-change', handleAuthChange)
    }, [search, platform, contentType, followerRange, region, acceptingOnly])

    const toggleKolSelection = (id: string) => {
        setSelectedKols(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const selectAll = () => {
        if (selectedKols.size === kols.length) setSelectedKols(new Set())
        else setSelectedKols(new Set(kols.map(k => k.id)))
    }

    const handleDownload = () => {
        if (!isUserLoggedIn) {
            setShowLoginPrompt(true)
            return
        }
        const status = getDownloadStatus()
        if (!status.canDownload) {
            alert(status.reason || '無法下載')
            return
        }
        const success = recordDownload()
        if (!success) {
            alert('下載配額已用完，請升級方案')
            return
        }
        const kolsToDownload = selectedKols.size > 0
            ? kols.filter(k => selectedKols.has(k.id))
            : kols
        const csv = exportKolsToCsv(kolsToDownload)
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `kol-list-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
        window.dispatchEvent(new Event('storage'))
    }

    const clearFilters = () => {
        setSearch('')
        setPlatform('')
        setContentType('')
        setFollowerRange('')
        setRegion('')
        setAcceptingOnly(false)
    }

    const getPlatformLabel = (value: string) =>
        platformOptions.find(p => p.value === value)?.label || value
    const getContentTypeLabel = (value: string) =>
        contentTypeOptions.find(c => c.value === value)?.label || value

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    {showLoginPrompt && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modal}>
                                <h3>🔐 需要登入</h3>
                                <p>下載 KOL 名單需要先登入會員。</p>
                                <div className={styles.modalActions}>
                                    <button onClick={() => setShowLoginPrompt(false)} className={styles.modalCancelBtn}>取消</button>
                                    <Link href="/auth/login" className={styles.modalLoginBtn}>前往登入</Link>
                                </div>
                            </div>
                        </div>
                    )}
                    <DownloadLimitBanner showUpgradeOptions={true} />
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <h1 className={styles.title}>🔍 KOL 資料庫</h1>
                            <p className={styles.subtitle}>搜尋合適的 KOL，找到最佳的合作夥伴</p>
                        </div>
                        <button className={styles.downloadBtn} onClick={handleDownload}>
                            📥 下載名單 {selectedKols.size > 0 && `(${selectedKols.size})`}
                        </button>
                    </div>
                    <div className={styles.filters}>
                        <div className={styles.searchRow}>
                            <input type="text" placeholder="搜尋 KOL 名稱或介紹..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
                        </div>
                        <div className={styles.filterRow}>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有平台</option>
                                {platformOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={contentType} onChange={(e) => setContentType(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有類型</option>
                                {contentTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={followerRange} onChange={(e) => setFollowerRange(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有粉絲數</option>
                                {followerRangeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={region} onChange={(e) => setRegion(e.target.value)} className={styles.filterSelect}>
                                <option value="">所有地區</option>
                                {regionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={acceptingOnly} onChange={(e) => setAcceptingOnly(e.target.checked)} />
                                僅顯示接案中
                            </label>
                            <button onClick={clearFilters} className={styles.clearBtn}>清除篩選</button>
                        </div>
                    </div>
                    <div className={styles.resultStats}>
                        <span>共 {kols.length} 位 KOL</span>
                        <button onClick={selectAll} className={styles.selectAllBtn}>
                            {selectedKols.size === kols.length ? '取消全選' : '全選'}
                        </button>
                    </div>
                    <div className={styles.kolGrid}>
                        {kols.map(kol => (
                            <div key={kol.id} className={`${styles.kolCard} ${selectedKols.has(kol.id) ? styles.selected : ''}`} onClick={() => toggleKolSelection(kol.id)}>
                                <div className={styles.kolHeader}>
                                    <div className={styles.avatar}>
                                        {kol.avatar ? <img src={kol.avatar} alt={kol.name} /> : <span>👤</span>}
                                    </div>
                                    <div className={styles.kolInfo}>
                                        <h3 className={styles.kolName}>
                                            {kol.name}
                                            {kol.acceptingWork && <span className={styles.acceptingBadge}>接案中</span>}
                                        </h3>
                                        <div className={styles.platforms}>
                                            {kol.platforms.map(p => <span key={p} className={styles.platformTag}>{getPlatformLabel(p)}</span>)}
                                        </div>
                                    </div>
                                    <input type="checkbox" checked={selectedKols.has(kol.id)} onChange={() => toggleKolSelection(kol.id)} className={styles.checkbox} onClick={(e) => e.stopPropagation()} />
                                </div>
                                <p className={styles.kolBio}>{kol.bio}</p>
                                <div className={styles.kolMeta}>
                                    <div className={styles.metaItem}><span className={styles.metaLabel}>類型</span><span className={styles.metaValue}>{kol.contentTypes.map(getContentTypeLabel).join(', ')}</span></div>
                                    <div className={styles.metaItem}><span className={styles.metaLabel}>粉絲數</span><span className={styles.metaValue}>{kol.followerRange}</span></div>
                                    {kol.priceRange && <div className={styles.metaItem}><span className={styles.metaLabel}>報價</span><span className={styles.metaValue}>{kol.priceRange}</span></div>}
                                </div>
                                <div className={styles.kolActions}>
                                    <a href={`mailto:${kol.email}`} className={styles.contactBtn} onClick={(e) => e.stopPropagation()}>📧 聯繫</a>
                                </div>
                            </div>
                        ))}
                    </div>
                    {kols.length === 0 && (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h3>找不到符合條件的 KOL</h3>
                            <p>請嘗試調整篩選條件</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
