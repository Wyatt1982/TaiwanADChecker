export type ReviewAudienceMode = 'business' | 'consumer'
export type ReviewRiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

export interface ReviewModeConfig {
    label: string
    shortLabel: string
    icon: string
    homeTitle: string
    homeDescription: string
    ctaLabel: string
    pageTitle: string
    pageSubtitle: string
    placeholder: string
    inputHint: string
    submitLabel: string
    loadingTitle: string
    loadingHint: string
    emptyTitle: string
    emptyDescription: string
    issuesTitle: string
    suggestionsTitle: string
    revisedTitle: string
    scoreDescriptions: Record<ReviewRiskLevel, string>
    disclaimerTitle?: string
    disclaimerBody?: string
}

export const reviewModeConfigs: Record<ReviewAudienceMode, ReviewModeConfig> = {
    business: {
        label: '我要發布內容',
        shortLabel: '發布前',
        icon: '🛡️',
        homeTitle: '送審文案與改稿',
        homeDescription: '適合 KOL、品牌、小編、美業與電商團隊，在發布前先做法規風險檢查。',
        ctaLabel: '開始送審',
        pageTitle: '發布前廣告送審',
        pageSubtitle: '在發布前先檢查風險，找出危險句、看到法規依據，並取得較安全的改寫方向。',
        placeholder: `請貼上您的廣告文案、腳本或業配內容...\n\n範例：\n這款膠原蛋白真的超有效！吃了一個月皮膚變得超水潤，細紋都不見了！強烈推薦給大家～`,
        inputHint: '適合貼商品頁文案、客服話術、社群貼文、業配稿與私訊回覆。',
        submitLabel: '開始送審',
        loadingTitle: 'AI 正在檢查這段文案...',
        loadingHint: '會比對法規重點、常見違規句型與歷史案例。',
        emptyTitle: '先貼一段準備發布的文案',
        emptyDescription: '系統會標出高風險句、法規依據與較安全的改寫方向。',
        issuesTitle: '發現的問題',
        suggestionsTitle: '修改建議',
        revisedTitle: '較安全的改寫版本',
        scoreDescriptions: {
            safe: '目前看起來符合法規要求，可以作為發布前的參考版本。',
            low: '有少量需要斟酌的用語，建議先微調再發布。',
            medium: '這段文案有明顯風險，建議先修改後再發布。',
            high: '存在多處高風險內容，建議大幅修改。',
            critical: '這段文案風險很高，不建議直接發布。',
        },
    },
    consumer: {
        label: '我要判斷廣告',
        shortLabel: '消費者',
        icon: '🔎',
        homeTitle: '辨識不實廣告風險',
        homeDescription: '適合一般消費者判斷一則廣告是否有誇大、療效暗示或其他高風險違規特徵。',
        ctaLabel: '檢查廣告風險',
        pageTitle: '廣告風險辨識',
        pageSubtitle: '貼上看到的廣告文案、貼文或截圖文字，快速判斷是否有高風險不實廣告特徵。',
        placeholder: `請貼上你看到的廣告文案、社群貼文或截圖中的文字...\n\n範例：\n吃了三天就能改善睡眠問題，七天有感，保證有效，現在下單再送療程折扣！`,
        inputHint: '適合貼商品頁、社群廣告、限動文字、團購貼文與推銷話術。',
        submitLabel: '開始辨識風險',
        loadingTitle: 'AI 正在辨識這則廣告的風險...',
        loadingHint: '會指出可疑說法、對應法規類型，並提供下一步查證建議。',
        emptyTitle: '先貼一則你想查的廣告內容',
        emptyDescription: '系統會幫你判斷可疑重點，整理成白話的風險說明與查證方向。',
        issuesTitle: '可疑重點',
        suggestionsTitle: '你可以怎麼查證',
        revisedTitle: '較安全的表述示例',
        scoreDescriptions: {
            safe: '目前沒有明顯高風險違規特徵，但仍建議保留基本查證。',
            low: '有一些需要留意的宣稱，建議不要只看單一說法就下判斷。',
            medium: '這則廣告有明顯可疑之處，建議再查證來源與產品標示。',
            high: '這則廣告出現多個高風險特徵，應提高警覺。',
            critical: '這則廣告極可能涉及不實或違規宣稱，建議不要直接採信。',
        },
        disclaimerTitle: '辨識提醒',
        disclaimerBody: '本結果提供的是廣告風險辨識與查證方向，不構成正式法律意見或違法定性。',
    },
}

export const reviewModeOrder: ReviewAudienceMode[] = ['business', 'consumer']

export function parseReviewAudienceMode(value: string | null | undefined): ReviewAudienceMode {
    return value === 'consumer' ? 'consumer' : 'business'
}
