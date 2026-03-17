'use server'

import {
    getAdminReviewDashboardData,
    type AdminReviewDashboardData,
} from '@/services/db/reviews'

export async function getAdminReviewDashboardAction(): Promise<AdminReviewDashboardData> {
    try {
        return await getAdminReviewDashboardData()
    } catch (error) {
        console.error('Failed to fetch admin review dashboard data:', error)
        return {
            stats: {
                totalReviews: 0,
                todayReviews: 0,
                totalKols: 0,
                avgRiskScore: 0,
                llmCalls: 0,
                estimatedCost: 0,
                pendingReviews: 0,
                failedReviews: 0,
                completedReviews: 0,
            },
            logs: [],
        }
    }
}
