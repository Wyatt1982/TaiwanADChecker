'use client'

import React, { useState } from 'react'
import { RiskBadge } from '@/components/ui/Badge'
import { reviewModeConfigs, type ReviewAudienceMode } from '@/data/reviewModes'
import { consumerEvidenceChecklist, reportingDisclaimer, reportingResources } from '@/data/reporting'
import styles from './ReviewResult.module.css'

type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

interface Issue {
    type: string
    text: string
    severity: RiskLevel
    law?: string
    suggestion?: string
}

interface ReviewResultProps {
    mode: ReviewAudienceMode
    riskLevel: RiskLevel
    riskScore: number
    issues: Issue[]
    suggestions?: string[]
    revisedContent?: string
    processingTime?: number
    provider?: 'openai' | 'anthropic' | 'gemini' | 'mock'
}

const summaryCopy: Record<
    ReviewAudienceMode,
    Record<RiskLevel, { title: string; body: string }>
> = {
    business: {
        safe: {
            title: '目前可以進入最後潤稿階段',
            body: '這段內容未見明顯高風險違規特徵，但仍建議在正式發布前再做一次人工語氣與情境確認。',
        },
        low: {
            title: '先做小幅修正會更穩妥',
            body: '目前已有一些值得調整的語句，先把承諾感和絕對化描述收斂，會更像成熟品牌的表達。',
        },
        medium: {
            title: '建議修改後再發布',
            body: '這段文案已出現明顯法規風險，若直接上線，可能讓整體品牌感和合規性同時受影響。',
        },
        high: {
            title: '這段內容需要大幅重寫',
            body: '目前高風險宣稱過多，建議先回到較中性、資訊導向的敘述方式，再重新檢查一次。',
        },
        critical: {
            title: '不建議直接發布這個版本',
            body: '這份內容已帶有嚴重違規警訊，應先全面下修承諾、療效和結果保證，再進入新的送審流程。',
        },
    },
    consumer: {
        safe: {
            title: '目前沒有明顯高風險警訊',
            body: '雖然暫未見到明顯違規特徵，但仍建議保留基本查證，例如產品標示、來源與主管機關資訊。',
        },
        low: {
            title: '這則廣告有一些需要再查的地方',
            body: '現在還不到直接下結論的程度，但也不建議只靠這段文案就做購買判斷。',
        },
        medium: {
            title: '建議先暫停採信這則說法',
            body: '文案中已有多處可疑訊號，較安全的做法是先保留證據，再多查一層產品與賣家資訊。',
        },
        high: {
            title: '這則廣告有明顯高風險特徵',
            body: '不要只憑這些說法購買，建議優先保存截圖與連結，必要時再往主管機關或消保單位查詢。',
        },
        critical: {
            title: '先不要直接相信這則廣告',
            body: '這段內容已屬嚴重警訊，先保留證據並停止依據這些宣稱做決策，會是更安全的做法。',
        },
    },
}

