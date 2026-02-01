import { KolProfile } from '@/types/marketplace'

// 模擬 KOL 資料
export const mockKolProfiles: KolProfile[] = [
    {
        id: '1',
        name: '小美美妝',
        email: 'beauty@example.com',
        avatar: '/images/kols/avatar1.png',
        bio: '專注美妝保養分享，合作過多家知名品牌，擅長產品開箱和使用心得分享。',
        platforms: ['instagram', 'youtube'],
        socialLinks: {
            instagram: 'https://instagram.com/xiaomei_beauty',
            youtube: 'https://youtube.com/@xiaomei',
        },
        contentTypes: ['beauty', 'lifestyle'],
        followerRange: '50k-100k',
        priceRange: '30k-50k',
        region: 'taipei',
        acceptingWork: true,
        isPublic: true,
        createdAt: '2024-06-15',
    },
    {
        id: '2',
        name: '吃貨阿明',
        email: 'foodie@example.com',
        bio: '台北美食探險家，專門發掘隱藏版美食。IG 破 5 萬追蹤，業配詢問度高！',
        platforms: ['instagram', 'facebook', 'tiktok'],
        socialLinks: {
            instagram: 'https://instagram.com/foodie_ming',
            facebook: 'https://facebook.com/foodieming',
            tiktok: 'https://tiktok.com/@foodie_ming',
        },
        contentTypes: ['food', 'lifestyle'],
        followerRange: '50k-100k',
        priceRange: '10k-30k',
        region: 'taipei',
        acceptingWork: true,
        isPublic: true,
        createdAt: '2024-05-20',
    },
    {
        id: '3',
        name: 'FashionLuna',
        email: 'luna@example.com',
        avatar: '/images/kols/avatar3.png',
        bio: '穿搭 × 時尚 × 生活風格。與多家服飾品牌長期合作，擅長日常穿搭分享。',
        platforms: ['instagram', 'threads'],
        socialLinks: {
            instagram: 'https://instagram.com/fashionluna',
            threads: 'https://threads.net/@fashionluna',
        },
        contentTypes: ['fashion', 'lifestyle'],
        followerRange: '100k-500k',
        priceRange: '50k-100k',
        region: 'taichung',
        acceptingWork: false,
        isPublic: true,
        createdAt: '2024-03-10',
    },
    {
        id: '4',
        name: '親子日記 Chloe',
        email: 'chloe@example.com',
        bio: '兩寶媽的育兒日常，分享育兒經驗、親子用品開箱評測，真實呈現媽媽生活。',
        platforms: ['youtube', 'facebook', 'blog'],
        socialLinks: {
            youtube: 'https://youtube.com/@chloe_family',
            facebook: 'https://facebook.com/chloefamilydiary',
        },
        contentTypes: ['parenting', 'lifestyle'],
        followerRange: '10k-50k',
        priceRange: '10k-30k',
        region: 'new-taipei',
        acceptingWork: true,
        isPublic: true,
        createdAt: '2024-07-01',
    },
    {
        id: '5',
        name: '健身教練 Kevin',
        email: 'kevin@example.com',
        bio: '專業健身教練，分享健身知識、營養補充品評測。健身房老闆，有營養師背書。',
        platforms: ['instagram', 'youtube', 'tiktok'],
        socialLinks: {
            instagram: 'https://instagram.com/coach_kevin',
            youtube: 'https://youtube.com/@coachkevin',
        },
        contentTypes: ['fitness', 'lifestyle'],
        followerRange: '100k-500k',
        priceRange: '50k-100k',
        region: 'kaohsiung',
        acceptingWork: true,
        isPublic: true,
        createdAt: '2024-01-15',
    },
    {
        id: '6',
        name: '科技小宅',
        email: 'techgeek@example.com',
        bio: '3C 開箱、科技新聞、App 推薦。工程師背景，評測專業有深度。',
        platforms: ['youtube', 'blog'],
        socialLinks: {
            youtube: 'https://youtube.com/@techgeek_tw',
        },
        contentTypes: ['tech', 'gaming'],
        followerRange: '50k-100k',
        priceRange: '30k-50k',
        region: 'taipei',
        acceptingWork: true,
        isPublic: true,
        createdAt: '2024-04-20',
    },
    {
        id: '7',
        name: '旅遊達人 Sandy',
        email: 'sandy@example.com',
        bio: '環遊世界中 🌍 分享旅遊攻略、住宿推薦、行程規劃。已走過 30 個國家！',
        platforms: ['instagram', 'youtube', 'blog'],
        socialLinks: {
            instagram: 'https://instagram.com/sandy_travel',
            youtube: 'https://youtube.com/@sandytravel',
        },
        contentTypes: ['travel', 'lifestyle'],
        followerRange: '100k-500k',
        priceRange: '50k-100k',
        region: 'taipei',
        acceptingWork: false,
        isPublic: true,
        createdAt: '2024-02-28',
    },
    {
        id: '8',
        name: '小資理財 Amy',
        email: 'amy@example.com',
        bio: '小資女的理財日記，分享存錢技巧、投資理財、信用卡優惠。證券分析師背景。',
        platforms: ['instagram', 'facebook', 'blog'],
        socialLinks: {
            instagram: 'https://instagram.com/amy_finance',
            facebook: 'https://facebook.com/amyfinance',
        },
        contentTypes: ['finance', 'lifestyle'],
        followerRange: '10k-50k',
        priceRange: '10k-30k',
        region: 'taipei',
        acceptingWork: true,
        isPublic: true,
        createdAt: '2024-06-01',
    },
]

// 根據條件篩選 KOL
export function filterKols(
    kols: KolProfile[],
    filters: {
        platform?: string
        contentType?: string
        followerRange?: string
        region?: string
        acceptingWork?: boolean
        search?: string
    }
): KolProfile[] {
    return kols.filter(kol => {
        // 只顯示公開的
        if (!kol.isPublic) return false

        // 平台篩選
        if (filters.platform && !kol.platforms.includes(filters.platform)) {
            return false
        }

        // 內容類型篩選
        if (filters.contentType && !kol.contentTypes.includes(filters.contentType)) {
            return false
        }

        // 粉絲數篩選
        if (filters.followerRange && kol.followerRange !== filters.followerRange) {
            return false
        }

        // 地區篩選
        if (filters.region && kol.region !== filters.region) {
            return false
        }

        // 接案中篩選
        if (filters.acceptingWork !== undefined && kol.acceptingWork !== filters.acceptingWork) {
            return false
        }

        // 搜尋關鍵字
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const matchName = kol.name.toLowerCase().includes(searchLower)
            const matchBio = kol.bio?.toLowerCase().includes(searchLower)
            if (!matchName && !matchBio) return false
        }

        return true
    })
}

// 匯出 CSV
export function exportKolsToCsv(kols: KolProfile[]): string {
    const headers = ['名稱', 'Email', '平台', '內容類型', '粉絲數', '報價範圍', '地區', '接案中']
    const rows = kols.map(kol => [
        kol.name,
        kol.email,
        kol.platforms.join(', '),
        kol.contentTypes.join(', '),
        kol.followerRange,
        kol.priceRange || '-',
        kol.region || '-',
        kol.acceptingWork ? '是' : '否',
    ])

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')

    return csvContent
}
