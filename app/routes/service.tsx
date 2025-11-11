import { useNavigate, useLoaderData } from "react-router"
import type { Route } from "./+types/service"
import { Card, Button } from "flowbite-react"
import { FaArrowLeft } from "react-icons/fa"
import { getService } from "~/api/requests"
import StopsTable from "~/components/stopstable"

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const date = url.searchParams.get("date")
  const uid = url.searchParams.get("uid")

  if (!id && !uid) {
    throw new Response("Must provide either 'id' or 'uid' parameter", { status: 400 })
  }

  if (id && !date) {
    throw new Response("When using 'id' parameter, 'date' parameter is required", { status: 400 })
  }

  try {
    const { data, error } = await getService({
      baseUrl: process.env.VITE_BACKEND_URL,
      query: {
        id: id ? parseInt(id) : undefined,
        date: date || undefined,
        uid: uid || undefined,
      },
    })

    if (error || !data) {
      throw new Response("Service not found", { status: 404 })
    }

    return { service: data, date }
  } catch (err) {
    throw new Response("Failed to load service", { status: 500 })
  }
}

export default function ServiceDetail() {
  const { service, date } = useLoaderData<typeof loader>()

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex gap-4 w-full max-w-7xl">
          {/* Left card - Service info */}
          <Card className="w-80 shrink-0">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Train UID</div>
                <div className="font-medium">{service.train_uid}</div>
              </div>
              {service.operator && (
                <div>
                  <div className="text-sm text-gray-500">Operator</div>
                  <div className="font-medium">{service.operator.name}</div>
                </div>
              )}
              {service.train_category && (
                <div>
                  <div className="text-sm text-gray-500">Train Category</div>
                  <div className="font-medium">{service.train_category}</div>
                </div>
              )}
              {service.train_status && (
                <div>
                  <div className="text-sm text-gray-500">Train Status</div>
                  <div className="font-medium">{service.train_status}</div>
                </div>
              )}
              {service.schedule_start_date && service.schedule_end_date && (
                <div>
                  <div className="text-sm text-gray-500">Operating Period</div>
                  <div className="font-medium">
                    {new Date(service.schedule_start_date).toLocaleDateString()} -{" "}
                    {new Date(service.schedule_end_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {service.schedule_days_runs && (
                <div>
                  <div className="text-sm text-gray-500">Days Running</div>
                  <div className="font-medium text-xs">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <span
                        key={day}
                        className={
                          service.schedule_days_runs![i] === "1"
                            ? "text-green-600"
                            : "text-gray-300"
                        }
                      >
                        {day}{" "}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {service.trust_id && (
                <div>
                  <div className="text-sm text-gray-500">TRUST ID</div>
                  <div className="font-medium">{service.trust_id}</div>
                </div>
              )}
              {service.activation_time && (
                <div>
                  <div className="text-sm text-gray-500">Activation Time</div>
                  <div className="font-medium">
                    {new Date(service.activation_time).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Right card - Stops table */}
          <Card className="flex-1">
            <StopsTable locations={service.locations || []} serviceDate={date || undefined} />
          </Card>
        </div>
      </div>
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate()

  let message = "Error"
  let details = "An error occurred while loading the service"

  if (error instanceof Response) {
    message = error.status === 404 ? "Service Not Found" : `Error ${error.status}`
    details = error.statusText || details
  } else if (error instanceof Error) {
    details = error.message
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">{message}</h1>
        <p className="text-gray-600 mt-2">{details}</p>
      </div>
      <Button color="gray" onClick={() => navigate(-1)}>
        <FaArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
    </div>
  )
}
