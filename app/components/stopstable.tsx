import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react"
import { useNavigate } from "react-router"
import type { ScheduleLocation } from "~/api/requests/types.gen"
import { titleCase } from "~/utils/format"
import { TimeDisplay } from "./timedisplay"

interface StopsTableProps {
  locations: ScheduleLocation[]
  serviceDate?: string
}

export default function StopsTable({ locations, serviceDate }: StopsTableProps) {
  const navigate = useNavigate()

  const formatTime = (time?: string) => {
    if (!time) return "-"
    return time.substring(0, 5)
  }

  const handleStationClick = (location: ScheduleLocation) => {
    if (location.location.crs && serviceDate) {
      navigate(`/services?from=${location.location.crs}&date=${serviceDate}`)
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableHeadCell className="px-2 py-2 text-left">Station</TableHeadCell>
          <TableHeadCell className="px-2 py-2 text-center w-16">Platform</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-16 text-center">Booked Arrival</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-28 text-center">Actual Arrival</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-16 text-center">Booked Departure</TableHeadCell>
          <TableHeadCell className="px-2 py-2 w-28 text-center">Actual Departure</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y divide-gray-200">
          {locations.map((location) => (
            <TableRow
              key={location.id}
              className={`bg-white ${location.location.crs ? "hover:bg-gray-50 cursor-pointer" : ""}`}
              onClick={() => handleStationClick(location)}
            >
              <TableCell className="px-2 py-2 font-medium">
                {titleCase(
                  location.location.full_name || location.location.tiploc_codes?.[0] || "-"
                )}
              </TableCell>
              <TableCell className="px-2 py-2 text-center">{location.platform || ""}</TableCell>
              <TableCell className="px-2 py-2 w-16 text-center">
                {formatTime(location.public_arrival || location.arrival)}
              </TableCell>
              <TableCell className="px-2 py-2 w-28 text-center">
                <TimeDisplay
                  actualTime={location.actual_arrival}
                  bookedTime={location.public_arrival || location.arrival}
                />
              </TableCell>
              <TableCell className="px-2 py-2 w-16 text-center">
                {formatTime(location.public_departure || location.departure)}
              </TableCell>
              <TableCell className="px-2 py-2 w-28 text-center">
                <TimeDisplay
                  actualTime={location.actual_departure}
                  bookedTime={location.public_departure || location.departure}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
