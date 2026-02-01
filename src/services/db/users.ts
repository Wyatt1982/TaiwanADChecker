/**
 * 資料庫服務 - 用戶相關操作
 */

import prisma from '@/lib/prisma'
import { UserRole, SubscriptionPlan, Prisma, type User, type KolProfile, type BrandProfile } from '@prisma/client'
import { hash, compare } from 'bcryptjs'

// ============================================
// 用戶操作
// ============================================

export interface CreateUserInput {
    email: string
    password?: string
    name?: string
    role?: UserRole
    image?: string
}

export async function createUser(input: CreateUserInput): Promise<User> {
    const { email, password, name, role = UserRole.KOL, image } = input

    const hashedPassword = password ? await hash(password, 12) : null

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role,
            image,
        },
    })
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email },
        include: {
            kolProfile: true,
            brandProfile: true,
        },
    })
}

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
        include: {
            kolProfile: true,
            brandProfile: true,
        },
    })
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false
    return compare(password, user.password)
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
        where: { id },
        data,
    })
}

// ============================================
// KOL Profile 操作
// ============================================

export interface CreateKolProfileInput {
    userId: string
    displayName?: string
    bio?: string
    platforms?: Record<string, string>
    totalFollowers?: number
    categories?: string[]
}

export async function createKolProfile(input: CreateKolProfileInput): Promise<KolProfile> {
    return prisma.kolProfile.create({
        data: {
            userId: input.userId,
            displayName: input.displayName,
            bio: input.bio,
            platforms: input.platforms || {},
            totalFollowers: input.totalFollowers || 0,
            categories: input.categories || [],
        },
    })
}

export async function getKolProfileByUserId(userId: string): Promise<KolProfile | null> {
    return prisma.kolProfile.findUnique({
        where: { userId },
        include: { user: true },
    })
}

export async function updateKolProfile(userId: string, data: Prisma.KolProfileUpdateInput): Promise<KolProfile> {
    return prisma.kolProfile.update({
        where: { userId },
        data,
    })
}

export async function listKolProfiles(options: {
    skip?: number
    take?: number
    categories?: string[]
} = {}): Promise<{ profiles: KolProfile[]; total: number }> {
    const { skip = 0, take = 20, categories } = options

    const where = categories?.length
        ? { categories: { hasSome: categories } }
        : {}

    const [profiles, total] = await prisma.$transaction([
        prisma.kolProfile.findMany({
            where,
            skip,
            take,
            include: { user: { select: { email: true, name: true, image: true } } },
            orderBy: { totalFollowers: 'desc' },
        }),
        prisma.kolProfile.count({ where }),
    ])

    return { profiles, total }
}

// ============================================
// Brand Profile 操作
// ============================================

export interface CreateBrandProfileInput {
    userId: string
    companyName: string
    businessId?: string
    industry?: string
    website?: string
}

export async function createBrandProfile(input: CreateBrandProfileInput): Promise<BrandProfile> {
    return prisma.brandProfile.create({
        data: {
            userId: input.userId,
            companyName: input.companyName,
            businessId: input.businessId,
            industry: input.industry,
            website: input.website,
        },
    })
}

export async function getBrandProfileByUserId(userId: string): Promise<BrandProfile | null> {
    return prisma.brandProfile.findUnique({
        where: { userId },
        include: { user: true },
    })
}

export async function updateBrandPlan(userId: string, plan: SubscriptionPlan, expiresAt?: Date): Promise<BrandProfile> {
    return prisma.brandProfile.update({
        where: { userId },
        data: {
            plan,
            planExpiresAt: expiresAt,
        },
    })
}
