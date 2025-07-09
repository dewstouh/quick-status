import { BannerState } from "../lib/utils"

interface StatusBannerProps extends BannerState {
}

export function StatusBanner({
    type = 'issue',
    title = 'Experiencing issues',
    message = "We're experiencing issues with some of our systems."
}: StatusBannerProps) {
    const styles = {
        issue: 'bg-red-50 border-red-200 text-red-800',
        maintenance: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        operational: 'bg-green-50 border-green-200 text-green-800'
    }

    const iconStyles = {
        issue: 'bg-red-500',
        maintenance: 'bg-yellow-500',
        operational: 'bg-green-500'
    }

    return (
        <div className={`rounded-lg border p-4 mb-8 ${styles[type]}`}>
            <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-0.5 ${iconStyles[type]}`} />
                <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm mt-1">{message}</p>
                </div>
            </div>
        </div>
    )
  }