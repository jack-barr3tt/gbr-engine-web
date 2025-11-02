import React, { useState, type Dispatch, type SetStateAction } from "react"
import SearchSelect from "./searchselect"
import { useGetLocations } from "~/api/queries"
import { titleCase } from "~/utils/format"

type StationSelectProps = {
  id?: string
  value: string
  onValueChange: Dispatch<SetStateAction<string>>
}
export default function StationSelect(props: StationSelectProps) {
  const { value, onValueChange, id } = props

  const { data: stations, isLoading } = useGetLocations()

  return (
    <SearchSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      loading={isLoading}
      options={
        stations
          ? stations
              .filter((station) => station.full_name)
              .sort((a, b) => a.full_name!.localeCompare(b.full_name!))
              .filter(
                (station) =>
                  value.length === 0 ||
                  station.full_name!.toLowerCase().startsWith(value.toLowerCase()) ||
                  station.crs?.toLowerCase().startsWith(value.toLowerCase())
              )
              .sort(
                (a, b) =>
                  (value.length === 3 ? a.crs?.localeCompare(b.crs || "") || 0 : 0) +
                  a.full_name!.localeCompare(b.full_name!)
              )
              .filter((_, i) => i < 10)
              .map((station) => ({
                value: titleCase(station.full_name!),
                label: titleCase(station.full_name!),
              }))
          : []
      }
    />
  )
}
