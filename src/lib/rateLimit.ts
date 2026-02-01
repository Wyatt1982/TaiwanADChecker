// 後端 Rate Limiting 實作
// 使用記憶體儲存（生產環境應使用 Redis）

interface RateLimitRecord {
    count: number
    firstRequest: number  // timestamp
    lastRequest: number   // timestamp
}

interface RateLimitStore {
    [key: string]: RateLimitRecord
}

// 記憶體儲存（重啟會重設）
const store: RateLimitStore = {}

// 清理過期記錄的間隔（1 小時）
const CLEANUP_INTERVAL = 60 * 60 * 1000

// 定期清理過期記錄
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        const oneDayAgo = now - 24 * 60 * 60 * 1000

        for (const key in store) {
            if (store[key].lastRequest < oneDayAgo) {
                delete store[key]
            }
        }
    }, CLEANUP_INTERVAL)
}

export interface RateLimitConfig {
    windowMs: number      // 時間窗口（毫秒）
    maxRequests: number   // 最大請求數
    guestMaxRequests?: number   // 未登入用戶最大請求數
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: number       // timestamp
    limit: number
    retryAfter?: number   // 秒數
}

/**
 * 檢查並記錄請求
 * @param identifier - 用戶識別碼（IP 或 userId）
 * @param config - rate limit 設定
 * @param isAuthenticated - 是否已登入
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig,
    isAuthenticated: boolean = false
): RateLimitResult {
    const now = Date.now()
    const maxRequests = isAuthenticated
        ? config.maxRequests
        : (config.guestMaxRequests ?? config.maxRequests)

    // 取得或建立記錄
    let record = store[identifier]

    if (!record) {
        record = {
            count: 0,
            firstRequest: now,
            lastRequest: now,
        }
        store[identifier] = record
    }

    // 檢查是否需要重設（新的時間窗口）
    const windowStart = now - config.windowMs
    if (record.firstRequest < windowStart) {
        record.count = 0
        record.firstRequest = now
    }

    // 計算重設時間
    const resetAt = record.firstRequest + config.windowMs

    // 檢查是否超過限制
    if (record.count >= maxRequests) {
        const retryAfter = Math.ceil((resetAt - now) / 1000)
        return {
            allowed: false,
            remaining: 0,
            resetAt,
            limit: maxRequests,
            retryAfter: retryAfter > 0 ? retryAfter : 1,
        }
    }

    // 記錄請求
    record.count++
    record.lastRequest = now

    return {
        allowed: true,
        remaining: maxRequests - record.count,
        resetAt,
        limit: maxRequests,
    }
}

/**
 * 取得使用量統計
 */
export function getUsageStats(identifier: string): RateLimitRecord | null {
    return store[identifier] || null
}

/**
 * 重設特定用戶的限制（管理員功能）
 */
export function resetRateLimit(identifier: string): boolean {
    if (store[identifier]) {
        delete store[identifier]
        return true
    }
    return false
}

/**
 * 取得所有活躍用戶的統計（管理員功能）
 */
export function getAllStats(): { total: number; records: { [key: string]: RateLimitRecord } } {
    return {
        total: Object.keys(store).length,
        records: { ...store },
    }
}

// 預設設定
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
    windowMs: 24 * 60 * 60 * 1000,  // 24 小時
    maxRequests: 10,                 // 登入用戶每日 10 次
    guestMaxRequests: 1,             // 未登入用戶每日 1 次
}

// API 通用 rate limit（較寬鬆，防止惡意攻擊）
export const API_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 1000,  // 1 分鐘
    maxRequests: 30,      // 每分鐘最多 30 次
}
