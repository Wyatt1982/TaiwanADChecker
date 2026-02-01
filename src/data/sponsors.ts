// 贊助商資料結構
export interface Sponsor {
    id: string
    name: string
    logo?: string
    url?: string
    tier: 'gold' | 'silver' | 'bronze' | 'supporter'
    description?: string
    startDate: string
    endDate?: string
    isActive: boolean
}

// 贊助商級別設定
export const sponsorTiers = {
    gold: {
        label: '金級贊助',
        icon: '🥇',
        color: '#f59e0b',
        benefits: ['首頁顯眼位置', 'Logo 展示', '連結導流'],
        price: 3000,
    },
    silver: {
        label: '銀級贊助',
        icon: '🥈',
        color: '#94a3b8',
        benefits: ['首頁展示', 'Logo 展示'],
        price: 1500,
    },
    bronze: {
        label: '銅級贊助',
        icon: '🥉',
        color: '#d97706',
        benefits: ['感謝名單'],
        price: 500,
    },
    supporter: {
        label: '小額贊助',
        icon: '☕',
        color: '#10b981',
        benefits: ['感謝名單'],
        price: 60,
    },
}

// 示範贊助商資料
export const sponsors: Sponsor[] = [
    {
        id: 'sponsor-demo-1',
        name: '您的品牌可以在這裡',
        tier: 'gold',
        description: '成為金級贊助商，獲得最佳曝光！',
        startDate: '2026-01-01',
        isActive: true,
    },
    {
        id: 'sponsor-demo-2',
        name: '贊助位招租中',
        tier: 'silver',
        description: '銀級贊助商位置',
        startDate: '2026-01-01',
        isActive: true,
    },
    {
        id: 'sponsor-demo-3',
        name: '贊助位招租中',
        tier: 'silver',
        description: '銀級贊助商位置',
        startDate: '2026-01-01',
        isActive: true,
    },
]

// 感謝名單（小額贊助者）
export const supporters: string[] = [
    '匿名贊助者 A',
    '匿名贊助者 B',
    '匿名贊助者 C',
]
