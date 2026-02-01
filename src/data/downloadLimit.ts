// 下載限制邏輯
// 廠商下載 KOL 資料的付費牆機制

import { getCurrentUser, isLoggedIn, isBrand, isAdmin } from './auth'

// 下載限制設定
export const DOWNLOAD_LIMITS = {
    guest: 0,           // 未登入：不可下載
    kol: 0,             // KOL：不可下載其他 KOL 資料
    brand_free: 3,      // 免費廠商：每月 3 次
    brand_basic: 20,    // 基本方案：每月 20 次
    brand_pro: 100,     // 專業方案：每月 100 次
    admin: 999999,      // 管理員：無限
}

// 方案類型
export type PlanType = 'free' | 'basic' | 'pro'

// 廠商方案資訊
export interface BrandPlan {
    type: PlanType
    name: string
    price: number
    downloadLimit: number
    features: string[]
}

// 方案資訊
export const brandPlans: BrandPlan[] = [
    {
        type: 'free',
        name: '免費體驗',
        price: 0,
        downloadLimit: DOWNLOAD_LIMITS.brand_free,
        features: [
            '瀏覽 KOL 資料庫',
            '每月下載 3 筆資料',
            '基本篩選功能',
        ],
    },
    {
        type: 'basic',
        name: '基本方案',
        price: 299,
        downloadLimit: DOWNLOAD_LIMITS.brand_basic,
        features: [
            '每月下載 20 筆資料',
            '進階篩選功能',
            '儲存常用篩選條件',
            '優先客服支援',
        ],
    },
    {
        type: 'pro',
        name: '專業方案',
        price: 799,
        downloadLimit: DOWNLOAD_LIMITS.brand_pro,
        features: [
            '每月下載 100 筆資料',
            '完整篩選功能',
            'KOL 聯繫功能',
            '批次下載',
            '專屬客服',
        ],
    },
]

// 下載記錄
interface DownloadRecord {
    month: string  // YYYY-MM
    count: number
    lastDownload: string
}

const DOWNLOAD_KEY = 'brand-download-record'

// 取得當月標識
function getCurrentMonth(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// 取得下載記錄
function getDownloadRecord(): DownloadRecord {
    if (typeof window === 'undefined') {
        return { month: getCurrentMonth(), count: 0, lastDownload: '' }
    }

    const saved = localStorage.getItem(DOWNLOAD_KEY)
    if (saved) {
        try {
            const record: DownloadRecord = JSON.parse(saved)
            // 如果是新的月份，重設計數
            if (record.month !== getCurrentMonth()) {
                return { month: getCurrentMonth(), count: 0, lastDownload: '' }
            }
            return record
        } catch {
            return { month: getCurrentMonth(), count: 0, lastDownload: '' }
        }
    }

    return { month: getCurrentMonth(), count: 0, lastDownload: '' }
}

// 儲存下載記錄
function saveDownloadRecord(record: DownloadRecord): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(DOWNLOAD_KEY, JSON.stringify(record))
    }
}

// 取得用戶的下載限制
export function getUserDownloadLimit(): number {
    const user = getCurrentUser()

    if (!user) {
        return DOWNLOAD_LIMITS.guest
    }

    if (user.role === 'admin') {
        return DOWNLOAD_LIMITS.admin
    }

    if (user.role === 'kol') {
        return DOWNLOAD_LIMITS.kol
    }

    if (user.role === 'brand') {
        // 從 localStorage 取得方案（實際應從後端）
        const planType = getBrandPlanType()
        switch (planType) {
            case 'pro':
                return DOWNLOAD_LIMITS.brand_pro
            case 'basic':
                return DOWNLOAD_LIMITS.brand_basic
            default:
                return DOWNLOAD_LIMITS.brand_free
        }
    }

    return 0
}

// 取得廠商方案類型（模擬）
export function getBrandPlanType(): PlanType {
    if (typeof window === 'undefined') {
        return 'free'
    }
    const saved = localStorage.getItem('brand-plan-type')
    return (saved as PlanType) || 'free'
}

// 設定廠商方案（模擬升級）
export function setBrandPlanType(plan: PlanType): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('brand-plan-type', plan)
    }
}

// 取得下載狀態
export interface DownloadStatus {
    canDownload: boolean
    used: number
    limit: number
    remaining: number
    planType: PlanType | null
    reason?: string
}

export function getDownloadStatus(): DownloadStatus {
    const user = getCurrentUser()

    // 未登入
    if (!user) {
        return {
            canDownload: false,
            used: 0,
            limit: 0,
            remaining: 0,
            planType: null,
            reason: '請先登入以下載 KOL 資料',
        }
    }

    // KOL 不能下載
    if (user.role === 'kol') {
        return {
            canDownload: false,
            used: 0,
            limit: 0,
            remaining: 0,
            planType: null,
            reason: 'KOL 帳號無法下載其他創作者資料',
        }
    }

    // 管理員無限制
    if (user.role === 'admin') {
        return {
            canDownload: true,
            used: 0,
            limit: DOWNLOAD_LIMITS.admin,
            remaining: DOWNLOAD_LIMITS.admin,
            planType: 'pro',
        }
    }

    // 廠商
    const limit = getUserDownloadLimit()
    const record = getDownloadRecord()
    const remaining = Math.max(0, limit - record.count)

    return {
        canDownload: remaining > 0,
        used: record.count,
        limit,
        remaining,
        planType: getBrandPlanType(),
        reason: remaining <= 0 ? '本月下載額度已用完，升級方案獲得更多額度' : undefined,
    }
}

// 記錄下載
export function recordDownload(): boolean {
    const status = getDownloadStatus()
    if (!status.canDownload) {
        return false
    }

    const record = getDownloadRecord()
    record.count++
    record.lastDownload = new Date().toISOString()
    record.month = getCurrentMonth()
    saveDownloadRecord(record)

    return true
}

// 檢查是否可以下載
export function canDownload(): boolean {
    return getDownloadStatus().canDownload
}
