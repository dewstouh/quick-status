interface StatusIndicatorProps {
    status: 'operational' | 'down' | 'degraded' | 'unknown'
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
    const colors = {
        operational: 'bg-green-500',
        down: 'bg-red-500',
        degraded: 'bg-yellow-500',
        unknown: 'bg-gray-500'
    }

    return (
        <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
    )
  }