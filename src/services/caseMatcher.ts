import { categoryLabels, penaltyCases, regulations, type PenaltyCase } from '@/data/regulations'
import type { ProductType } from '@/services/analyzer'
import type { LawSummary, ReviewIssue, SimilarCaseMatch } from '@/types/review'

type MatchReason = SimilarCaseMatch['matchedBy'][number]

const CATEGORY_LAW_FALLBACKS: Record<string, string[]> = {
    HEALTH_FOOD: ['食品安全衛生管理法第28條', '健康食品管理法第14條'],
    COSMETICS: ['化粧品衛生安全管理法第10條'],
    MEDICAL_BEAUTY: ['醫療法第85條', '醫療法第86條'],
    FOOD: ['食品安全衛生管理法第28條'],
    ALCOHOL: ['菸酒管理法'],
    TOBACCO: ['菸害防制法'],
    MEDICINE: ['藥事法第66條', '藥事法第69條'],
    OTHER: ['公平交易法', '消費者保護法'],
}

const RISK_PATTERNS = [
    { phrase: '治療', tag: '療效宣稱' },
    { phrase: '治癒', tag: '療效宣稱' },
    { phrase: '改善', tag: '療效暗示' },
    { phrase: '預防', tag: '療效暗示' },
    { phrase: '療效', tag: '療效宣稱' },
    { phrase: '根治', tag: '療效宣稱' },
    { phrase: '消除', tag: '療效暗示' },
    { phrase: '保證', tag: '保證效果' },
    { phrase: '有效', tag: '保證效果' },
    { phrase: '見效', tag: '保證效果' },
    { phrase: '有感', tag: '保證效果' },
    { phrase: '100%', tag: '絕對化用語' },
    { phrase: '永久', tag: '絕對化用語' },
    { phrase: '無副作用', tag: '安全保證' },
    { phrase: '絕對安全', tag: '安全保證' },
    { phrase: '醫療級', tag: '醫療暗示' },
    { phrase: '藥用', tag: '醫療暗示' },
    { phrase: '特價', tag: '優惠促銷' },
    { phrase: '優惠', tag: '優惠促銷' },
    { phrase: '團購', tag: '優惠促銷' },
    { phrase: '限時', tag: '優惠促銷' },
]

const STOP_PHRASES = new Set([
    '產品',
    '廣告',
    '網站',
    '國外網站',
    '涉嫌',
    '違規',
    '案例',
    '效果',
    '使用',
    '可以',
    '真的',
    '這款',
    '這個',
    '一次',
    '立即',
])

