/**
 * 資料庫服務 - 審核記錄操作
 */

import prisma from '@/lib/prisma'
import {
    ReviewStatus,
    RiskLevel,
    ContentType,
    ProductType,
    type AdReview
} from '@prisma/client'

// ============================================
// 審核記錄操作
// ============================================

export interface CreateReviewInput {
    userId: string
    content: string
    contentType: ContentType
    productType: ProductType
    title?: string
    productName?: string
}

export interface SaveReviewResultInput {
    reviewId: string
    riskLevel: RiskLevel
    riskScore: number
    issues: object[]
    suggestions: string[]
    revisedContent?: string
    processingTime: number
    llmModel?: string
}

export async function createReview(input: CreateReviewInput): Promise<AdReview> {
    return prisma.adReview.create({
        data: {
            userId: input.userId,
            content: input.content,
            contentType: input.contentType,
            productType: input.productType,
            title: input.title,
            productName: input.productName,
            status: ReviewStatus.PENDING,
        },
    })
}

export async function saveReviewResult(input: SaveReviewResultInput): Promise<AdReview> {
    return prisma.adReview.update({
        where: { id: input.reviewId },
        data: {
            status: ReviewStatus.COMPLETED,
            riskLevel: input.riskLevel,
            riskScore: input.riskScore,
            issues: input.issues,
            suggestions: input.suggestions,
            revisedContent: input.revisedContent,
            processingTime: input.processingTime,
            llmModel: input.llmModel,
        },
    })
}

export async function markReviewFailed(reviewId: string): Promise<AdReview> {
    return prisma.adReview.update({
        where: { id: reviewId },
        data: { status: ReviewStatus.FAILED },
    })
}

export async function getReviewById(id: string): Promise<AdReview | null> {
    return prisma.adReview.findUnique({
        where: { id },
        include: { user: { select: { email: true, name: true } } },
    })
}

export async function getUserReviews(userId: string, options: {
    skip?: number
    take?: number
} = {}): Promise<{ reviews: AdReview[]; total: number }> {
    const { skip = 0, take = 20 } = options

    const [reviews, total] = await prisma.$transaction([
        prisma.adReview.findMany({
            where: { userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.adReview.count({ where: { userId } }),
    ])

    return { reviews, total }
}

export async function getReviewStats(userId: string): Promise<{
    total: number
    passed: number
    avgRiskScore: number
}> {
    const reviews = await prisma.adReview.findMany({
        where: { userId, status: ReviewStatus.COMPLETED },
        select: { riskLevel: true, riskScore: true },
    })

    const passed = reviews.filter(r => r.riskLevel === RiskLevel.SAFE || r.riskLevel === RiskLevel.LOW).length
    const avgScore = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.riskScore || 0), 0) / reviews.length
        : 0

    return {
        total: reviews.length,
        passed,
        avgRiskScore: Math.round(avgScore * 10) / 10,
    }
}

// ============================================
// 匿名審核 (無需登入)
// ============================================

export async function createAnonymousReview(content: string, productType: ProductType): Promise<{
    tempId: string
}> {
    // 匿名審核不存入資料庫，只回傳臨時 ID 供追蹤
    return {
        tempId: `anon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    }
}
