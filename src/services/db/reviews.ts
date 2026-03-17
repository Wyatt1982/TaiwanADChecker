/**
 * 資料庫服務 - 審核記錄操作
 */

import prisma from '@/lib/prisma'
import {
    Prisma,
    ReviewStatus,
    RiskLevel,
    ContentType,
    ProductType,
    UserRole,
    type AdReview
} from '@prisma/client'

const GUEST_REVIEW_EMAIL = 'guest-review@system.local'
const AUTO_DETECT_TITLE = '__AUTO_DETECT__'

export type SubmittedProductType = ProductType | 'AUTO'

// ============================================
// 審核記錄操作
// ============================================

export interface CreateReviewInput {
    userId?: string | null
    content: string
    contentType: ContentType
    productType: SubmittedProductType
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

export interface AdminReviewLogItem {
    id: string
    status: ReviewStatus
    riskLevel: RiskLevel | null
    riskScore: number | null
    contentPreview: string
    contentType: ContentType
    productType: SubmittedProductType
    submitterLabel: string
    submitterType: 'guest' | 'member'
    processingTime: number | null
    llmModel: string | null
    failureReason: string | null
    createdAt: string
    updatedAt: string
}

export interface AdminReviewDashboardData {
    stats: {
        totalReviews: number
        todayReviews: number
        totalKols: number
        avgRiskScore: number
        llmCalls: number
        estimatedCost: number
        pendingReviews: number
        failedReviews: number
        completedReviews: number
    }
    logs: AdminReviewLogItem[]
}

async function getGuestReviewUserId(): Promise<string> {
    const guestUser = await prisma.user.upsert({
        where: { email: GUEST_REVIEW_EMAIL },
        update: {},
        create: {
            email: GUEST_REVIEW_EMAIL,
            name: '匿名送審訪客',
            role: UserRole.AGENCY,
        },
        select: { id: true },
    })

    return guestUser.id
}

function mapSubmittedProductType(productType: SubmittedProductType): {
    storedProductType: ProductType
    storedTitle?: string
} {
    if (productType === 'AUTO') {
        return {
            storedProductType: ProductType.OTHER,
            storedTitle: AUTO_DETECT_TITLE,
        }
    }

    return {
        storedProductType: productType,
    }
}

function getSubmittedProductType(review: Pick<AdReview, 'productType' | 'title'>): SubmittedProductType {
    return review.title === AUTO_DETECT_TITLE ? 'AUTO' : review.productType
}

function getFailureReason(issues: Prisma.JsonValue | null): string | null {
    if (!Array.isArray(issues)) {
        return null
    }

    for (const issue of issues) {
        if (
            issue &&
            typeof issue === 'object' &&
            'type' in issue &&
            issue.type === 'system_error' &&
            'text' in issue &&
            typeof issue.text === 'string'
        ) {
            return issue.text
        }
    }

    return null
}

export async function createReview(input: CreateReviewInput): Promise<AdReview> {
    const { storedProductType, storedTitle } = mapSubmittedProductType(input.productType)
    const reviewUserId = input.userId ?? await getGuestReviewUserId()

    return prisma.adReview.create({
        data: {
            userId: reviewUserId,
            content: input.content,
            contentType: input.contentType,
            productType: storedProductType,
            title: input.title ?? storedTitle,
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

export async function markReviewFailed(
    reviewId: string,
    errorMessage: string,
    processingTime?: number
): Promise<AdReview> {
    return prisma.adReview.update({
        where: { id: reviewId },
        data: {
            status: ReviewStatus.FAILED,
            processingTime,
            issues: [
                {
                    type: 'system_error',
                    text: errorMessage,
                    severity: 'high',
                },
            ],
        },
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

export async function getAdminReviewDashboardData(take: number = 20): Promise<AdminReviewDashboardData> {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const roughCostPerReview = 0.0006

    const [
        totalReviews,
        todayReviews,
        totalKols,
        completedAggregate,
        pendingReviews,
        failedReviews,
        completedReviews,
        recentReviews,
    ] = await prisma.$transaction([
        prisma.adReview.count(),
        prisma.adReview.count({
            where: {
                createdAt: {
                    gte: startOfToday,
                },
            },
        }),
        prisma.kolProfile.count(),
        prisma.adReview.aggregate({
            where: {
                status: ReviewStatus.COMPLETED,
            },
            _avg: {
                riskScore: true,
            },
        }),
        prisma.adReview.count({
            where: { status: ReviewStatus.PENDING },
        }),
        prisma.adReview.count({
            where: { status: ReviewStatus.FAILED },
        }),
        prisma.adReview.count({
            where: { status: ReviewStatus.COMPLETED },
        }),
        prisma.adReview.findMany({
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
    ])

    const avgRiskScore = completedAggregate._avg.riskScore
        ? Math.round(completedAggregate._avg.riskScore * 10) / 10
        : 0

    const logs: AdminReviewLogItem[] = recentReviews.map((review) => {
        const isGuest = review.user.email === GUEST_REVIEW_EMAIL
        const contentPreview = review.content.length > 120
            ? `${review.content.slice(0, 120)}...`
            : review.content

        return {
            id: review.id,
            status: review.status,
            riskLevel: review.riskLevel,
            riskScore: review.riskScore,
            contentPreview,
            contentType: review.contentType,
            productType: getSubmittedProductType(review),
            submitterLabel: isGuest
                ? '匿名訪客'
                : review.user.name || review.user.email,
            submitterType: isGuest ? 'guest' : 'member',
            processingTime: review.processingTime,
            llmModel: review.llmModel,
            failureReason: review.status === ReviewStatus.FAILED
                ? getFailureReason(review.issues)
                : null,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
        }
    })

    return {
        stats: {
            totalReviews,
            todayReviews,
            totalKols,
            avgRiskScore,
            llmCalls: totalReviews,
            estimatedCost: Math.round(totalReviews * roughCostPerReview * 100) / 100,
            pendingReviews,
            failedReviews,
            completedReviews,
        },
        logs,
    }
}