export function ReviewResult({
    mode,
    riskLevel,
    riskScore,
    issues,
    suggestions = [],
    revisedContent,
    processingTime,
    provider,
}: ReviewResultProps) {
    const [copyLabel, setCopyLabel] = useState('📋 複製內容')

    const providerNames = {
        openai: 'GPT-4o',
        anthropic: 'Claude 3.5',
        gemini: 'Gemini 2.0',
        mock: '規則引擎',
    }

    const modeConfig = reviewModeConfigs[mode]
    const summary = summaryCopy[mode][riskLevel]

    const handleCopy = async () => {
        if (!revisedContent) return

        try {
            await navigator.clipboard.writeText(revisedContent)
            setCopyLabel('已複製')
            window.setTimeout(() => setCopyLabel('📋 複製內容'), 1800)
        } catch {
            setCopyLabel('複製失敗')
            window.setTimeout(() => setCopyLabel('📋 複製內容'), 1800)
        }
    }

    return (
        <div className={styles.result}>
            <section className={styles.overview}>
                <div className={styles.scoreCluster}>
                    <div
                        className={`${styles.scoreRing} ${styles[riskLevel]}`}
                        style={{ '--score': `${riskScore}%` } as React.CSSProperties}
                    >
                        <span className={styles.scoreValue}>{riskScore}</span>
                    </div>

                    <div className={styles.scoreInfo}>
                        <span className={styles.reportEyebrow}>Report Summary</span>
                        <RiskBadge level={riskLevel} />
                        <h2 className={styles.summaryTitle}>{summary.title}</h2>
                        <p className={styles.scoreDesc}>{summary.body}</p>
                    </div>
                </div>

                <div className={styles.metaGrid}>
                    <div className={styles.metaCard}>
                        <span>風險項目</span>
                        <strong>{issues.length}</strong>
                    </div>
                    <div className={styles.metaCard}>
                        <span>輸出視角</span>
                        <strong>{mode === 'business' ? '送審模式' : '辨識模式'}</strong>
                    </div>
                    <div className={styles.metaCard}>
                        <span>分析引擎</span>
                        <strong>{provider ? providerNames[provider] : 'AI 分析'}</strong>
                    </div>
                </div>

                {processingTime && (
                    <p className={styles.processingTime}>
                        分析時間：{(processingTime / 1000).toFixed(2)} 秒
                    </p>
                )}
            </section>

            {modeConfig.disclaimerTitle && modeConfig.disclaimerBody && (
                <div className={styles.disclaimer}>
                    <strong>{modeConfig.disclaimerTitle}</strong>
                    <p>{modeConfig.disclaimerBody}</p>
                </div>
            )}

            {issues.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>Risk Notes</span>
                        <h3 className={styles.sectionTitle}>{modeConfig.issuesTitle}</h3>
                    </div>

                    <div className={styles.issuesList}>
                        {issues.map((issue, index) => (
                            <article
                                key={`${issue.text}-${index}`}
                                className={`${styles.issueCard} ${styles[`issue${issue.severity}`]}`}
                            >
                                <div className={styles.issueHeader}>
                                    <RiskBadge level={issue.severity} />
                                    <span className={styles.issueType}>{issue.type}</span>
                                </div>
                                <p className={styles.issueText}>「{issue.text}」</p>
                                {(issue.law || issue.suggestion) && (
                                    <div className={styles.issueMeta}>
                                        {issue.law && <span className={styles.issueLaw}>相關法規：{issue.law}</span>}
                                        {issue.suggestion && (
                                            <p className={styles.issueSuggestion}>
                                                <strong>建議：</strong>
                                                {issue.suggestion}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {suggestions.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>Action Guide</span>
                        <h3 className={styles.sectionTitle}>{modeConfig.suggestionsTitle}</h3>
                    </div>

                    <ol className={styles.suggestionsList}>
                        {suggestions.map((suggestion, index) => (
                            <li key={`${suggestion}-${index}`} className={styles.suggestionItem}>
                                <span className={styles.suggestionIndex}>0{index + 1}</span>
                                <p>{suggestion}</p>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {mode === 'consumer' && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>Next Steps</span>
                        <h3 className={styles.sectionTitle}>作為消費者的下一步</h3>
                    </div>

                    <div className={styles.consumerPanel}>
                        <div className={styles.consumerChecklist}>
                            {consumerEvidenceChecklist.map((item) => (
                                <div key={item} className={styles.consumerChecklistItem}>
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className={styles.consumerLinks}>
                            {reportingResources.map((resource) => (
                                <article key={resource.title} className={styles.consumerLinkCard}>
                                    <h4>{resource.title}</h4>
                                    <p>{resource.description}</p>
                                    <a
                                        href={resource.href}
                                        className={styles.consumerLink}
                                        target={resource.href.startsWith('http') ? '_blank' : undefined}
                                        rel={resource.href.startsWith('http') ? 'noreferrer' : undefined}
                                    >
                                        {resource.actionLabel}
                                    </a>
                                    <small>{resource.helper}</small>
                                </article>
                            ))}
                        </div>

                        <p className={styles.consumerNote}>{reportingDisclaimer}</p>
                    </div>
                </section>
            )}

            {revisedContent && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>Safer Version</span>
                        <h3 className={styles.sectionTitle}>{modeConfig.revisedTitle}</h3>
                    </div>

                    <div className={styles.revisedContent}>
                        <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                            {copyLabel}
                        </button>
                        <p>{revisedContent}</p>
                    </div>
                </section>
            )}
        </div>
    )
}

export default ReviewResult
