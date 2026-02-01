'use client'

import React from 'react'
import { RiskBadge } from '@/components/ui/Badge'
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
    riskLevel: RiskLevel
    riskScore: number
    issues: Issue[]
    suggestions?: string[]
    revisedContent?: string
    processingTime?: number
    provider?: 'openai' | 'anthropic' | 'gemini' | 'mock'
}

export function ReviewResult({
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
                        <p className={styles.scoreDesc}>
                            {riskLevel === 'safe' && '您的文案符合法規要求'}
                            {riskLevel === 'low' && '有少量需注意的用語'}
                            {riskLevel === 'medium' && '建議修改後再發布'}
                            {riskLevel === 'high' && '存在多處違規風險'}
                            {riskLevel === 'critical' && '請勿發布此內容'}
                        </p>
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

            {/* 問題清單 */}
            {issues.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>⚠️</span>
                        發現的問題 ({issues.length})
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
                        修改建議
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

            {/* AI 修正版本 */}
            {revisedContent && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>✨</span>
                        AI 建議修正版本
                    </h3>
                    <div className={styles.revisedContent}>
                        <p>{revisedContent}</p>
                        <button className={styles.copyBtn}>
                            📋 複製文案
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewResult
