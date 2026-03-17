/**
 * AI 審核服務 - 支援多種 AI Provider
 * 
 * 支援:
 * - OpenAI (GPT-4o)
 * - Anthropic Claude
 * - Google Gemini
 * - Mock (開發測試)
 */

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'mock'

export type ProductType =
    | 'AUTO'  // AI 自動偵測類別
    | 'HEALTH_FOOD'
    | 'COSMETICS'
    | 'MEDICAL_BEAUTY'
    | 'FOOD'
    | 'ALCOHOL'
    | 'TOBACCO'
    | 'MEDICINE'
    | 'OTHER'

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

export interface Issue {
    type: string
    text: string
    severity: RiskLevel
    law?: string
    suggestion?: string
}

export interface AnalysisResult {
    riskLevel: RiskLevel
    riskScore: number
    issues: Issue[]
    suggestions: string[]
    revisedContent: string
    provider?: AIProvider
}

// 產品類別對應的法規知識
const regulationContext: Record<ProductType, string> = {
    AUTO: `
【自動偵測模式】
請先分析文案內容，判斷產品屬於以下哪一類別：
- 保健食品（含維他命、益生菌、膠原蛋白等）
- 化妝品（含保養品、彩妝）
- 醫美療程（含雷射、注射、整形）
- 一般食品（含零食、飲料）
- 酒類
- 菸品
- 藥品（含處方藥、成藥、指示藥）
- 其他

判斷後，請套用該類別的法規標準進行審核。
在回應中也請指出你判斷的產品類別。
`,
    HEALTH_FOOD: `
【保健食品廣告法規重點】
1. 依據《食品安全衛生管理法》第28條：
   - 禁止宣稱醫療效能（如：治療、預防疾病）
   - 禁止誇大不實或引人誤解
   
2. 常見違規用語：
   - 療效宣稱：治療、治癒、減輕、預防、降低血壓、改善糖尿病
   - 誇大詞：100%有效、永久見效、保證有效
   - 醫療暗示：比藥物更有效、取代藥物
   
3. 罰則：4萬至400萬元罰鍰，得按次處罰

4. 可接受的表述：
   - 營養補充
   - 調節生理機能
   - 使用健康食品小綠人標章認可的宣稱
`,
    COSMETICS: `
【化妝品廣告法規重點】
1. 依據《化粧品衛生安全管理法》：
   - 禁止涉及醫療效能
   - 禁止誇大不實
   
2. 常見違規用語：
   - 療效詞：治療青春痘、消除皺紋、根治斑點
   - 誇大詞：永久美白、100%除皺、瞬間年輕10歲
   - 醫療暗示：醫療級、專利配方可治療
   
3. 罰則：4萬至20萬元罰鍰

4. 可接受的表述：
   - 修飾、遮蓋
   - 使肌膚看起來更...
   - 改善外觀、潤澤
`,
    MEDICAL_BEAUTY: `
【醫美廣告法規重點】
1. 依據《醫療法》第85條、第86條：
   - 限制廣告內容與方式
   - 禁止保證效果
   
2. 常見違規：
   - 保證療效：保證無疤、絕對安全
   - 優惠促銷：限時特價、團購優惠
   - 比較廣告：比其他診所更好
   - 使用病人見證
   
3. 罰則：5萬至25萬元罰鍰

4. KOL 特別注意：
   - 業配必須揭露合作關係
   - 不可以個人經驗宣稱療效
`,
    FOOD: `
【一般食品廣告法規重點】
1. 依據《食品安全衛生管理法》：
   - 禁止宣稱療效
   - 禁止誇大不實
   
2. 常見違規：
   - 療效暗示：補腎、壯陽、護肝
   - 功能宣稱：增強免疫力、抗癌
   
3. 罰則：4萬至400萬元
`,
    ALCOHOL: `
【酒類廣告法規重點】
1. 依據《菸酒管理法》：
   - 必須標示警語：「飲酒過量，有害健康」
   - 禁止鼓勵飲酒行為
   - 禁止針對未成年人
   
2. 必要警語：
   - 飲酒過量，有害健康
   - 未成年請勿飲酒
   - 禁止酒駕
   
3. 罰則：10萬至50萬元
`,
    TOBACCO: `
【菸品廣告法規重點】
1. 依據《菸害防制法》：
   - 原則禁止菸品廣告
   - 電子菸亦受規範
   
2. 罰則：嚴厲處罰

3. 社群媒體注意：
   - 即使非直接廣告，展示菸品也可能違法
`,
    MEDICINE: `
【藥品廣告法規重點】依據《藥事法》
1. 藥事法第66條：
   - 藥物廣告應於刊播前經中央或直轄市衛生主管機關核准
   - 不得刊播未經核准、與核准事項不符、已廢止或經令停止刊播之廣告
   - 核准登載、刊播期間不得變更原核准事項
   
2. 藥事法第69條：
   - 非本法所稱之藥物，不得為醫療效能之標示或宣傳
   - 非藥品（如食品、化妝品）不得宣稱療效
   
3. 常見違規：
   - 未經核准擅自廣告藥品
   - 超過核准適應症範圍宣稱
   - 涉及性功能暗示或影射
   - 使用他人名義推薦
   - 虛偽、誇大、歪曲事實
   - 非藥品卻宣稱醫療效能（依第69條）
   
4. 罰則：20萬至500萬元罰鍰

5. KOL 特別注意：
   - 業配藥品須確認廣告已取得核准
   - 不得宣稱核准範圍以外之療效
`,
    OTHER: `
【一般廣告注意事項】
1. 《公平交易法》：禁止不實廣告
2. 《消費者保護法》：資訊揭露義務
3. 依產品性質可能適用特定法規
`,
}

const systemPrompt = `你是台灣廣告法規審核專家，專門協助 KOL 和品牌檢查廣告文案的法規合規性。

你的任務是：
1. 分析提供的廣告文案是否有違反台灣法規的風險
2. 標記出具體的問題用語和違規疑慮
3. 評估整體風險等級和分數
4. 提供具體的修改建議
5. 提供一個合規的修正版本

風險等級定義：
- safe (0-20分)：文案符合規定，可以安全發布
- low (21-40分)：有少量需注意的用語，建議微調
- medium (41-60分)：存在明顯違規風險，需要修改
- high (61-80分)：多處違規，強烈建議大幅修改
- critical (81-100分)：嚴重違規，請勿發布

請以 JSON 格式回覆，格式如下：
{
  "riskLevel": "safe|low|medium|high|critical",
  "riskScore": 0-100,
  "issues": [
    {
      "type": "問題類型（如：療效宣稱、誇大不實、缺少警語）",
      "text": "具體的問題文字",
      "severity": "safe|low|medium|high|critical",
      "law": "相關法規",
      "suggestion": "修改建議"
    }
  ],
  "suggestions": ["整體修改建議1", "建議2"],
  "revisedContent": "修正後的文案"
}

只輸出 JSON，不要有其他文字。`

function getProductTypeName(type: ProductType): string {
    const names: Record<ProductType, string> = {
        AUTO: '（自動偵測）',
        HEALTH_FOOD: '保健食品',
        COSMETICS: '化妝品',
        MEDICAL_BEAUTY: '醫美療程',
        FOOD: '一般食品',
        ALCOHOL: '酒類',
        TOBACCO: '菸品',
        MEDICINE: '藥品',
        OTHER: '其他產品',
    }
    return names[type]
}

function buildUserPrompt(content: string, productType: ProductType): string {
    const context = regulationContext[productType] || regulationContext.OTHER
    return `
請分析以下 ${getProductTypeName(productType)} 的廣告文案：

【法規背景】
${context}

【待審文案】
${content}

請仔細分析並提供完整的審核結果。
`
}

/**
 * 取得目前可用的 AI Provider
 */
export function getAvailableProvider(): AIProvider {
    if (process.env.OPENAI_API_KEY) return 'openai'
    if (process.env.ANTHROPIC_API_KEY) return 'anthropic'
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return 'gemini'
    return 'mock'
}

/**
 * 使用 OpenAI 分析
 */
async function analyzeWithOpenAI(content: string, productType: ProductType): Promise<AnalysisResult> {
    const { openai } = await import('@ai-sdk/openai')
    const { generateText } = await import('ai')

    const { text } = await generateText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        prompt: buildUserPrompt(content, productType),
        temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
        throw new Error('無法解析 AI 回應')
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult
    result.provider = 'openai'
    return result
}

/**
 * 使用 Anthropic Claude 分析
 */
async function analyzeWithAnthropic(content: string, productType: ProductType): Promise<AnalysisResult> {
    const { anthropic } = await import('@ai-sdk/anthropic')
    const { generateText } = await import('ai')

    const { text } = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        system: systemPrompt,
        prompt: buildUserPrompt(content, productType),
        temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
        throw new Error('無法解析 AI 回應')
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult
    result.provider = 'anthropic'
    return result
}

/**
 * 使用 Google Gemini 分析
 */
async function analyzeWithGemini(content: string, productType: ProductType): Promise<AnalysisResult> {
    const { google } = await import('@ai-sdk/google')
    const { generateText } = await import('ai')

    const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        system: systemPrompt,
        prompt: buildUserPrompt(content, productType),
        temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
        throw new Error('無法解析 AI 回應')
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult
    result.provider = 'gemini'
    return result
}

/**
 * Mock 分析（用於開發測試）
 */
