import { getSystemStatus } from '@/app/actions/settings'
import { ComingSoon } from '@/components/ComingSoon'
import { JobsList } from './JobsList'

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
    const status = await getSystemStatus()

    if (!status.jobBoardEnabled) {
        return (
            <ComingSoon
                title="徵人專區"
                description="瀏覽品牌合作機會，找到適合你的業配案件"
                icon="📋"
            />
        )
    }

    return <JobsList />
}
