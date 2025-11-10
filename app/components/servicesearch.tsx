import { Button, Card, Label, Datepicker } from "flowbite-react"
import { FiArrowRight } from "react-icons/fi"
import { useState, useEffect } from "react"
import StationSelect from "./stationselect"
import { useNavigate } from "react-router"
import { useGetLocations } from "~/api/queries"
import { useQueryClient } from "@tanstack/react-query"
import { queryServices } from "~/api/requests"
import type { Location } from "~/api/requests/types.gen"

type ServiceSearchProps = {
  initialFrom?: string
  initialTo?: string
  initialDate?: string
}

export default function ServiceSearch({
  initialFrom = "",
  initialTo = "",
  initialDate = new Date().toISOString().split("T")[0],
}: ServiceSearchProps) {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [date, setDate] = useState<Date>(new Date(initialDate))
  const navigate = useNavigate()
  const { data: locations } = useGetLocations()
  const queryClient = useQueryClient()

  useEffect(() => {
    setFrom(initialFrom)
    setTo(initialTo)
    setDate(new Date(initialDate))
  }, [initialFrom, initialTo, initialDate])

  useEffect(() => {
    if (!locations || !from) return

    const fromStation = locations.find(
      (loc: Location) =>
        loc.full_name?.toLowerCase() === from.toLowerCase() ||
        loc.crs?.toLowerCase() === from.toLowerCase()
    )
    const toStation = to
      ? locations.find(
          (loc: Location) =>
            loc.full_name?.toLowerCase() === to.toLowerCase() ||
            loc.crs?.toLowerCase() === to.toLowerCase()
        )
      : null

    if (fromStation?.crs) {
      const dateStr = date.toISOString().split("T")[0]

      const passes_through: Array<{
        location_filter?: { crs?: string }
        time_from?: string
        time_to?: string
      }> = [
        {
          location_filter: {
            crs: fromStation.crs,
          },
          time_from: `${dateStr}T00:00:00Z`,
          time_to: `${dateStr}T23:59:59Z`,
        },
      ]

      if (toStation?.crs) {
        passes_through.push({
          location_filter: {
            crs: toStation.crs,
          },
        })
      }

      queryClient.prefetchQuery({
        queryKey: ["services", fromStation.crs, toStation?.crs || null, dateStr],
        queryFn: async () => {
          const { data } = await queryServices({
            body: {
              passes_through,
              limit: 5,
            },
          })
          return data
        },
      })
    }
  }, [from, to, date, locations, queryClient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fromStation = locations?.find(
      (loc: Location) =>
        loc.full_name?.toLowerCase() === from.toLowerCase() ||
        loc.crs?.toLowerCase() === from.toLowerCase()
    )
    const toStation = to
      ? locations?.find(
          (loc: Location) =>
            loc.full_name?.toLowerCase() === to.toLowerCase() ||
            loc.crs?.toLowerCase() === to.toLowerCase()
        )
      : null

    if (fromStation?.crs) {
      const dateStr = date.toISOString().split("T")[0]
      const params = new URLSearchParams({ from: fromStation.crs, date: dateStr })
      if (toStation?.crs) {
        params.set("to", toStation.crs)
      }
      navigate(`/services?${params.toString()}`)
    }
  }

  return (
    <Card className="flex">
      <h1 className="font-semibold text-2xl">Search</h1>

      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <Label htmlFor="origin" className="mt-2">
          Origin
        </Label>
        <StationSelect value={from} onValueChange={setFrom} id="origin" />
        <Label htmlFor="destination" className="mt-2">
          Destination
        </Label>
        <StationSelect value={to} onValueChange={setTo} id="destination" />
        <Label htmlFor="date" className="mt-2">
          Date
        </Label>
        <Datepicker value={date} onChange={(newDate) => newDate && setDate(newDate)} />
        <Button type="submit" className="mt-2">
          Go <FiArrowRight className="ml-2" />
        </Button>
      </form>
    </Card>
  )
}
