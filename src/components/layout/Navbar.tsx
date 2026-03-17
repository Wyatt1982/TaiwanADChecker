'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/data/auth'
import type { User } from '@/data/auth'
import { isMockAuthEnabled } from '@/lib/mockAuth'
import styles from './Navbar.module.css'

export function Navbar() {
    const router = useRouter()
    const mockAuthEnabled = isMockAuthEnabled()
    const [user, setUser] = useState<User | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        // 初始載入
        setUser(getCurrentUser())

        // 監聽登入狀態變化
        const handleAuthChange = () => {
            setUser(getCurrentUser())
        }

        window.addEventListener('auth-change', handleAuthChange)
        window.addEventListener('storage', handleAuthChange)

        return () => {
            window.removeEventListener('auth-change', handleAuthChange)
            window.removeEventListener('storage', handleAuthChange)
        }
    }, [])

    const handleLogout = () => {
        logout()
        setUser(null)
        setShowDropdown(false)
        window.dispatchEvent(new Event('auth-change'))
        router.push('/')
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>AI 快審通</span>
                </Link>

                <div className={styles.links}>
                    <Link href="/review" className={styles.link}>
                        文案審核
                    </Link>
                    <Link href="/regulations" className={styles.link}>
                        法規資料庫
                    </Link>
                    <Link href="/kols" className={styles.link}>
                        KOL 資料庫
                    </Link>
                    <Link href="/jobs" className={styles.link}>
                        徵人專區
                    </Link>
                    <Link href="/cases" className={styles.link}>
                        案例庫
                    </Link>
                </div>

                <div className={styles.actions}>
                    {user ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userBtn}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <span className={styles.avatar}>
                                    {user.role === 'admin' ? '👑' : '👤'}
                                </span>
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.arrow}>▼</span>
                            </button>

                            {showDropdown && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <span>{user.name}</span>
                                        <small>{user.role === 'admin' ? '管理員' : user.role === 'brand' ? '廠商' : 'KOL'}</small>
                                    </div>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                            📊 後台管理
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className={styles.dropdownItem}>
                                        🚪 登出
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : mockAuthEnabled ? (
                        <Link href="/auth/login" className={styles.loginBtn}>
                            登入
                        </Link>
                    ) : null}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
