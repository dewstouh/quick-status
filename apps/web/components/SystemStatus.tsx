import { ServiceStatus } from '../actions/getServices'
import { ServiceCard } from './ServiceCard'

interface PageProps {
    servicesPromise: Promise<ServiceStatus[]>
}

export async function SystemStatus({ servicesPromise }: PageProps) {

    const services = await servicesPromise;
    console.log(services)

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