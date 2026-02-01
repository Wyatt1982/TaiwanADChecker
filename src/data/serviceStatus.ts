// 服務狀態設定
export interface ServiceStatus {
    llmEnabled: boolean
    maintenanceMode: boolean
    maintenanceMessage: string
    kolDatabaseEnabled: boolean
    jobBoardEnabled: boolean
    lastUpdated: string
}

// 預設服務狀態
export const defaultServiceStatus: ServiceStatus = {
    llmEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: '系統維護中，審核功能暫時停止服務，請稍後再試。',
    kolDatabaseEnabled: false,  // 預設關閉，建置中
    jobBoardEnabled: false,     // 預設關閉，建置中
    lastUpdated: new Date().toISOString(),
}

// localStorage key
export const SERVICE_STATUS_KEY = 'service-status'

// 取得服務狀態
export function getServiceStatus(): ServiceStatus {
    if (typeof window === 'undefined') {
        return defaultServiceStatus
    }

    const saved = localStorage.getItem(SERVICE_STATUS_KEY)
    if (saved) {
        try {
            return JSON.parse(saved)
        } catch {
            return defaultServiceStatus
        }
    }
    return defaultServiceStatus
}

// 更新服務狀態
export function updateServiceStatus(status: Partial<ServiceStatus>): ServiceStatus {
    const current = getServiceStatus()
    const updated: ServiceStatus = {
        ...current,
        ...status,
        lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(SERVICE_STATUS_KEY, JSON.stringify(updated))
    return updated
}

// 檢查 LLM 是否可用
export function isLLMAvailable(): boolean {
    const status = getServiceStatus()
    return status.llmEnabled && !status.maintenanceMode
}
