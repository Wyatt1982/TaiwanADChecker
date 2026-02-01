
import { getSystemStatus } from '@/app/actions/settings'
import { ComingSoon } from '@/components/ComingSoon'
import { KolsList } from './KolsList'

export const dynamic = 'force-dynamic'

export default async function KolsPage() {
    const status = await getSystemStatus()

    if (!status.kolDatabaseEnabled) {
        return (
            <ComingSoon
                title="KOL 資料庫"
                description="搜尋合適的 KOL，找到最佳的合作夥伴"
                icon="🔍"
            />
        )
    }

    return <KolsList />
}
