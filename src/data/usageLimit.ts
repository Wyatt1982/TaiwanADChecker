// 審核使用限制管理
import { isLoggedIn, getCurrentUser } from './auth'

export interface UsageRecord {
    date: string  // YYYY-MM-DD
    count: number
    userId?: string
}

const USAGE_KEY = 'review-usage'
const DAILY_LIMIT_GUEST = 1
const DAILY_LIMIT_USER = 10

// 取得今天的日期字串
function getTodayString(): string {
    return new Date().toISOString().split('T')[0]
}

// 取得使用記錄
function getUsageRecord(): UsageRecord {
    if (typeof window === 'undefined') {
        return { date: getTodayString(), count: 0 }
    }

    const saved = localStorage.getItem(USAGE_KEY)
    if (saved) {
        try {
            const record: UsageRecord = JSON.parse(saved)
            // 如果是新的一天，重設計數
            if (record.date !== getTodayString()) {
                return { date: getTodayString(), count: 0 }
            }
            return record
        } catch {
            return { date: getTodayString(), count: 0 }
        }
    }
    return { date: getTodayString(), count: 0 }
}

// 儲存使用記錄
function saveUsageRecord(record: UsageRecord): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USAGE_KEY, JSON.stringify(record))
    }
}

// 取得剩餘使用次數
export function getRemainingUsage(): number {
    const record = getUsageRecord()
    const limit = isLoggedIn() ? DAILY_LIMIT_USER : DAILY_LIMIT_GUEST
    return Math.max(0, limit - record.count)
}

// 取得每日限制
export function getDailyLimit(): number {
    return isLoggedIn() ? DAILY_LIMIT_USER : DAILY_LIMIT_GUEST
}

// 取得今日已使用次數
export function getTodayUsage(): number {
    return getUsageRecord().count
}

// 檢查是否可以使用
export function canUseReview(): boolean {
    return getRemainingUsage() > 0
}

// 記錄一次使用
export function recordUsage(): boolean {
    if (!canUseReview()) {
        return false
    }

    const record = getUsageRecord()
    const user = getCurrentUser()

    record.count += 1
    record.date = getTodayString()
    record.userId = user?.id

    saveUsageRecord(record)
    return true
}

// 取得使用狀態摘要
export function getUsageStatus(): {
    used: number
    limit: number
    remaining: number
    isLoggedIn: boolean
} {
    const used = getTodayUsage()
    const limit = getDailyLimit()
    const remaining = getRemainingUsage()

    return {
        used,
        limit,
        remaining,
        isLoggedIn: isLoggedIn(),
    }
}
