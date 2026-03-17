'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import styles from './ReviewForm.module.css'

type ProductType =
    | 'AUTO'
    | 'HEALTH_FOOD'
    | 'COSMETICS'
    | 'MEDICAL_BEAUTY'
    | 'FOOD'
    | 'ALCOHOL'
    | 'TOBACCO'
    | 'MEDICINE'
    | 'OTHER'

type ContentType =
    | 'SCRIPT'
    | 'POST'
    | 'VIDEO_DESC'
    | 'STORY'
    | 'ARTICLE'
    | 'AD_COPY'

// 產品類別定義（含審核說明）
const productTypes: { value: ProductType; label: string; icon: string; description: string }[] = [
    {
        value: 'AUTO',
        label: '自動偵測',
        icon: '🤖',
        description: 'AI 自動判斷產品類別，套用對應法規'
    },
    {
        value: 'HEALTH_FOOD',
        label: '保健食品',
        icon: '💊',
        description: '依食安法 §28 審核，禁止療效宣稱'
    },
    {
        value: 'COSMETICS',
        label: '化妝品',
        icon: '💄',
        description: '依化粧品管理法審核，禁止醫療效能'
    },
    {
        value: 'MEDICAL_BEAUTY',
        label: '醫美療程',
        icon: '💉',
        description: '依醫療法審核，禁止誇大療效'
    },
    {
        value: 'FOOD',
        label: '一般食品',
        icon: '🍔',
        description: '依食安法審核，禁止健康宣稱'
    },
    {
        value: 'ALCOHOL',
        label: '酒類',
        icon: '🍷',
        description: '依菸酒管理法審核，需加警語'
    },
    {
        value: 'TOBACCO',
        label: '菸品',
        icon: '🚬',
        description: '依菸害防制法審核，嚴格限制廣告'
    },
    {
        value: 'MEDICINE',
        label: '藥品',
        icon: '💊',
        description: '依藥事法 §66、§69 審核，須經核准且不得逾核准範圍'
    },
    {
        value: 'OTHER',
        label: '其他',
        icon: '📦',
        description: '一般廣告法規審核'
    },
]

// 內容類型定義（含審核重點說明）
const contentTypes: { value: ContentType; label: string; description: string }[] = [
    { value: 'SCRIPT', label: '影片腳本', description: '審核口語化表達的違規詞' },
    { value: 'POST', label: '社群貼文', description: '審核文字誇大宣稱' },
    { value: 'VIDEO_DESC', label: '影片描述', description: '審核摘要中的違規陳述' },
    { value: 'STORY', label: '限時動態', description: '審核簡短文案的違規' },
    { value: 'ARTICLE', label: '部落格文章', description: '審核長文中隱藏違規詞' },
    { value: 'AD_COPY', label: '廣告文案', description: '審核促銷語合規性' },
]

interface ReviewFormProps {
    onSubmit?: (data: {
        content: string
        productType: ProductType
        contentType: ContentType
    }) => void
    loading?: boolean
}

export function ReviewForm({ onSubmit, loading = false }: ReviewFormProps) {
    const [content, setContent] = useState('')
    const [productType, setProductType] = useState<ProductType>('AUTO')  // 預設自動偵測
    const [contentType, setContentType] = useState<ContentType>('POST')
    const [showProductHelp, setShowProductHelp] = useState(false)
    const [showContentHelp, setShowContentHelp] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return
        onSubmit?.({ content, productType, contentType })
    }

    const selectedProduct = productTypes.find(p => p.value === productType)
    const selectedContent = contentTypes.find(c => c.value === contentType)

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* 產品類別選擇 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.sectionLabel}>產品類別</label>
                    <button
                        type="button"
                        className={styles.helpBtn}
                        onClick={() => setShowProductHelp(!showProductHelp)}
                    >
                        {showProductHelp ? '收起' : '📋 查看說明'}
                    </button>
                </div>

                {/* 當前選擇的說明 */}
                {selectedProduct && (
                    <p className={styles.selectedHint}>
                        {selectedProduct.icon} {selectedProduct.description}
                    </p>
                )}

                <div className={styles.productGrid}>
                    {productTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            className={`${styles.productBtn} ${productType === type.value ? styles.productBtnActive : ''} ${type.value === 'AUTO' ? styles.productBtnAuto : ''}`}
                            onClick={() => setProductType(type.value)}
                            title={type.description}
                        >
                            <span className={styles.productIcon}>{type.icon}</span>
                            <span className={styles.productLabel}>{type.label}</span>
                        </button>
                    ))}
                </div>

                {/* 展開的說明列表 */}
                {showProductHelp && (
                    <div className={styles.helpPanel}>
                        <h4>各類別審核標準</h4>
                        <ul>
                            {productTypes.filter(p => p.value !== 'AUTO').map((type) => (
                                <li key={type.value}>
                                    <strong>{type.icon} {type.label}</strong>：{type.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 內容類型選擇 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.sectionLabel}>內容類型</label>
                    <button
                        type="button"
                        className={styles.helpBtn}
                        onClick={() => setShowContentHelp(!showContentHelp)}
                    >
                        {showContentHelp ? '收起' : '📋 查看說明'}
                    </button>
                </div>

                {/* 當前選擇的說明 */}
                {selectedContent && (
                    <p className={styles.selectedHint}>
                        {selectedContent.description}
                    </p>
                )}

                <div className={styles.contentTypeRow}>
                    {contentTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            className={`${styles.contentTypeBtn} ${contentType === type.value ? styles.contentTypeBtnActive : ''}`}
                            onClick={() => setContentType(type.value)}
                            title={type.description}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* 展開的說明列表 */}
                {showContentHelp && (
                    <div className={styles.helpPanel}>
                        <h4>各類型審核重點</h4>
                        <ul>
                            {contentTypes.map((type) => (
                                <li key={type.value}>
                                    <strong>{type.label}</strong>：{type.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 文案輸入 */}
            <div className={styles.section}>
                <Textarea
                    label="廣告文案內容"
                    placeholder="請貼上您的廣告文案、腳本或業配內容...

範例：
這款膠原蛋白真的超有效！吃了一個月皮膚變得超水潤，細紋都不見了！強烈推薦給大家～"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    hint="支援純文字格式，建議貼上完整的廣告內容以獲得最準確的審核結果"
                />
            </div>

            {/* 字數統計 */}
            <div className={styles.stats}>
                <span className={styles.statItem}>
                    字數：<strong>{content.length}</strong>
                </span>
            </div>

            {/* 提交按鈕 */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!content.trim() || loading}
                className={styles.submitBtn}
            >
                {loading ? '分析中...' : '🔍 開始審核'}
            </Button>
        </form>
    )
}

export default ReviewForm
