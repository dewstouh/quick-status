import { UptimeChart } from './UptimeChart'
import { StatusIndicator } from './StatusIndicator'
import { ServiceStatus } from '../actions/getServices'

interface ServiceCardProps extends ServiceStatus {
}

export function ServiceCard({
    name,
    url,
    status,
    uptime,
    responseTime,
    lastChecked,
    createdAt,
    outages = [],
}: ServiceCardProps) {

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <StatusIndicator status={status} />
                    <div>
                        <h3 className="font-medium text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-500">{url}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(status)}`}>
                        {getStatusLabel(status)}
                    </div>
                    <div className="text-sm text-gray-500">{uptime}% uptime</div>
                </div>
            </div>

            <UptimeChart
                createdAt={createdAt}
                outages={outages}
            />

            <div className="flex justify-between text-sm text-gray-600 mt-4">
                <div>
                    <span className="font-medium">Response Time:</span> {responseTime}ms
                </div>
                <div>
                    <span className="font-medium">Last Checked:</span> {lastChecked}
                </div>
            </div>
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'operational':
            return 'text-green-600'
        case 'down':
            return 'text-red-600'
        case 'degraded':
            return 'text-yellow-600'
        default:
            return 'text-gray-600'
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case 'operational':
            return 'Operational'
        case 'down':
            return 'Down'
        case 'degraded':
            return 'Degraded'
        default:
            return 'Unknown'
    }
}