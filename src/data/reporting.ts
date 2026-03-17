export interface ReportingResource {
    title: string
    description: string
    href: string
    actionLabel: string
    helper: string
}

export const consumerEvidenceChecklist = [
    '先保留截圖、商品頁網址、賣場名稱、帳號名稱與看到的時間',
    '如果已經下單，再補上訂單編號、付款紀錄、對話紀錄與收據',
    '把最誇張的句子原文貼進來檢查，避免只憑印象描述',
]

export const reportingResources: ReportingResource[] = [
    {
        title: '行政院消保處線上申訴',
        description: '適合已發生購買、退款、到貨或退貨爭議，需要正式留下申訴紀錄與後續調解。',
        href: 'https://appeal.cpc.ey.gov.tw/',
        actionLabel: '前往線上申訴',
        helper: '如果還不確定案件類型，可先撥打 1950 詢問。',
    },
    {
        title: '全國消費者服務專線 1950',
        description: '先確認是不是消費爭議、該找哪個縣市窗口，以及申訴前要準備哪些資料。',
        href: 'tel:1950',
        actionLabel: '撥打 1950',
        helper: '上班時間會轉接所在地的消費者服務中心。',
    },
    {
        title: '食藥署為民服務信箱',
        description: '食品、保健食品、化妝品、藥品、醫療器材等內容若疑似違規宣稱，可向食藥署或衛生機關反映。',
        href: 'https://www.fda.gov.tw/TC/sendmail.aspx',
        actionLabel: '前往食藥署信箱',
        helper: '如涉及食品安全或食品廣告，也可同步撥打 1919。',
    },
    {
        title: '公平會服務信箱',
        description: '遇到一般不實、誤導、與事實不符的廣告宣稱，可向公平交易委員會反映。',
        href: 'https://mailbox.ftc.gov.tw/mailbox/',
        actionLabel: '前往公平會服務信箱',
        helper: '常見於非醫療產品，但明顯誇大或引人錯誤的宣稱。',
    },
]

export const reportingDisclaimer =
    '實際受理機關會依商品類別、刊登平台與案件內容分流；若同時涉及購買糾紛與可疑廣告，建議保留證據後同時走消費申訴與主管機關反映。'
