'use client'

import React from 'react'
import styles from './Badge.module.css'

type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

interface BadgeProps {
    variant?: RiskLevel | 'default'
    children: React.ReactNode
    className?: string
}

const riskLabels: Record<RiskLevel, string> = {
    safe: '安全',
    low: '低風險',
    medium: '中風險',
    high: '高風險',
    critical: '嚴重違規',
}

export function Badge({
    variant = 'default',
    children,
    className = '',
}: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`}>
            {children}
        </span>
    )
}

export function RiskBadge({ level }: { level: RiskLevel }) {
    return (
        <Badge variant={level}>
            {riskLabels[level]}
        </Badge>
    )
}

export default Badge
