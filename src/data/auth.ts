// 用戶類型
export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'brand' | 'kol'
    avatar?: string
    createdAt: string
    // KOL 專屬欄位
    kolProfile?: KolProfile
}

// KOL 個人檔案與隱私設定
export interface KolProfile {
    displayName: string
    bio: string
    followers: number
    platforms: string[]
    categories: string[]
    // 隱私設定
    privacy: KolPrivacySettings
}

export interface KolPrivacySettings {
    showEmail: boolean           // 是否顯示 Email
    showFollowerCount: boolean   // 是否顯示粉絲數
    allowContactRequest: boolean // 是否允許廠商聯繫
    showInDirectory: boolean     // 是否出現在 KOL 資料庫
}

// 預設隱私設定
export const defaultPrivacySettings: KolPrivacySettings = {
    showEmail: false,
    showFollowerCount: true,
    allowContactRequest: true,
    showInDirectory: true,
}

// Session 類型
export interface UserSession {
    user: User
    token: string
    expiresAt: string
}

// 模擬用戶資料
export const mockUsers: { [key: string]: User & { password: string } } = {
    'admin': {
        id: '1',
        name: '管理員',
        email: 'admin@kol-helper.tw',
        role: 'admin',
        password: 'admin123',
        createdAt: '2024-01-01',
    },
    'brand1': {
        id: '2',
        name: '美妝品牌行銷',
        email: 'brand@example.com',
        role: 'brand',
        password: 'brand123',
        createdAt: '2024-06-01',
    },
    'kol1': {
        id: '3',
        name: '小美美妝',
        email: 'kol@example.com',
        role: 'kol',
        password: 'kol123',
        createdAt: '2024-03-15',
        kolProfile: {
            displayName: '小美美妝',
            bio: '專注彩妝與保養分享的創作者',
            followers: 125000,
            platforms: ['Instagram', 'YouTube'],
            categories: ['美妝', '保養'],
            privacy: {
                showEmail: false,
                showFollowerCount: true,
                allowContactRequest: true,
                showInDirectory: true,
            },
        },
    },
}

const SESSION_KEY = 'user-session'
const PRIVACY_KEY = 'kol-privacy-settings'

// 登入
export function login(username: string, password: string): UserSession | null {
    const userData = mockUsers[username]
    if (!userData || userData.password !== password) {
        return null
    }

    const { password: _, ...user } = userData
    const session: UserSession = {
        user,
        token: `mock-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 天
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }

    return session
}

// 登出
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_KEY)
    }
}

// 取得當前 Session
export function getSession(): UserSession | null {
    if (typeof window === 'undefined') {
        return null
    }

    const saved = localStorage.getItem(SESSION_KEY)
    if (!saved) return null

    try {
        const session: UserSession = JSON.parse(saved)
        // 檢查是否過期
        if (new Date(session.expiresAt) < new Date()) {
            logout()
            return null
        }
        return session
    } catch {
        return null
    }
}

// 取得當前用戶
export function getCurrentUser(): User | null {
    const session = getSession()
    return session?.user || null
}

// 檢查是否為管理員
export function isAdmin(): boolean {
    const user = getCurrentUser()
    return user?.role === 'admin'
}

// 檢查是否為廠商
export function isBrand(): boolean {
    const user = getCurrentUser()
    return user?.role === 'brand'
}

// 檢查是否為 KOL
export function isKol(): boolean {
    const user = getCurrentUser()
    return user?.role === 'kol'
}

// 檢查是否已登入
export function isLoggedIn(): boolean {
    return getSession() !== null
}

// 取得角色顯示名稱
export function getRoleDisplayName(role: User['role']): string {
    const names: Record<User['role'], string> = {
        admin: '管理員',
        brand: '廠商',
        kol: 'KOL 創作者',
    }
    return names[role] || role
}

// === KOL 隱私設定功能 ===

// 取得 KOL 隱私設定
export function getKolPrivacySettings(): KolPrivacySettings {
    const user = getCurrentUser()
    if (user?.role !== 'kol') {
        return defaultPrivacySettings
    }

    if (typeof window === 'undefined') {
        return user.kolProfile?.privacy || defaultPrivacySettings
    }

    const saved = localStorage.getItem(PRIVACY_KEY)
    if (saved) {
        try {
            return JSON.parse(saved)
        } catch {
            return user.kolProfile?.privacy || defaultPrivacySettings
        }
    }

    return user.kolProfile?.privacy || defaultPrivacySettings
}

// 更新 KOL 隱私設定
export function updateKolPrivacySettings(settings: Partial<KolPrivacySettings>): KolPrivacySettings {
    const current = getKolPrivacySettings()
    const updated = { ...current, ...settings }

    if (typeof window !== 'undefined') {
        localStorage.setItem(PRIVACY_KEY, JSON.stringify(updated))
    }

    return updated
}
