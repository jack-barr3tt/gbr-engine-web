import type { Dispatch, SetStateAction } from "react"
import SearchSelect from "./searchselect"
import { useGetLocations } from "~/api/queries"
import { titleCase } from "~/utils/format"
import type { Location } from "~/api/requests/types.gen"

type StationSelectProps = {
  id?: string
  value: string
  onValueChange: Dispatch<SetStateAction<string>>
}
export default function StationSelect(props: StationSelectProps) {
  const { value, onValueChange, id } = props

  const { data: stations, isLoading } = useGetLocations()

  const handleBlur = () => {
    if (!stations || !value) return

    const station = stations.find(
      (loc: Location) =>
        loc.full_name?.toLowerCase() === value.toLowerCase() ||
        loc.crs?.toLowerCase() === value.toLowerCase()
    )

    if (station?.full_name) {
      onValueChange(titleCase(station.full_name))
    }
  }

  return (
    <SearchSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      onBlur={handleBlur}
      loading={isLoading}
      options={
        stations
          ? stations
              .filter((station: Location) => station.full_name)
              .sort((a: Location, b: Location) => a.full_name!.localeCompare(b.full_name!))
              .filter(
                (station: Location) =>
                  value.length === 0 ||
                  station.full_name!.toLowerCase().startsWith(value.toLowerCase()) ||
                  station.crs?.toLowerCase().startsWith(value.toLowerCase())
              )
              .sort(
                (a: Location, b: Location) =>
                  (value.length === 3 ? a.crs?.localeCompare(b.crs || "") || 0 : 0) +
                  a.full_name!.localeCompare(b.full_name!)
              )
              .filter((_: Location, i: number) => i < 10)
              .map((station: Location) => ({
                value: titleCase(station.full_name!),
                label: titleCase(station.full_name!),
              }))
          : []
      }
    />
  )
}