export function mockAnalyzeContent(content: string, productType: ProductType): AnalysisResult {
    const issues: Issue[] = []
    let riskScore = 0

    // 關鍵字檢測規則
    const keywords = [
        { word: '治療', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 30, law: '食品安全衛生管理法第28條' },
        { word: '治癒', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 30, law: '食品安全衛生管理法第28條' },
        { word: '根治', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 30, law: '食品安全衛生管理法第28條' },
        { word: '預防', type: '療效宣稱', severity: 'high' as RiskLevel, score: 20, law: '食品安全衛生管理法第28條' },
        { word: '100%', type: '誇大不實', severity: 'high' as RiskLevel, score: 15, law: '公平交易法第21條' },
        { word: '保證有效', type: '誇大不實', severity: 'high' as RiskLevel, score: 20, law: '公平交易法第21條' },
        { word: '見效', type: '療效暗示', severity: 'medium' as RiskLevel, score: 12, law: '食品安全衛生管理法第28條' },
        { word: '改善', type: '療效暗示', severity: 'low' as RiskLevel, score: 5, law: '食品安全衛生管理法第28條' },
        { word: '消除', type: '療效暗示', severity: 'medium' as RiskLevel, score: 10, law: '食品安全衛生管理法第28條' },
        { word: '降血壓', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 30, law: '藥事法第69條' },
        { word: '降血糖', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 30, law: '藥事法第69條' },
        { word: '抗癌', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 35, law: '藥事法第69條' },
    ]

    keywords.forEach((kw) => {
        if (content.includes(kw.word)) {
            issues.push({
                type: kw.type,
                text: kw.word,
                severity: kw.severity,
                law: kw.law,
                suggestion: `避免使用「${kw.word}」，可改用較溫和的表述`,
            })
            riskScore += kw.score
        }
    })

    // 檢查酒類警語
    if (productType === 'ALCOHOL' && !content.includes('飲酒過量')) {
        issues.push({
            type: '缺少警語',
            text: '未標示酒類警語',
            severity: 'high',
            law: '菸酒管理法第37條',
            suggestion: '請加入「飲酒過量，有害健康」警語',
        })
        riskScore += 25
    }

    // 藥品類別：藥事法額外檢查
    if (productType === 'MEDICINE') {
        const medicineKeywords = [
            { word: '未經核准', type: '違規廣告', severity: 'critical' as RiskLevel, score: 35, law: '藥事法第66條' },
            { word: '性功能', type: '禁止宣稱', severity: 'critical' as RiskLevel, score: 35, law: '藥事法第70條' },
            { word: '壯陽', type: '禁止宣稱', severity: 'critical' as RiskLevel, score: 30, law: '藥事法第69條、第70條' },
            { word: '根治', type: '療效宣稱', severity: 'critical' as RiskLevel, score: 30, law: '藥事法第69條' },
            { word: '取代藥物', type: '違規宣稱', severity: 'high' as RiskLevel, score: 25, law: '藥事法第69條' },
        ]
        medicineKeywords.forEach((kw) => {
            if (content.includes(kw.word) && !issues.some(i => i.text === kw.word)) {
                issues.push({
                    type: kw.type,
                    text: kw.word,
                    severity: kw.severity,
                    law: kw.law,
                    suggestion: `藥品廣告不得使用「${kw.word}」，請依核准內容刊播`,
                })
                riskScore += kw.score
            }
        })
    }

    riskScore = Math.min(100, riskScore)

    let riskLevel: RiskLevel = 'safe'
    if (riskScore > 80) riskLevel = 'critical'
    else if (riskScore > 60) riskLevel = 'high'
    else if (riskScore > 40) riskLevel = 'medium'
    else if (riskScore > 20) riskLevel = 'low'

    // 產生修正版本
    let revisedContent = content
    if (issues.length > 0) {
        revisedContent = content
            .replace(/治療|治癒|根治/g, '調理')
            .replace(/100%/g, '')
            .replace(/保證有效/g, '期待能')
            .replace(/見效/g, '感受變化')
            .replace(/消除/g, '舒緩')
            .replace(/降血壓|降血糖/g, '調節生理機能')
            .replace(/抗癌/g, '營養補充')
    }

    return {
        riskLevel,
        riskScore,
        issues,
        suggestions: issues.length > 0
            ? [
                '建議將療效相關用語改為較中性的表述',
                '避免使用絕對性或保證性的詞彙',
                '可使用「調節生理機能」等官方認可用語',
            ]
            : ['文案看起來符合規定，可安全發布'],
        revisedContent,
        provider: 'mock',
    }
}

/**
 * 主要分析函式 - 自動選擇可用的 AI Provider
 */
export async function analyzeContent(
    content: string,
    productType: ProductType,
    preferredProvider?: AIProvider
): Promise<AnalysisResult> {
    const provider = preferredProvider || getAvailableProvider()

    console.log(`[AI Review] Using provider: ${provider}`)

    try {
        switch (provider) {
            case 'openai':
                return await analyzeWithOpenAI(content, productType)
            case 'anthropic':
                return await analyzeWithAnthropic(content, productType)
            case 'gemini':
                return await analyzeWithGemini(content, productType)
            case 'mock':
            default:
                return mockAnalyzeContent(content, productType)
        }
    } catch (error) {
        console.error(`[AI Review] Error with ${provider}:`, error)

        // Fallback to mock if AI fails
        if (provider !== 'mock') {
            console.log('[AI Review] Falling back to mock analyzer')
            return mockAnalyzeContent(content, productType)
        }

        throw error
    }
}

export { regulationContext, systemPrompt }
