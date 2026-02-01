// KOL 檔案資料類型
export interface KolProfile {
    id: string
    name: string
    email: string
    avatar?: string
    bio?: string
    platforms: string[]
    socialLinks: {
        instagram?: string
        facebook?: string
        youtube?: string
        tiktok?: string
        threads?: string
    }
    contentTypes: string[]
    followerRange: string
    priceRange?: string
    region?: string
    acceptingWork: boolean
    isPublic: boolean
    createdAt: string
}

// 廠商徵人案件類型
export interface JobPosting {
    id: string
    brandName: string
    brandLogo?: string
    contactEmail: string
    title: string
    description: string
    productType: string
    platforms: string[]
    contentTypes: string[]
    followerMin?: number
    budget?: string
    deadline?: string
    requirements?: string
    status: 'open' | 'closed'
    createdAt: string
    expiresAt: string
}

// 篩選選項
export const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'threads', label: 'Threads' },
    { value: 'blog', label: '部落格' },
]

export const contentTypeOptions = [
    { value: 'beauty', label: '美妝' },
    { value: 'fashion', label: '時尚穿搭' },
    { value: 'food', label: '美食' },
    { value: 'travel', label: '旅遊' },
    { value: 'lifestyle', label: '生活風格' },
    { value: 'parenting', label: '親子育兒' },
    { value: 'fitness', label: '健身運動' },
    { value: 'tech', label: '3C科技' },
    { value: 'gaming', label: '遊戲電競' },
    { value: 'finance', label: '理財投資' },
]

export const followerRangeOptions = [
    { value: '1k-10k', label: '1K - 10K (微網紅)' },
    { value: '10k-50k', label: '10K - 50K (小網紅)' },
    { value: '50k-100k', label: '50K - 100K (中網紅)' },
    { value: '100k-500k', label: '100K - 500K (大網紅)' },
    { value: '500k+', label: '500K+ (超級網紅)' },
]

export const regionOptions = [
    { value: 'taipei', label: '台北' },
    { value: 'new-taipei', label: '新北' },
    { value: 'taoyuan', label: '桃園' },
    { value: 'taichung', label: '台中' },
    { value: 'tainan', label: '台南' },
    { value: 'kaohsiung', label: '高雄' },
    { value: 'other', label: '其他縣市' },
]

export const budgetOptions = [
    { value: '5k-10k', label: 'NT$ 5,000 - 10,000' },
    { value: '10k-30k', label: 'NT$ 10,000 - 30,000' },
    { value: '30k-50k', label: 'NT$ 30,000 - 50,000' },
    { value: '50k-100k', label: 'NT$ 50,000 - 100,000' },
    { value: '100k+', label: 'NT$ 100,000+' },
    { value: 'negotiable', label: '可議' },
]
