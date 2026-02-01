'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import styles from './ComingSoon.module.css'

interface ComingSoonProps {
    title: string
    description: string
    icon: string
}

// 問卷問題
const surveyQuestions = [
    {
        id: 'usage',
        question: '你預計如何使用這個功能？',
        options: [
            '尋找合作的 KOL',
            '作為 KOL 尋找業配機會',
            '品牌方發布徵人',
            '只是逛逛看看',
            '其他'
        ]
    },
    {
        id: 'priority',
        question: '你最重視的功能是什麼？',
        options: [
            '篩選搜尋功能',
            '報價透明度',
            'KOL 過往案例展示',
            '即時通訊功能',
            '合約簽署功能',
            '其他'
        ]
    },
    {
        id: 'frequency',
        question: '你預計多常使用這功能？',
        options: [
            '每天',
            '每週',
            '每月',
            '偶爾需要時',
            '只是試用看看'
        ]
    }
]

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
    const [feedback, setFeedback] = useState('')
    const [email, setEmail] = useState('')
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // 這裡之後可以接到後端 API
        console.log('Feedback submitted:', { feedback, email, answers })
        setSubmitted(true)
    }

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.hero}>
                        <span className={styles.icon}>{icon}</span>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.description}>{description}</p>
                        <div className={styles.badge}>
                            🚧 建置中・收集意見反饋
                        </div>
                    </div>

                    {submitted ? (
                        <div className={styles.thankYou}>
                            <span className={styles.thankYouIcon}>🎉</span>
                            <h2>感謝你的寶貴意見！</h2>
                            <p>我們會根據你的回饋來優化這個功能。</p>
                            <Link href="/" className={styles.backBtn}>
                                返回首頁
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* 問卷問題 */}
                            <div className={styles.surveySection}>
                                <h2 className={styles.sectionTitle}>📊 快速問卷</h2>
                                <p className={styles.sectionHint}>
                                    幫助我們了解你的需求（選填）
                                </p>

                                {surveyQuestions.map((q) => (
                                    <div key={q.id} className={styles.questionGroup}>
                                        <label className={styles.questionLabel}>
                                            {q.question}
                                        </label>
                                        <div className={styles.optionsGrid}>
                                            {q.options.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    className={`${styles.optionBtn} ${answers[q.id] === option ? styles.optionBtnActive : ''}`}
                                                    onClick={() => handleAnswerChange(q.id, option)}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 開放式回饋 */}
                            <div className={styles.feedbackSection}>
                                <h2 className={styles.sectionTitle}>💡 你的想法</h2>
                                <textarea
                                    placeholder="告訴我們你對這個功能的想像...&#10;&#10;例如：希望可以用粉絲數範圍篩選、想要看到 KOL 的歷史報價、希望有即時通訊功能..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className={styles.textarea}
                                    rows={5}
                                />
                            </div>

                            {/* Email 通知 */}
                            <div className={styles.emailSection}>
                                <label className={styles.emailLabel}>
                                    📧 功能上線時通知我（選填）
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.emailInput}
                                />
                            </div>

                            {/* 提交按鈕 */}
                            <button type="submit" className={styles.submitBtn}>
                                📤 提交意見
                            </button>

                            <Link href="/" className={styles.skipBtn}>
                                跳過，先返回首頁
                            </Link>
                        </form>
                    )}
                </div>
            </main>
        </>
    )
}

export default ComingSoon
