import { NextRequest, NextResponse } from 'next/server'
import { ContentType, RiskLevel } from '@prisma/client'
import { analyzeContent, getAvailableProvider, type ProductType } from '@/services/analyzer'
import { buildLawSummary, matchPenaltyCases } from '@/services/caseMatcher'
import { parseReviewAudienceMode } from '@/data/reviewModes'
import { isMockAuthEnabled } from '@/lib/mockAuth'
import { checkRateLimit, DEFAULT_RATE_LIMIT, API_RATE_LIMIT } from '@/lib/rateLimit'
import { createReview, markReviewFailed, saveReviewResult } from '@/services/db/reviews'
import type { ReviewIssue } from '@/types/review'

function toPrismaRiskLevel(level: 'safe' | 'low' | 'medium' | 'high' | 'critical'): RiskLevel {
    const levelMap: Record<'safe' | 'low' | 'medium' | 'high' | 'critical', RiskLevel> = {
        safe: RiskLevel.SAFE,
        low: RiskLevel.LOW,
        medium: RiskLevel.MEDIUM,
        high: RiskLevel.HIGH,
        critical: RiskLevel.CRITICAL,
    }

    return levelMap[level]
}

// 從 request headers 取得 IP
function getClientIP(request: NextRequest): string {
    // Vercel / Cloudflare 等會傳遞真實 IP
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    const realIP = request.headers.get('x-real-ip')
    if (realIP) {
        return realIP
    }

    // 本地開發
    return '127.0.0.1'
}

// 從 Authorization header 或 cookie 取得 userId
function getUserId(request: NextRequest): string | null {
    if (!isMockAuthEnabled()) {
        return null
    }

    // 檢查 Authorization header（Bearer token）
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        // 這裡應該驗證 token 並解析 userId
        // 目前先用簡單的方式處理
        if (token.startsWith('mock-token-')) {
            return `user-${token}`
        }
    }

    // 檢查 cookie
    const sessionCookie = request.cookies.get('user-session')
    if (sessionCookie?.value) {
        try {
            const session = JSON.parse(sessionCookie.value)
            return session.user?.id || null
        } catch {
            return null
        }
    }

    return null
}

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let reviewId: string | null = null

    // 取得識別資訊
    const clientIP = getClientIP(request)
    const userId = getUserId(request)
    const isAuthenticated = !!userId
    const identifier = userId || `ip:${clientIP}`

    // 1. 先檢查 API 通用 rate limit（防止攻擊）
    const apiLimit = checkRateLimit(`api:${clientIP}`, API_RATE_LIMIT)
    if (!apiLimit.allowed) {
        return NextResponse.json(
            {
                error: '請求過於頻繁，請稍後再試',
                retryAfter: apiLimit.retryAfter,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(apiLimit.retryAfter),
                    'X-RateLimit-Limit': String(apiLimit.limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(apiLimit.resetAt),
                },
            }
        )
    }

    // 2. 檢查每日使用限制
    const dailyLimit = checkRateLimit(
        `daily:${identifier}`,
        DEFAULT_RATE_LIMIT,
        isAuthenticated
    )

    if (!dailyLimit.allowed) {
        const message = isAuthenticated
            ? '今日審核次數已達上限（10 次），請明天再試。'
            : '今日審核次數已達上限，請明天再試。'

        return NextResponse.json(
            {
                error: message,
                retryAfter: dailyLimit.retryAfter,
                isLoggedIn: isAuthenticated,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(dailyLimit.retryAfter),
                    'X-RateLimit-Limit': String(dailyLimit.limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(dailyLimit.resetAt),
                },
            }
        )
    }

    try {
        const body = await request.json()
        const { content, productType, contentType, audienceMode } = body
        const parsedAudienceMode = parseReviewAudienceMode(audienceMode)

        // 驗證必要欄位
        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: '請提供文案內容' },
                { status: 400 }
            )
        }

        if (!productType) {
            return NextResponse.json(
                { error: '請選擇產品類別' },
                { status: 400 }
            )
        }

        // 使用 AI 分析（自動選擇可用的 provider）
        const provider = getAvailableProvider()
        console.log(`[Review API] Analyzing with provider: ${provider}`)

        try {
            const review = await createReview({
                userId,
                content,
                contentType: contentType as ContentType,
                productType: productType as ProductType,
            })
            reviewId = review.id
        } catch (dbError) {
            console.error('[Review API] Failed to create review log:', dbError)
        }

        const result = await analyzeContent(
            content,
            productType as ProductType,
            undefined,
            parsedAudienceMode
        )
        const similarCases = matchPenaltyCases({
            content,
            productType: productType as ProductType,
            issues: result.issues as ReviewIssue[],
        })
        const lawSummary = buildLawSummary({
            productType: productType as ProductType,
            issues: result.issues as ReviewIssue[],
            similarCases,
        })

        const processingTime = Date.now() - startTime

        if (reviewId) {
            try {
                await saveReviewResult({
                    reviewId,
                    riskLevel: toPrismaRiskLevel(result.riskLevel),
                    riskScore: result.riskScore,
                    issues: result.issues,
                    suggestions: result.suggestions,
                    revisedContent: result.revisedContent,
                    processingTime,
                    llmModel: result.provider || provider,
                })
            } catch (dbError) {
                console.error('[Review API] Failed to save review result:', dbError)
            }
        }

        return NextResponse.json({
            ...result,
            processingTime,
            contentType,
            audienceMode: parsedAudienceMode,
            analyzedAt: new Date().toISOString(),
            similarCases,
            lawSummary,
            // 回傳使用量資訊
            usage: {
                remaining: dailyLimit.remaining,
                limit: dailyLimit.limit,
                resetAt: dailyLimit.resetAt,
            },
        }, {
            headers: {
                'X-RateLimit-Limit': String(dailyLimit.limit),
                'X-RateLimit-Remaining': String(dailyLimit.remaining),
                'X-RateLimit-Reset': String(dailyLimit.resetAt),
            },
        })
    } catch (error) {
        console.error('Review API Error:', error)

        if (reviewId) {
            try {
                await markReviewFailed(
                    reviewId,
                    error instanceof Error ? error.message : '審核服務發生未知錯誤',
                    Date.now() - startTime
                )
            } catch (dbError) {
                console.error('[Review API] Failed to mark review as failed:', dbError)
            }
        }

        return NextResponse.json(
            { error: '審核服務暫時無法使用' },
            { status: 500 }
        )
    }
}
