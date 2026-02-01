'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { login } from '@/data/auth'
import styles from './page.module.css'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        // 模擬登入延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        const session = login(username, password)
        if (session) {
            // 登入成功，根據角色導向
            if (session.user.role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/')
            }
            // 觸發導航欄更新
            window.dispatchEvent(new Event('auth-change'))
        } else {
            setError('帳號或密碼錯誤')
        }

        setIsLoading(false)
    }

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <div className={styles.header}>
                            <span className={styles.icon}>🔐</span>
                            <h1 className={styles.title}>會員登入</h1>
                            <p className={styles.subtitle}>登入以使用完整功能</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && (
                                <div className={styles.error}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className={styles.field}>
                                <label htmlFor="username">帳號</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="請輸入帳號"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="password">密碼</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="請輸入密碼"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? '登入中...' : '登入'}
                            </button>
                        </form>

                        <div className={styles.demoHint}>
                            <p><strong>測試帳號：</strong></p>
                            <ul>
                                <li>管理員：admin / admin123</li>
                                <li>廠商：brand1 / brand123</li>
                                <li>KOL：kol1 / kol123</li>
                            </ul>
                        </div>

                        <div className={styles.footer}>
                            <Link href="/" className={styles.backLink}>
                                ← 返回首頁
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
