import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react"
import { useNavigate } from "react-router"
import type { ServiceResponse } from "~/api/requests/types.gen"
import { titleCase } from "~/utils/format"
import { TimeDisplay } from "./timedisplay"

interface ServiceTableProps {
  services: ServiceResponse[]
  searchedCrs?: string | null
  searchedDate?: string | null
  pendingCount?: number
}

export default function ServiceTable({
  services,
  searchedCrs,
  searchedDate,
  pendingCount = 0,
}: ServiceTableProps) {
  const navigate = useNavigate()

  const formatTime = (time?: string) => {
    if (!time) return "-"
    // Extract just the time portion (HH:MM)
    return time.substring(0, 5)
  }

  const getOrigin = (service: ServiceResponse) => {
    const origin = service.locations.find((loc) => loc.location_order === 1)
    const name = origin?.location.full_name || origin?.location.crs || "-"
    return name === "-" ? name : titleCase(name)
  }

  const getDestination = (service: ServiceResponse) => {
    const destination = service.locations[service.locations.length - 1]
    const name = destination?.location.full_name || destination?.location.crs || "-"
    return name === "-" ? name : titleCase(name)
  }

  const getSearchedLocation = (service: ServiceResponse) => {
    if (!searchedCrs) {
      // Fallback to first location if no search CRS provided
      return service.locations[0]
    }
    // Find the location matching the searched station
    const found = service.locations.find(
      (loc) => loc.location.crs?.toUpperCase() === searchedCrs.toUpperCase()
    )

    return found || service.locations[0]
  }

  const handleRowClick = (service: ServiceResponse) => {
    if (searchedDate) {
      navigate(`/service?id=${service.id}&date=${searchedDate}`)
    }
  }

  const getServiceStatus = (service: ServiceResponse) => {
    const origin = service.locations.find((loc) => loc.location_order === 1)
    const hasDepartedOrigin = !!origin?.actual_departure

    const isActivated = !!service.trust_id

    if (hasDepartedOrigin) {
      return "departed"
    } else if (isActivated) {
      return "activated"
    }
    return "scheduled"
  }

  const getStatusBorderClass = (status: string) => {
    switch (status) {
      case "departed":
        return "border-l-4 border-l-green-500"
      case "activated":
        return "border-l-4 border-l-yellow-300"
      default:
        return ""
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableHeadCell className="px-2 py-2 w-16 text-center">ID</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-16 text-center">Booked Arrival</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-28 text-center">Actual Arrival</TableHeadCell>
          <TableHeadCell className="px-2 py-2">Origin</TableHeadCell>
          <TableHeadCell className="px-2 py-2">Destination</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-16 text-center">Booked Departure</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-28 text-center">Actual Departure</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y divide-gray-200">
          {services.map((service) => {
            const searchedLocation = getSearchedLocation(service)
            const status = getServiceStatus(service)
            const borderClass = getStatusBorderClass(status)
            return (
              <TableRow
                key={service.id}
                className={`bg-white hover:bg-gray-50 cursor-pointer ${borderClass}`}
                onClick={() => handleRowClick(service)}
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 px-2 py-2 text-center">
                  {service.signalling_id}
                </TableCell>
                <TableCell className="px-2 py-2 w-16 text-center">
                  {formatTime(searchedLocation?.public_arrival || searchedLocation?.arrival)}
                </TableCell>
                <TableCell className="px-2 py-2 w-28">
                  <TimeDisplay
                    actualTime={searchedLocation?.actual_arrival}
                    bookedTime={searchedLocation?.public_arrival || searchedLocation?.arrival}
                  />
                </TableCell>
                <TableCell className="px-2 py-2">{getOrigin(service)}</TableCell>
                <TableCell className="px-2 py-2">{getDestination(service)}</TableCell>
                <TableCell className="px-2 py-2 w-16 text-center">
                  {formatTime(searchedLocation?.public_departure || searchedLocation?.departure)}
                </TableCell>
                <TableCell className="px-2 py-2 w-28">
                  <TimeDisplay
                    actualTime={searchedLocation?.actual_departure}
                    bookedTime={searchedLocation?.public_departure || searchedLocation?.departure}
                  />
                </TableCell>
              </TableRow>
            )
          })}
          {/* Skeleton rows for pending results */}
          {pendingCount > 0 &&
            Array.from({ length: pendingCount }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="bg-white animate-pulse">
                <TableCell className="px-2 py-2 text-center">
                  <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                </TableCell>
                <TableCell className="px-2 py-2 w-16 text-center">
                  <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
                </TableCell>
                <TableCell className="px-2 py-2 w-28">
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                </TableCell>
                <TableCell className="px-2 py-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </TableCell>
                <TableCell className="px-2 py-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </TableCell>
                <TableCell className="px-2 py-2 w-16 text-center">
                  <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
                </TableCell>
                <TableCell className="px-2 py-2 w-28">
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
