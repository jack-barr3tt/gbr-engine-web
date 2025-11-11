import { useSearchParams } from "react-router"
import { Card } from "flowbite-react"
import { useServicesSearch } from "~/hooks/useServicesSearch"
import ServiceSearch from "~/components/servicesearch"
import ServiceTable from "~/components/servicetable"

export default function Services() {
  const [searchParams] = useSearchParams()
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const date = searchParams.get("date")

  const { data, isPending, pendingCount } = useServicesSearch(from, to, date)

  return (
    <div className="flex flex-col md:flex-row px-8 py-8 gap-4 justify-center">
      <div className="md:w-1/3 lg:w-1/4 md:max-w-sm">
        <ServiceSearch
          initialFrom={from || ""}
          initialTo={to || ""}
          initialDate={date || undefined}
        />
      </div>

      <div className="flex-1 max-w-5xl">
        <Card>
          {isPending && <p className="mt-4">Searching for services...</p>}

          {data && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Found {data.pagination?.total_results || 0}{" "}
                {data.pagination?.total_results === 1 ? "service" : "services"}
              </p>
              {data.services && data.services.length > 0 ? (
                <ServiceTable
                  services={data.services}
                  searchedCrs={from}
                  searchedDate={date}
                  pendingCount={pendingCount}
                />
              ) : (
                <p className="text-gray-500">No services found.</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
