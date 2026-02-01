import { JobPosting } from '@/types/marketplace'

// 模擬徵人案件資料
export const mockJobPostings: JobPosting[] = [
    {
        id: '1',
        brandName: '美肌保養品牌',
        brandLogo: '/images/brands/brand1.png',
        contactEmail: 'marketing@skincare-brand.com',
        title: '徵求美妝 KOL 合作推廣新品',
        description: '我們是新創保養品品牌，即將推出全新的抗老精華液。誠徵有保養品業配經驗的 KOL 合作，需拍攝使用心得影片或貼文。產品免費提供，另有合作費。',
        productType: '化妝品',
        platforms: ['instagram', 'youtube'],
        contentTypes: ['beauty', 'lifestyle'],
        followerMin: 10000,
        budget: '10k-30k',
        deadline: '2026-02-28',
        requirements: '需有美妝相關內容經驗、粉絲互動率 > 3%',
        status: 'open',
        createdAt: '2026-01-25',
        expiresAt: '2026-02-28',
    },
    {
        id: '2',
        brandName: '健康食品公司',
        contactEmail: 'kol@healthfood.tw',
        title: '保健食品長期合作 KOL 招募',
        description: '知名保健食品品牌尋找長期合作的健身/健康類 KOL。每月固定合作，提供產品+合作費。需配合廣告法規審核。',
        productType: '保健食品',
        platforms: ['instagram', 'youtube', 'tiktok'],
        contentTypes: ['fitness', 'lifestyle'],
        followerMin: 50000,
        budget: '30k-50k',
        deadline: '2026-03-15',
        requirements: '需有健身或營養相關背景、願意配合法規審核',
        status: 'open',
        createdAt: '2026-01-20',
        expiresAt: '2026-03-15',
    },
    {
        id: '3',
        brandName: '時尚服飾品牌 LUXE',
        brandLogo: '/images/brands/brand3.png',
        contactEmail: 'pr@luxe-fashion.com',
        title: '春季新品穿搭分享合作',
        description: '歐美時尚品牌 LUXE 春季新品上市，誠徵時尚穿搭類 KOL 合作。提供全套服飾+合作費，需拍攝穿搭照片或影片。',
        productType: '服飾',
        platforms: ['instagram', 'threads'],
        contentTypes: ['fashion', 'lifestyle'],
        followerMin: 30000,
        budget: '30k-50k',
        deadline: '2026-02-15',
        status: 'open',
        createdAt: '2026-01-28',
        expiresAt: '2026-02-15',
    },
    {
        id: '4',
        brandName: '親子用品店',
        contactEmail: 'collab@babykids.tw',
        title: '親子用品開箱體驗招募',
        description: '專營嬰幼兒用品的電商平台，徵求親子類 KOL 開箱我們的熱賣商品。產品免費贈送，需撰寫使用心得。',
        productType: '嬰幼兒用品',
        platforms: ['facebook', 'youtube', 'blog'],
        contentTypes: ['parenting'],
        followerMin: 5000,
        budget: '5k-10k',
        deadline: '2026-02-20',
        requirements: '家有嬰幼兒優先',
        status: 'open',
        createdAt: '2026-01-27',
        expiresAt: '2026-02-20',
    },
    {
        id: '5',
        brandName: '旅遊訂房平台',
        contactEmail: 'travel@booking.tw',
        title: '國內旅遊住宿體驗徵文',
        description: '知名訂房平台邀請旅遊類 KOL 免費入住配合飯店，撰寫住宿體驗文。提供免費住宿+交通補貼。',
        productType: '旅遊服務',
        platforms: ['instagram', 'youtube', 'blog'],
        contentTypes: ['travel'],
        followerMin: 20000,
        budget: '10k-30k',
        deadline: '2026-03-01',
        status: 'open',
        createdAt: '2026-01-22',
        expiresAt: '2026-03-01',
    },
    {
        id: '6',
        brandName: '3C 品牌代理商',
        contactEmail: 'tech@3cagent.com',
        title: '新款藍牙耳機開箱評測',
        description: '徵求 3C 評測 KOL 開箱評測最新藍牙耳機。需專業評測影片，包含音質、通話、配戴舒適度等項目。',
        productType: '3C 產品',
        platforms: ['youtube'],
        contentTypes: ['tech'],
        followerMin: 30000,
        budget: '30k-50k',
        deadline: '2026-02-10',
        requirements: '需有專業音訊設備進行評測',
        status: 'open',
        createdAt: '2026-01-26',
        expiresAt: '2026-02-10',
    },
]

// 根據條件篩選徵人案件
export function filterJobs(
    jobs: JobPosting[],
    filters: {
        platform?: string
        contentType?: string
        productType?: string
        budget?: string
        search?: string
    }
): JobPosting[] {
    return jobs.filter(job => {
        // 只顯示開放中的案件
        if (job.status !== 'open') return false

        // 未過期
        if (new Date(job.expiresAt) < new Date()) return false

        // 平台篩選
        if (filters.platform && !job.platforms.includes(filters.platform)) {
            return false
        }

        // 內容類型篩選
        if (filters.contentType && !job.contentTypes.includes(filters.contentType)) {
            return false
        }

        // 產品類型篩選
        if (filters.productType && job.productType !== filters.productType) {
            return false
        }

        // 預算篩選
        if (filters.budget && job.budget !== filters.budget) {
            return false
        }

        // 搜尋關鍵字
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const matchTitle = job.title.toLowerCase().includes(searchLower)
            const matchDesc = job.description.toLowerCase().includes(searchLower)
            const matchBrand = job.brandName.toLowerCase().includes(searchLower)
            if (!matchTitle && !matchDesc && !matchBrand) return false
        }

        return true
    })
}

// 產品類型選項
export const productTypeOptions = [
    { value: '保健食品', label: '保健食品' },
    { value: '化妝品', label: '化妝品/保養品' },
    { value: '服飾', label: '服飾/時尚' },
    { value: '3C 產品', label: '3C 產品' },
    { value: '嬰幼兒用品', label: '嬰幼兒用品' },
    { value: '食品飲料', label: '食品/飲料' },
    { value: '旅遊服務', label: '旅遊服務' },
    { value: '其他', label: '其他' },
]
