'use client'

import { useState, useEffect } from 'react'
import styles from './FeedbackWidget.module.css'

interface FeedbackData {
    type: 'bug' | 'suggestion' | 'question' | 'other'
    message: string
    email?: string
    page: string
    timestamp: string
}

const feedbackTypes = [
    { value: 'bug', label: '🐛 回報問題', desc: '發現錯誤或異常' },
    { value: 'suggestion', label: '💡 功能建議', desc: '希望新增的功能' },
    { value: 'question', label: '❓ 使用疑問', desc: '操作上的問題' },
    { value: 'other', label: '💬 其他意見', desc: '任何想法都歡迎' },
]

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<'type' | 'form' | 'success'>('type')
    const [feedbackType, setFeedbackType] = useState<string>('')
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedbackCount, setFeedbackCount] = useState(0)

    useEffect(() => {
        // 從 localStorage 讀取反饋計數
        const count = localStorage.getItem('feedback-count')
        if (count) {
            setFeedbackCount(parseInt(count, 10))
        }
    }, [])

    const handleTypeSelect = (type: string) => {
        setFeedbackType(type)
        setStep('form')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setIsSubmitting(true)

        const feedback: FeedbackData = {
            type: feedbackType as FeedbackData['type'],
            message: message.trim(),
            email: email.trim() || undefined,
            page: typeof window !== 'undefined' ? window.location.pathname : '',
            timestamp: new Date().toISOString(),
        }

        // 儲存到 localStorage（正式環境可改為 API）
        const feedbacks = JSON.parse(localStorage.getItem('user-feedbacks') || '[]')
        feedbacks.push(feedback)
        localStorage.setItem('user-feedbacks', JSON.stringify(feedbacks))

        // 更新計數
        const newCount = feedbackCount + 1
        setFeedbackCount(newCount)
        localStorage.setItem('feedback-count', String(newCount))

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        setIsSubmitting(false)
        setStep('success')
    }

    const handleClose = () => {
        setIsOpen(false)
        // 延遲重設狀態，等動畫結束
        setTimeout(() => {
            setStep('type')
            setFeedbackType('')
            setMessage('')
            setEmail('')
        }, 300)
    }

    const handleBack = () => {
        setStep('type')
        setFeedbackType('')
    }

    return (
        <>
            {/* 浮動按鈕 */}
            <button
                className={`${styles.floatingBtn} ${isOpen ? styles.hidden : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="意見反饋"
            >
                <span className={styles.btnIcon}>💬</span>
                <span className={styles.btnText}>意見反饋</span>
            </button>

            {/* 反饋面板 */}
            {isOpen && (
                <div className={styles.overlay} onClick={handleClose}>
                    <div className={styles.panel} onClick={e => e.stopPropagation()}>
                        <div className={styles.header}>
                            <h3>
                                {step === 'type' && '📮 意見反饋'}
                                {step === 'form' && feedbackTypes.find(t => t.value === feedbackType)?.label}
                                {step === 'success' && '✅ 感謝您的回饋！'}
                            </h3>
                            <button className={styles.closeBtn} onClick={handleClose}>
                                ✕
                            </button>
                        </div>

                        <div className={styles.content}>
                            {/* Step 1: 選擇類型 */}
                            {step === 'type' && (
                                <div className={styles.typeList}>
                                    {feedbackTypes.map(type => (
                                        <button
                                            key={type.value}
                                            className={styles.typeBtn}
                                            onClick={() => handleTypeSelect(type.value)}
                                        >
                                            <span className={styles.typeLabel}>{type.label}</span>
                                            <span className={styles.typeDesc}>{type.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 2: 填寫表單 */}
                            {step === 'form' && (
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.field}>
                                        <label>您的意見 *</label>
                                        <textarea
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="請詳細描述您的問題或建議..."
                                            rows={4}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>聯絡信箱（選填）</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="如需回覆，請留下信箱"
                                        />
                                    </div>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className={styles.backBtn}
                                            onClick={handleBack}
                                        >
                                            ← 返回
                                        </button>
                                        <button
                                            type="submit"
                                            className={styles.submitBtn}
                                            disabled={isSubmitting || !message.trim()}
                                        >
                                            {isSubmitting ? '送出中...' : '送出反饋'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 3: 成功 */}
                            {step === 'success' && (
                                <div className={styles.success}>
                                    <span className={styles.successIcon}>🎉</span>
                                    <p>您的意見已成功送出！</p>
                                    <p className={styles.successHint}>
                                        我們會認真閱讀每一則回饋，<br />
                                        持續改善服務品質。
                                    </p>
                                    <button
                                        className={styles.doneBtn}
                                        onClick={handleClose}
                                    >
                                        完成
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.footer}>
                            <small>您已提供 {feedbackCount} 則反饋，感謝支持！</small>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FeedbackWidget