function normalizeText(value: string | undefined | null): string {
    return (value || '')
        .toLowerCase()
        .replace(/[「」『』（）()，。、；：！!？?／/\-_%.,:;'"`~[\]{}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
    return Array.from(
        new Set(
            values
                .map((value) => value?.trim())
                .filter((value): value is string => Boolean(value))
        )
    )
}

function getCategoryBannedPhrases(category: string): string[] {
    return regulations
        .filter((regulation) => regulation.category === category)
        .flatMap((regulation) => regulation.bannedPhrases)
}

function deriveLawReference(caseItem: PenaltyCase): string | undefined {
    const explicitLaw = caseItem.lawReference?.trim()
    if (explicitLaw) {
        return explicitLaw
    }

    return CATEGORY_LAW_FALLBACKS[caseItem.category]?.[0]
}

function deriveRiskTagsFromText(text: string): string[] {
    const normalized = normalizeText(text)

    return uniqueStrings(
        RISK_PATTERNS
            .filter((pattern) => normalized.includes(pattern.phrase.toLowerCase()))
            .map((pattern) => pattern.tag)
    )
}

function deriveCaseRiskTags(caseItem: PenaltyCase): string[] {
    if (caseItem.riskTags?.length) {
        return caseItem.riskTags
    }

    return deriveRiskTagsFromText(
        [caseItem.violationType, caseItem.violationText, caseItem.description, caseItem.title].join(' ')
    )
}

function deriveCaseKeywords(caseItem: PenaltyCase): string[] {
    if (caseItem.keywords?.length) {
        return caseItem.keywords
    }

    const categoryKeywords = getCategoryBannedPhrases(caseItem.category)
    const caseText = [caseItem.title, caseItem.description, caseItem.violationType, caseItem.violationText].join(' ')

    const matchedCategoryKeywords = categoryKeywords.filter((keyword) => normalizeText(caseText).includes(normalizeText(keyword)))
    const matchedRiskKeywords = RISK_PATTERNS
        .filter((pattern) => normalizeText(caseText).includes(pattern.phrase.toLowerCase()))
        .map((pattern) => pattern.phrase)

    return uniqueStrings([...matchedCategoryKeywords, ...matchedRiskKeywords])
}

function extractQueryKeywords(content: string, productType: ProductType, issues: ReviewIssue[]): string[] {
    const contentText = normalizeText([content, ...issues.map((issue) => issue.text)].join(' '))
    const categoryKeywords = productType === 'AUTO' ? [] : getCategoryBannedPhrases(productType)
    const matchedCategoryKeywords = categoryKeywords.filter((keyword) => contentText.includes(normalizeText(keyword)))
    const matchedRiskKeywords = RISK_PATTERNS
        .filter((pattern) => contentText.includes(pattern.phrase.toLowerCase()))
        .map((pattern) => pattern.phrase)

    return uniqueStrings([...matchedCategoryKeywords, ...matchedRiskKeywords])
}

function extractIssueTypes(issues: ReviewIssue[]): string[] {
    return uniqueStrings(issues.map((issue) => issue.type))
}

function extractIssueLaws(issues: ReviewIssue[]): string[] {
    return uniqueStrings(issues.map((issue) => issue.law))
}

function collectTextOverlapTerms(content: string, issues: ReviewIssue[]): string[] {
    const rawTerms = [content, ...issues.map((issue) => issue.text)]
        .flatMap((text) => normalizeText(text).split(/\s+/))
        .filter((term) => term.length >= 2 && !STOP_PHRASES.has(term))

    return uniqueStrings(rawTerms)
}

function buildMatchedByList(reasons: Set<MatchReason>): SimilarCaseMatch['matchedBy'] {
    return ['product_type', 'risk_tag', 'keyword', 'text_overlap'].filter((reason) => reasons.has(reason as MatchReason)) as SimilarCaseMatch['matchedBy']
}

function buildCaseMatch(caseItem: PenaltyCase, similarityScore: number, matchedBy: Set<MatchReason>): SimilarCaseMatch {
    return {
        id: caseItem.id,
        title: caseItem.title,
        category: caseItem.category,
        authority: caseItem.authority,
        date: caseItem.date,
        penalty: caseItem.penalty,
        fineAmount: caseItem.fineAmount,
        violationType: caseItem.violationType,
        violationText: caseItem.violationText,
        source: caseItem.source,
        sourceUrl: caseItem.sourceUrl,
        lawReference: deriveLawReference(caseItem),
        riskTags: deriveCaseRiskTags(caseItem),
        similarityScore,
        matchedBy: buildMatchedByList(matchedBy),
    }
}

export function matchPenaltyCases(input: {
    content: string
    productType: ProductType
    issues: ReviewIssue[]
    maxResults?: number
}): SimilarCaseMatch[] {
    const { content, productType, issues, maxResults = 3 } = input
    const issueTypes = extractIssueTypes(issues)
    const issueLaws = extractIssueLaws(issues)
    const issueRiskTags = uniqueStrings([
        ...issues.flatMap((issue) => deriveRiskTagsFromText(`${issue.type} ${issue.text} ${issue.law || ''}`)),
        ...issues.map((issue) => issue.type),
    ])
    const queryKeywords = extractQueryKeywords(content, productType, issues)
    const overlapTerms = collectTextOverlapTerms(content, issues)

    const scoredCases = penaltyCases
        .map((caseItem) => {
            let score = 0
            const matchedBy = new Set<MatchReason>()
            const caseRiskTags = deriveCaseRiskTags(caseItem)
            const caseKeywords = deriveCaseKeywords(caseItem)
            const caseLawReference = deriveLawReference(caseItem)
            const caseText = normalizeText([caseItem.title, caseItem.description, caseItem.violationType, caseItem.violationText].join(' '))

            if (productType !== 'AUTO' && caseItem.category === productType) {
                score += 40
                matchedBy.add('product_type')
            }

            const hasViolationTypeOverlap = issueTypes.some(
                (issueType) =>
                    normalizeText(caseItem.violationType).includes(normalizeText(issueType)) ||
                    normalizeText(issueType).includes(normalizeText(caseItem.violationType))
            )

            const overlappingRiskTags = caseRiskTags.filter((tag) =>
                issueRiskTags.some((issueTag) => normalizeText(issueTag) === normalizeText(tag))
            )

            if (hasViolationTypeOverlap || overlappingRiskTags.length > 0) {
                score += 25
                matchedBy.add('risk_tag')
                score += overlappingRiskTags.length * 10
            }

            const overlappingKeywords = caseKeywords.filter((keyword) =>
                queryKeywords.some((queryKeyword) => normalizeText(queryKeyword) === normalizeText(keyword))
            )

            if (overlappingKeywords.length > 0) {
                score += overlappingKeywords.length * 6
                matchedBy.add('keyword')
            }

            const overlappingTextTerms = overlapTerms.filter((term) => caseText.includes(term))
            if (overlappingTextTerms.length > 0) {
                score += Math.min(overlappingTextTerms.length, 4) * 4
                matchedBy.add('text_overlap')
            }

            if (issueLaws.length > 0 && caseLawReference) {
                const normalizedCaseLaw = normalizeText(caseLawReference)
                const lawOverlap = issueLaws.some((law) => normalizedCaseLaw.includes(normalizeText(law)) || normalizeText(law).includes(normalizedCaseLaw))
                if (lawOverlap) {
                    score += 12
                    matchedBy.add('risk_tag')
                }
            }

            if (caseItem.fineAmount > 0) {
                score += 8
            }

            if (normalizeText(caseItem.description) !== normalizeText('食藥署公告違規廣告案例')) {
                score += 4
            }

            return {
                caseItem,
                score,
                matchedBy,
            }
        })
        .filter(({ score, matchedBy }) => score > 0 && matchedBy.size > 0)
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score
            }

            return new Date(b.caseItem.date).getTime() - new Date(a.caseItem.date).getTime()
        })

    const prioritized = scoredCases.slice(0, maxResults)

    if (prioritized.length < maxResults && productType !== 'AUTO') {
        const fallbackCases = penaltyCases
            .filter(
                (caseItem) =>
                    caseItem.category === productType &&
                    !prioritized.some((result) => result.caseItem.id === caseItem.id)
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, maxResults - prioritized.length)
            .map((caseItem) => ({
                caseItem,
                score: 20,
                matchedBy: new Set<MatchReason>(['product_type']),
            }))

        prioritized.push(...fallbackCases)
    }

    return prioritized
        .slice(0, maxResults)
        .map(({ caseItem, score, matchedBy }) => buildCaseMatch(caseItem, score, matchedBy))
}

export function buildLawSummary(input: {
    productType: ProductType
    issues: ReviewIssue[]
    similarCases: SimilarCaseMatch[]
}): LawSummary {
    const { productType, issues, similarCases } = input

    const primaryLaws = uniqueStrings([
        ...issues.map((issue) => issue.law),
        ...similarCases.map((caseItem) => caseItem.lawReference),
        ...(productType === 'AUTO' ? [] : CATEGORY_LAW_FALLBACKS[productType] || []),
    ]).slice(0, 4)

    const relatedCategories = uniqueStrings(
        similarCases.map((caseItem) => categoryLabels[caseItem.category]?.label || caseItem.category)
    )

    return {
        primaryLaws,
        relatedCategories,
    }
}
