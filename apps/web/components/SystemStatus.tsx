import { ServiceStatus } from '../lib/data/getServices'
import { ServiceCard } from './ServiceCard'

interface PageProps {
    services: ServiceStatus[]
}

export async function SystemStatus({ services }: PageProps) {

    return (
        <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System status</h2>
            <div className="space-y-6">
                {services.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                ))}
            </div>
        </section>
    )
}