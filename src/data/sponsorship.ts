// 贊助系統設定
export const sponsorshipConfig = {
    // 每月營運成本（新台幣）
    monthlyCost: 500,

    // 一杯咖啡金額
    coffeePrice: 60,

    // 目前餘額（新台幣）
    currentBalance: 1800,

    // 最後更新時間
    lastUpdated: '2026-01-31',

    // 贊助連結（Demo 假連結）
    donationUrl: '#donate',

    // 贊助者列表（可選）
    supporters: [
        { name: '匿名贊助者', amount: 120, date: '2026-01-30' },
        { name: 'KOL 小幫手愛好者', amount: 60, date: '2026-01-28' },
    ],
}

// 計算剩餘營運天數
export function getRemainingDays(): number {
    const { currentBalance, monthlyCost } = sponsorshipConfig
    const dailyCost = monthlyCost / 30
    return Math.floor(currentBalance / dailyCost)
}

// 計算進度百分比（以 90 天為滿）
export function getProgressPercentage(): number {
    const days = getRemainingDays()
    const maxDays = 90 // 3 個月為 100%
    return Math.min(100, Math.round((days / maxDays) * 100))
}

// 取得進度狀態
export function getProgressStatus(): 'healthy' | 'warning' | 'danger' {
    const days = getRemainingDays()
    if (days > 60) return 'healthy'
    if (days > 30) return 'warning'
    return 'danger'
}

// 計算到期日期
export function getExpirationDate(): string {
    const days = getRemainingDays()
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })
}
