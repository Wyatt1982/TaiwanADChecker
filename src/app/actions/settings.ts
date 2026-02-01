'use server'

import { prisma } from '@/lib/prisma'
import { ServiceStatus, defaultServiceStatus, SERVICE_STATUS_KEY } from '@/data/serviceStatus'
import { revalidatePath } from 'next/cache'

export async function getSystemStatus(): Promise<ServiceStatus> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: SERVICE_STATUS_KEY }
        })

        if (!setting) {
            // Initialize if not exists
            // But we shouldn't fail if DB is readonly or something, but create is fine.
            return defaultServiceStatus
        }

        return setting.value as unknown as ServiceStatus
    } catch (error) {
        console.error('Failed to fetch system status:', error)
        return defaultServiceStatus
    }
}

export async function updateSystemStatusAction(status: ServiceStatus): Promise<ServiceStatus> {
    try {
        const updated = await prisma.systemSetting.upsert({
            where: { key: SERVICE_STATUS_KEY },
            update: {
                value: status as any,
                updatedAt: new Date()
            },
            create: {
                key: SERVICE_STATUS_KEY,
                value: status as any,
                description: 'System Service Status Configuration'
            }
        })
        
        revalidatePath('/', 'layout') // Revalidate everything
        return updated.value as unknown as ServiceStatus
    } catch (error) {
        console.error('Failed to update system status:', error)
        throw error
    }
}
