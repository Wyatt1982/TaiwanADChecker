import type { ReviewAudienceMode } from '@/data/reviewModes'

export type ReviewRiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

export interface ReviewIssue {
    type: string
    text: string
    severity: ReviewRiskLevel
    law?: string
    suggestion?: string
}

export interface SimilarCaseMatch {
    id: string
    title: string
    category: string
    authority: string
    date: string
    penalty: string
    fineAmount: number
    violationType: string
    violationText: string
    source?: string
    sourceUrl?: string
    lawReference?: string
    riskTags?: string[]
    similarityScore: number
    matchedBy: Array<'product_type' | 'risk_tag' | 'keyword' | 'text_overlap'>
}

export interface LawSummary {
    primaryLaws: string[]
    relatedCategories: string[]
}

export interface ReviewApiResult {
    riskLevel: ReviewRiskLevel
    riskScore: number
    issues: ReviewIssue[]
    suggestions: string[]
    revisedContent: string
    processingTime: number
    provider?: 'openai' | 'anthropic' | 'gemini' | 'mock'
    audienceMode?: ReviewAudienceMode
    similarCases?: SimilarCaseMatch[]
    lawSummary?: LawSummary
}
