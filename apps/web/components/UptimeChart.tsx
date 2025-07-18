import { Outage } from "../lib/data/getServices";

type StatusType = "operational" | "down" | "degraded" | "unknown";

interface UptimeChartProps {
    createdAt: string | Date;
    outages: Outage[];
}

export function UptimeChart({ createdAt, outages }: UptimeChartProps) {
    const TOTAL_DAYS = 90;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const created = new Date(createdAt);
    created.setHours(0, 0, 0, 0);

    // Genera los días del chart
    const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (TOTAL_DAYS - 1 - i));
        date.setHours(0, 0, 0, 0);

        let status: StatusType = "operational";

        if (date < created) {
            status = "unknown";
        } else {
            const outagesThisDay = outages.filter(o => {
                const start = new Date(o.startTime);
                start.setHours(0, 0, 0, 0);

                const end = o.endTime ? new Date(o.endTime) : null;
                if (end) end.setHours(0, 0, 0, 0);

                return (
                    date >= start &&
                    (
                        !end // sigue activo
                        || date <= end
                    )
                );
            });

            if (outagesThisDay.some(o => o.type === "down")) {
                status = "down";
            } else if (outagesThisDay.some(o => o.type === "degraded")) {
                status = "degraded";
            } else if (outagesThisDay.length === 0) {
                status = "operational";
            }
        }

        return { date, status };
    });

    // Helpers
    const getBarColor = (status: StatusType) => {
        switch (status) {
            case "operational": return "bg-green-400 hover:bg-green-500";
            case "down": return "bg-red-500 hover:bg-red-600";
            case "degraded": return "bg-yellow-500 hover:bg-yellow-600";
            case "unknown":
            default: return "bg-gray-400 hover:bg-gray-500";
        }
    };

    const getTooltipContent = (day: { date: Date; status: string }) => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        switch (day.status) {
            case "operational": return `${dateStr}: Operational - No incidents`;
            case "down": return `${dateStr}: Major outage`;
            case "degraded": return `${dateStr}: Partial outage`;
            case "unknown":
            default: return `${dateStr}: No data available for this day`;
        }
    };

    // Render
    return (
        <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>90 days ago</span>
                <span>Today</span>
            </div>
            <div className="flex gap-0.5 h-8">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-sm transition-colors cursor-pointer relative group ${getBarColor(day.status)}`}
                    >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {getTooltipContent(day)}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
