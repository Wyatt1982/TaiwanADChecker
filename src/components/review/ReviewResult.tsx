'use client'

import React from 'react'
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
    const providerNames = {
        openai: 'GPT-4o',
        anthropic: 'Claude 3.5',
        gemini: 'Gemini 2.0',
        mock: '規則引擎',
    }
    const modeConfig = reviewModeConfigs[mode]
    const consumerMessages: Record<RiskLevel, string> = {
        safe: '如果你是消費者，目前未見明顯高風險字眼，但仍建議核對產品許可、成分與賣家資訊後再決定是否購買。',
        low: '如果你是消費者，這段內容已有一些需要多查證的字眼，建議先保存截圖並多比對產品資訊。',
        medium: '如果你是消費者，建議先暫停下單，保留頁面與對話證據，再視情況向主管機關或消保單位反映。',
        high: '如果你是消費者，這段內容有多處高風險宣稱，建議不要只憑這些說法購買，並優先保留證據。',
        critical: '如果你是消費者，這段內容屬嚴重警訊，請先不要購買，並盡快保存證據後評估申訴或檢舉。',
    }

    return (
        <div className={styles.result}>
            {/* 風險概覽 */}
            <div className={styles.overview}>
                <div className={styles.scoreSection}>
                    <div
                        className={`${styles.scoreRing} ${styles[riskLevel]}`}
                        style={{ '--score': `${riskScore}%` } as React.CSSProperties}
                    >
                        <span className={styles.scoreValue}>{riskScore}</span>
                    </div>
                    <div className={styles.scoreInfo}>
                        <RiskBadge level={riskLevel} />
                        <p className={styles.scoreDesc}>{modeConfig.scoreDescriptions[riskLevel]}</p>
                    </div>
                </div>

                {processingTime && (
                    <p className={styles.processingTime}>
                        分析時間：{(processingTime / 1000).toFixed(2)} 秒
                        {provider && (
                            <span className={styles.providerBadge}>
                                {provider === 'mock' ? '🔧' : '🤖'} {providerNames[provider]}
                            </span>
                        )}
                    </p>
                )}
            </div>

            {modeConfig.disclaimerTitle && modeConfig.disclaimerBody && (
                <div className={styles.disclaimer}>
                    <strong>{modeConfig.disclaimerTitle}</strong>
                    <p>{modeConfig.disclaimerBody}</p>
                </div>
            )}

            {/* 問題清單 */}
            {issues.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>⚠️</span>
                        {modeConfig.issuesTitle} ({issues.length})
                    </h3>
                    <div className={styles.issuesList}>
                        {issues.map((issue, index) => (
                            <div key={index} className={`${styles.issueCard} ${styles[`issue${issue.severity}`]}`}>
                                <div className={styles.issueHeader}>
                                    <RiskBadge level={issue.severity} />
                                    <span className={styles.issueType}>{issue.type}</span>
                                </div>
                                <p className={styles.issueText}>「{issue.text}」</p>
                                {issue.law && (
                                    <p className={styles.issueLaw}>相關法規：{issue.law}</p>
                                )}
                                {issue.suggestion && (
                                    <p className={styles.issueSuggestion}>
                                        <strong>建議：</strong>{issue.suggestion}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 修改建議 */}
            {suggestions.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>💡</span>
                        {modeConfig.suggestionsTitle}
                    </h3>
                    <ul className={styles.suggestionsList}>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className={styles.suggestionItem}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {mode === 'consumer' && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>🧭</span>
                        作為消費者的下一步
                    </h3>
                    <div className={styles.consumerPanel}>
                        <p className={styles.consumerLead}>{consumerMessages[riskLevel]}</p>

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
                </div>
            )}

            {/* AI 修正版本 */}
            {revisedContent && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>✨</span>
                        {modeConfig.revisedTitle}
                    </h3>
                    <div className={styles.revisedContent}>
                        <p>{revisedContent}</p>
                        <button className={styles.copyBtn}>
                            📋 複製內容
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewResult
