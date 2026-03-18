'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import {
    reviewModeConfigs,
    reviewModeOrder,
    type ReviewAudienceMode,
} from '@/data/reviewModes'
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

const contentTypes: { value: ContentType; label: string; description: string }[] = [
    { value: 'SCRIPT', label: '影片腳本', description: '審核口語化表達的違規詞' },
    { value: 'POST', label: '社群貼文', description: '審核廣告貼文與團購話術' },
    { value: 'VIDEO_DESC', label: '影片描述', description: '審核摘要中的違規陳述' },
    { value: 'STORY', label: '限時動態', description: '審核簡短文案與促購字眼' },
    { value: 'ARTICLE', label: '部落格文章', description: '審核長文導購與介紹內容' },
    { value: 'AD_COPY', label: '商品頁 / 廣告', description: '審核商品頁與促銷語合規性' },
]

interface ReviewFormProps {
    mode: ReviewAudienceMode
    onModeChange: (mode: ReviewAudienceMode) => void
    onSubmit?: (data: {
        content: string
        productType: ProductType
        contentType: ContentType
        audienceMode: ReviewAudienceMode
    }) => void
    loading?: boolean
}

export function ReviewForm({ mode, onModeChange, onSubmit, loading = false }: ReviewFormProps) {
    const [content, setContent] = useState('')
    const [productType, setProductType] = useState<ProductType>('AUTO')
    const [contentType, setContentType] = useState<ContentType>('POST')
    const [showProductHelp, setShowProductHelp] = useState(false)
    const [showContentHelp, setShowContentHelp] = useState(false)

    const modeConfig = reviewModeConfigs[mode]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return
        onSubmit?.({ content, productType, contentType, audienceMode: mode })
    }

    const selectedProduct = productTypes.find((product) => product.value === productType)
    const selectedContent = contentTypes.find((contentOption) => contentOption.value === contentType)

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formIntro}>
                <span className={styles.formEyebrow}>Review Setup</span>
                <h2 className={styles.formTitle}>先定義這次想看的風險範圍</h2>
                <p className={styles.formLead}>
                    切換模式、標出產品類別與內容型態後，系統會把分析結果整理成更接近「報告」而不是單次聊天的形式。
                </p>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.sectionLabel}>使用模式</label>
                </div>

                <div className={styles.modeGrid}>
                    {reviewModeOrder.map((modeOption) => {
                        const option = reviewModeConfigs[modeOption]
                        return (
                            <button
                                key={modeOption}
                                type="button"
                                className={`${styles.modeBtn} ${mode === modeOption ? styles.modeBtnActive : ''}`}
                                onClick={() => onModeChange(modeOption)}
                            >
                                <span className={styles.modeIcon}>{option.icon}</span>
                                <span className={styles.modeMeta}>
                                    <span className={styles.modeTitle}>{option.label}</span>
                                    <span className={styles.modeDesc}>{option.homeDescription}</span>
                                </span>
                            </button>
                        )
                    })}
                </div>

                <p className={styles.selectedHint}>
                    {modeConfig.icon} {modeConfig.pageSubtitle}
                </p>
            </div>

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

                {showProductHelp && (
                    <div className={styles.helpPanel}>
                        <h4>各類別審核標準</h4>
                        <ul>
                            {productTypes.filter((type) => type.value !== 'AUTO').map((type) => (
                                <li key={type.value}>
                                    <strong>{type.icon} {type.label}</strong>：{type.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

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

            <div className={styles.section}>
                <Textarea
                    label={mode === 'business' ? '廣告文案內容' : '廣告內容或截圖文字'}
                    placeholder={modeConfig.placeholder}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    hint={modeConfig.inputHint}
                    className={styles.textareaField}
                />
            </div>

            <div className={styles.footerBar}>
                <div className={styles.stats}>
                    <span className={styles.statItem}>
                        字數：<strong>{content.length}</strong>
                    </span>
                </div>
                <span className={styles.statTag}>
                    {mode === 'business' ? '發布前合規視角' : '消費前查證視角'}
                </span>
            </div>

            <div className={styles.submitWrap}>
                <span className={styles.statItem}>
                    {mode === 'business' ? '提交後會優先整理改稿方向與法規依據。' : '提交後會整理可疑重點與下一步查證方式。'}
                </span>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!content.trim() || loading}
                className={styles.submitBtn}
            >
                {loading ? '分析中...' : `🔍 ${modeConfig.submitLabel}`}
            </Button>
        </form>
    )
}

export default ReviewForm
