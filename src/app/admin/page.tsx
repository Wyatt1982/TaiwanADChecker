'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { sponsorshipConfig, getRemainingDays, getProgressPercentage } from '@/data/sponsorship'
import { getServiceStatus, updateServiceStatus, ServiceStatus } from '@/data/serviceStatus'
import styles from './page.module.css'

// 模擬數據
interface DashboardStats {
    totalReviews: number
    todayReviews: number
    totalKols: number
    avgRiskScore: number
    llmCalls: number
    estimatedCost: number
}

// 反饋資料類型
interface FeedbackItem {
    type: 'bug' | 'suggestion' | 'question' | 'other'
    message: string
    email?: string
    page: string
    timestamp: string
}

// LLM 成本計算
const llmPricing = {
    'gpt-4o': { input: 2.5, output: 10, name: 'GPT-4o', quality: '最高', speed: '快' },
    'gpt-4o-mini': { input: 0.15, output: 0.6, name: 'GPT-4o-mini', quality: '高', speed: '最快' },
    'claude-3.5-sonnet': { input: 3, output: 15, name: 'Claude 3.5 Sonnet', quality: '最高', speed: '中' },
    'claude-3.5-haiku': { input: 0.25, output: 1.25, name: 'Claude 3.5 Haiku', quality: '高', speed: '最快' },
    'gemini-2.0-flash': { input: 0.1, output: 0.4, name: 'Gemini 2.0 Flash', quality: '高', speed: '最快' },
    'deepseek-v3': { input: 0.27, output: 1.1, name: 'DeepSeek V3', quality: '高', speed: '快' },
}

// 每次審核的預估 token 量
const avgTokensPerReview = {
    input: 2000,  // 法規 + 用戶文案
    output: 1000, // 審核結果
}

// 反饋類型對應
const feedbackTypeLabels: Record<string, { icon: string; label: string; color: string }> = {
    bug: { icon: '🐛', label: '問題回報', color: '#ef4444' },
    suggestion: { icon: '💡', label: '功能建議', color: '#f59e0b' },
    question: { icon: '❓', label: '使用疑問', color: '#3b82f6' },
    other: { icon: '💬', label: '其他意見', color: '#8b5cf6' },
}

