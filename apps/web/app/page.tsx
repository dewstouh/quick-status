import { StatusBanner } from "../components/StatusBanner";
import { SystemStatus } from "../components/SystemStatus";
import { getServices } from "../lib/data/getServices";
import { getBannerState } from "../lib/utils";

export default async function HomePage() {

  const services = await getServices();
  const banner = getBannerState(services);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QuickStatus</h1>
          <p className="text-gray-600 mt-2">Updated every 30 seconds</p>
        </header>

        <StatusBanner {...banner}/>
        <SystemStatus services={services}/>
      </div>
    </div>
  )
}