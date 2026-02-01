// KOL 資料結構
export interface KolProfile {
    id: string
    createdAt: string

    // 社群帳號
    socialAccounts: {
        instagram?: string
        youtube?: string
        tiktok?: string
        facebook?: string
        threads?: string
    }

    // 聯繫方式
    contact: {
        email?: string
        line?: string
        phone?: string
    }

    // 擅長類別
    categories: string[]

    // 業配價碼範圍
    priceRange: {
        min: number
        max: number
    }

    // 粉絲數量級別
    followerTier: 'nano' | 'micro' | 'mid' | 'macro' | 'mega'

    // 其他備註
    notes?: string
}

// 類別選項
export const categoryOptions = [
    { value: 'beauty', label: '美妝保養', icon: '💄' },
    { value: 'health', label: '保健食品', icon: '💊' },
    { value: 'food', label: '美食餐飲', icon: '🍔' },
    { value: 'fashion', label: '時尚穿搭', icon: '👗' },
    { value: 'tech', label: '3C 科技', icon: '📱' },
    { value: 'lifestyle', label: '生活風格', icon: '🏠' },
    { value: 'travel', label: '旅遊住宿', icon: '✈️' },
    { value: 'parenting', label: '親子育兒', icon: '👶' },
    { value: 'fitness', label: '運動健身', icon: '💪' },
    { value: 'finance', label: '理財投資', icon: '💰' },
    { value: 'education', label: '教育知識', icon: '📚' },
    { value: 'entertainment', label: '娛樂搞笑', icon: '🎬' },
]

// 粉絲數量級別
export const followerTiers = [
    { value: 'nano', label: '奈米 (1K-10K)', range: '1,000 - 10,000' },
    { value: 'micro', label: '微型 (10K-50K)', range: '10,000 - 50,000' },
    { value: 'mid', label: '中型 (50K-100K)', range: '50,000 - 100,000' },
    { value: 'macro', label: '大型 (100K-500K)', range: '100,000 - 500,000' },
    { value: 'mega', label: '超大型 (500K+)', range: '500,000+' },
]

// 價位範圍選項
export const priceRangeOptions = [
    { value: '0-5000', label: 'NT$ 5,000 以下', min: 0, max: 5000 },
    { value: '5000-15000', label: 'NT$ 5,000 - 15,000', min: 5000, max: 15000 },
    { value: '15000-30000', label: 'NT$ 15,000 - 30,000', min: 15000, max: 30000 },
    { value: '30000-50000', label: 'NT$ 30,000 - 50,000', min: 30000, max: 50000 },
    { value: '50000-100000', label: 'NT$ 50,000 - 100,000', min: 50000, max: 100000 },
    { value: '100000+', label: 'NT$ 100,000 以上', min: 100000, max: 999999 },
]