export default function AdminPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalReviews: 0,
        todayReviews: 0,
        totalKols: 0,
        avgRiskScore: 0,
        llmCalls: 0,
        estimatedCost: 0,
    })

    const [selectedLlm, setSelectedLlm] = useState('gemini-2.0-flash')
    const [monthlyBudget, setMonthlyBudget] = useState(500)
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null)
    const [maintenanceMsg, setMaintenanceMsg] = useState('')
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])

    // 模擬從 localStorage 讀取統計
    useEffect(() => {
        // 真實應用會從後端 API 獲取
        const savedStats = localStorage.getItem('admin-stats')
        if (savedStats) {
            setStats(JSON.parse(savedStats))
        } else {
            // Demo 數據
            setStats({
                totalReviews: 156,
                todayReviews: 12,
                totalKols: 23,
                avgRiskScore: 42,
                llmCalls: 156,
                estimatedCost: 2.34,
            })
        }

        // 讀取服務狀態
        const status = getServiceStatus()
        setServiceStatus(status)
        setMaintenanceMsg(status.maintenanceMessage)

        // 讀取反饋資料
        const savedFeedbacks = localStorage.getItem('user-feedbacks')
        if (savedFeedbacks) {
            try {
                const parsed = JSON.parse(savedFeedbacks)
                setFeedbacks(parsed.reverse()) // 最新的在前面
            } catch {
                setFeedbacks([])
            }
        }
    }, [])

    // 切換 LLM 服務
    const toggleLLM = () => {
        if (!serviceStatus) return
        const updated = updateServiceStatus({ llmEnabled: !serviceStatus.llmEnabled })
        setServiceStatus(updated)
    }

    // 切換維護模式
    const toggleMaintenance = () => {
        if (!serviceStatus) return
        const updated = updateServiceStatus({
            maintenanceMode: !serviceStatus.maintenanceMode,
            maintenanceMessage: maintenanceMsg,
        })
        setServiceStatus(updated)
    }

    // 切換 KOL 資料庫
    const toggleKolDatabase = () => {
        if (!serviceStatus) return
        const updated = updateServiceStatus({ kolDatabaseEnabled: !serviceStatus.kolDatabaseEnabled })
        setServiceStatus(updated)
    }

    // 切換徵人專區
    const toggleJobBoard = () => {
        if (!serviceStatus) return
        const updated = updateServiceStatus({ jobBoardEnabled: !serviceStatus.jobBoardEnabled })
        setServiceStatus(updated)
    }

    // 更新維護訊息
    const saveMaintnenaceMessage = () => {
        const updated = updateServiceStatus({ maintenanceMessage: maintenanceMsg })
        setServiceStatus(updated)
    }

    // 計算每次審核成本
    const calculateCostPerReview = (llm: string) => {
        const pricing = llmPricing[llm as keyof typeof llmPricing]
        if (!pricing) return 0
        const inputCost = (avgTokensPerReview.input / 1000000) * pricing.input
        const outputCost = (avgTokensPerReview.output / 1000000) * pricing.output
        return inputCost + outputCost
    }

    // 計算月預算可支撐的審核次數
    const calculateMonthlyCapacity = (llm: string, budget: number) => {
        const costPerReview = calculateCostPerReview(llm)
        if (costPerReview === 0) return 0
        return Math.floor(budget / costPerReview)
    }

    const costPerReview = calculateCostPerReview(selectedLlm)
    const monthlyCapacity = calculateMonthlyCapacity(selectedLlm, monthlyBudget)

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>📊 後台儀表板</h1>
                        <p className={styles.subtitle}>網站數據與成本分析</p>
                    </div>

                    {/* 🔧 服務控制 */}
                    {serviceStatus && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>🔧 服務控制</h2>
                            <div className={styles.controlCard}>
                                <div className={styles.controlRow}>
                                    <div className={styles.controlInfo}>
                                        <span className={styles.controlLabel}>LLM 審核服務</span>
                                        <span className={styles.controlDesc}>
                                            {serviceStatus.llmEnabled ? '✅ 服務運行中' : '❌ 服務已關閉'}
                                        </span>
                                    </div>
                                    <button
                                        className={`${styles.toggleBtn} ${serviceStatus.llmEnabled ? styles.toggleOn : styles.toggleOff}`}
                                        onClick={toggleLLM}
                                    >
                                        {serviceStatus.llmEnabled ? '關閉服務' : '啟用服務'}
                                    </button>
                                </div>

                                <div className={styles.controlRow}>
                                    <div className={styles.controlInfo}>
                                        <span className={styles.controlLabel}>維護模式</span>
                                        <span className={styles.controlDesc}>
                                            {serviceStatus.maintenanceMode ? '🚧 維護中（用戶將看到暫停訊息）' : '正常運作'}
                                        </span>
                                    </div>
                                    <button
                                        className={`${styles.toggleBtn} ${serviceStatus.maintenanceMode ? styles.toggleOn : styles.toggleOff}`}
                                        onClick={toggleMaintenance}
                                    >
                                        {serviceStatus.maintenanceMode ? '結束維護' : '開啟維護'}
                                    </button>
                                </div>

                                <div className={styles.controlRow}>
                                    <div className={styles.controlInfo}>
                                        <span className={styles.controlLabel}>KOL 資料庫</span>
                                        <span className={styles.controlDesc}>
                                            {serviceStatus.kolDatabaseEnabled ? '✅ 已開放（廠商可搜尋 KOL）' : '❌ 已關閉'}
                                        </span>
                                    </div>
                                    <button
                                        className={`${styles.toggleBtn} ${serviceStatus.kolDatabaseEnabled ? styles.toggleOn : styles.toggleOff}`}
                                        onClick={toggleKolDatabase}
                                    >
                                        {serviceStatus.kolDatabaseEnabled ? '關閉' : '開啟'}
                                    </button>
                                </div>

                                <div className={styles.controlRow}>
                                    <div className={styles.controlInfo}>
                                        <span className={styles.controlLabel}>徵人專區</span>
                                        <span className={styles.controlDesc}>
                                            {serviceStatus.jobBoardEnabled ? '✅ 已開放（可發布/瀏覽案件）' : '❌ 已關閉'}
                                        </span>
                                    </div>
                                    <button
                                        className={`${styles.toggleBtn} ${serviceStatus.jobBoardEnabled ? styles.toggleOn : styles.toggleOff}`}
                                        onClick={toggleJobBoard}
                                    >
                                        {serviceStatus.jobBoardEnabled ? '關閉' : '開啟'}
                                    </button>
                                </div>

                                <div className={styles.messageRow}>
                                    <label className={styles.controlLabel}>暫停服務訊息：</label>
                                    <textarea
                                        className={styles.messageInput}
                                        value={maintenanceMsg}
                                        onChange={(e) => setMaintenanceMsg(e.target.value)}
                                        placeholder="輸入要顯示給用戶的訊息..."
                                        rows={2}
                                    />
                                    <button
                                        className={styles.saveBtn}
                                        onClick={saveMaintnenaceMessage}
                                    >
                                        儲存訊息
                                    </button>
                                </div>

                                <div className={styles.statusInfo}>
                                    <small>最後更新：{new Date(serviceStatus.lastUpdated).toLocaleString('zh-TW')}</small>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 統計卡片 */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <span className={styles.statIcon}>📝</span>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stats.totalReviews}</span>
                                <span className={styles.statLabel}>總審核次數</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statIcon}>📅</span>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stats.todayReviews}</span>
                                <span className={styles.statLabel}>今日審核</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statIcon}>👥</span>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stats.totalKols}</span>
                                <span className={styles.statLabel}>註冊 KOL</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statIcon}>⚠️</span>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stats.avgRiskScore}%</span>
                                <span className={styles.statLabel}>平均風險分數</span>
                            </div>
                        </div>
                    </div>

                    {/* 營運資金 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>💰 營運資金狀態</h2>
                        <div className={styles.fundCard}>
                            <div className={styles.fundInfo}>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>目前餘額</span>
                                    <span className={styles.fundValue}>NT$ {sponsorshipConfig.currentBalance.toLocaleString()}</span>
                                </div>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>每月成本</span>
                                    <span className={styles.fundValue}>NT$ {sponsorshipConfig.monthlyCost.toLocaleString()}</span>
                                </div>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>可維持天數</span>
                                    <span className={styles.fundValue}>{getRemainingDays()} 天</span>
                                </div>
                                <div className={styles.fundItem}>
                                    <span className={styles.fundLabel}>資金進度</span>
                                    <span className={styles.fundValue}>{getProgressPercentage()}%</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* LLM 成本分析 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>🤖 LLM 成本計算器</h2>
                        <div className={styles.llmCard}>
                            <div className={styles.llmSelector}>
                                <label className={styles.llmLabel}>選擇 LLM 模型：</label>
                                <select
                                    value={selectedLlm}
                                    onChange={(e) => setSelectedLlm(e.target.value)}
                                    className={styles.llmSelect}
                                >
                                    {Object.entries(llmPricing).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.name} ({value.quality}品質 / {value.speed}速度)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.llmSelector}>
                                <label className={styles.llmLabel}>每月預算 (USD)：</label>
                                <input
                                    type="number"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                                    className={styles.llmInput}
                                    min={0}
                                    step={50}
                                />
                            </div>

                            <div className={styles.llmResults}>
                                <div className={styles.llmResult}>
                                    <span className={styles.llmResultLabel}>每次審核成本</span>
                                    <span className={styles.llmResultValue}>
                                        ${costPerReview.toFixed(4)} USD
                                        <small>（約 NT$ {(costPerReview * 32).toFixed(2)}）</small>
                                    </span>
                                </div>
                                <div className={styles.llmResult}>
                                    <span className={styles.llmResultLabel}>月預算可審核</span>
                                    <span className={styles.llmResultValue}>
                                        {monthlyCapacity.toLocaleString()} 次
                                    </span>
                                </div>
                                <div className={styles.llmResult}>
                                    <span className={styles.llmResultLabel}>每日可審核</span>
                                    <span className={styles.llmResultValue}>
                                        {Math.floor(monthlyCapacity / 30)} 次
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* LLM 比較表 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>📋 LLM 方案比較</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>模型</th>
                                        <th>品質</th>
                                        <th>速度</th>
                                        <th>Input $/1M</th>
                                        <th>Output $/1M</th>
                                        <th>每次審核成本</th>
                                        <th>推薦</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(llmPricing).map(([key, value]) => {
                                        const cost = calculateCostPerReview(key)
                                        const isRecommended = key === 'gemini-2.0-flash' || key === 'deepseek-v3'
                                        return (
                                            <tr key={key} className={isRecommended ? styles.recommended : ''}>
                                                <td className={styles.modelName}>{value.name}</td>
                                                <td>{value.quality}</td>
                                                <td>{value.speed}</td>
                                                <td>${value.input}</td>
                                                <td>${value.output}</td>
                                                <td className={styles.costCell}>${cost.toFixed(4)}</td>
                                                <td>
                                                    {key === 'gemini-2.0-flash' && <span className={styles.badge}>💎 最划算</span>}
                                                    {key === 'deepseek-v3' && <span className={styles.badge}>🔥 性價比高</span>}
                                                    {key === 'gpt-4o-mini' && <span className={styles.badge}>⚡ 穩定</span>}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.recommendation}>
                            <h3>💡 建議方案</h3>
                            <p>
                                對於廣告文案審核任務，推薦使用 <strong>Gemini 2.0 Flash</strong> 或 <strong>DeepSeek V3</strong>：
                            </p>
                            <ul>
                                <li><strong>Gemini 2.0 Flash</strong>：成本最低（$0.0007/次），速度最快，品質高，適合大量審核</li>
                                <li><strong>DeepSeek V3</strong>：成本極低（$0.0016/次），中文理解優秀，適合台灣法規內容</li>
                                <li><strong>GPT-4o-mini</strong>：成本低（$0.0009/次），穩定可靠，API 文檔完善</li>
                            </ul>
                        </div>
                    </section>

                    {/* 資料庫建議 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>🗄️ 資料庫建議</h2>
                        <div className={styles.dbCard}>
                            <div className={styles.dbOption}>
                                <div className={styles.dbHeader}>
                                    <span className={styles.dbName}>Supabase (PostgreSQL)</span>
                                    <span className={styles.dbBadge}>推薦</span>
                                </div>
                                <p className={styles.dbDesc}>免費額度 500MB，內建 Auth、Realtime，適合中小型應用</p>
                                <span className={styles.dbPrice}>免費 → $25/月</span>
                            </div>
                            <div className={styles.dbOption}>
                                <div className={styles.dbHeader}>
                                    <span className={styles.dbName}>PlanetScale (MySQL)</span>
                                </div>
                                <p className={styles.dbDesc}>無伺服器 MySQL，自動擴展，分支功能強大</p>
                                <span className={styles.dbPrice}>免費 → $29/月</span>
                            </div>
                            <div className={styles.dbOption}>
                                <div className={styles.dbHeader}>
                                    <span className={styles.dbName}>Upstash (Redis)</span>
                                </div>
                                <p className={styles.dbDesc}>快取、Rate Limiting，按使用量計費</p>
                                <span className={styles.dbPrice}>免費 → 按量計費</span>
                            </div>
                            <div className={styles.dbOption}>
                                <div className={styles.dbHeader}>
                                    <span className={styles.dbName}>Vercel KV</span>
                                </div>
                                <p className={styles.dbDesc}>與 Vercel 整合最佳，適合 Session 儲存</p>
                                <span className={styles.dbPrice}>免費 → $1/GB</span>
                            </div>
                        </div>
                    </section>

                    {/* 📮 用戶反饋管理 */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>📮 用戶反饋管理</h2>
                        <div className={styles.feedbackCard}>
                            {feedbacks.length === 0 ? (
                                <div className={styles.emptyFeedback}>
                                    <span>📭</span>
                                    <p>尚無用戶反饋</p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.feedbackStats}>
                                        <span>共 {feedbacks.length} 則反饋</span>
                                        <button
                                            className={styles.clearBtn}
                                            onClick={() => {
                                                if (confirm('確定要清除所有反饋？')) {
                                                    localStorage.removeItem('user-feedbacks')
                                                    setFeedbacks([])
                                                }
                                            }}
                                        >
                                            清除全部
                                        </button>
                                    </div>
                                    <div className={styles.feedbackList}>
                                        {feedbacks.map((fb, index) => {
                                            const typeInfo = feedbackTypeLabels[fb.type] || feedbackTypeLabels.other
                                            return (
                                                <div key={index} className={styles.feedbackItem}>
                                                    <div className={styles.feedbackHeader}>
                                                        <span
                                                            className={styles.feedbackType}
                                                            style={{ backgroundColor: `${typeInfo.color}20`, color: typeInfo.color }}
                                                        >
                                                            {typeInfo.icon} {typeInfo.label}
                                                        </span>
                                                        <span className={styles.feedbackTime}>
                                                            {new Date(fb.timestamp).toLocaleString('zh-TW')}
                                                        </span>
                                                    </div>
                                                    <p className={styles.feedbackMessage}>{fb.message}</p>
                                                    <div className={styles.feedbackMeta}>
                                                        <span>📍 {fb.page || '首頁'}</span>
                                                        {fb.email && <span>📧 {fb.email}</span>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
