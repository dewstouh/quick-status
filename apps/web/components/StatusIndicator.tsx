interface StatusIndicatorProps {
    status: 'operational' | 'down' | 'degraded'
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
    const colors = {
        operational: 'bg-green-500',
        down: 'bg-red-500',
        degraded: 'bg-yellow-500'
    }

    return (
        <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
    )
  }