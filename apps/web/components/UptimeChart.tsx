interface UptimeChartProps {
    status: 'operational' | 'down' | 'degraded' | 'unknown';
}

export function UptimeChart({ status }: UptimeChartProps) {
    // Generate 90 days of sample data
    const days = Array.from({ length: 90 }, (_, i) => {
        const isRecent = i >= 87
        if (status === 'down' && isRecent) return 'down'
        if (status === 'degraded' && isRecent) return 'degraded'
        if (status === 'degraded' && Math.random() < 0.1) return 'degraded'
        if (status === 'unknown') return 'unknown'
        return 'operational'
    })

    const getBarColor = (dayStatus: string) => {
        switch (dayStatus) {
            case 'operational':
                return 'bg-green-400'
            case 'down':
                return 'bg-red-500'
            case 'degraded':
                return 'bg-yellow-500'
            default:
                return 'bg-gray-300'
        }
    }

    return (
        <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>90 days ago</span>
                <span>Today</span>
            </div>
            <div className="flex gap-0.5 h-8">
                {days.map((dayStatus, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-sm ${getBarColor(dayStatus)}`}
                        title={`Day ${index + 1}: ${dayStatus}`}
                    />
                ))}
            </div>
        </div>
    )
  }