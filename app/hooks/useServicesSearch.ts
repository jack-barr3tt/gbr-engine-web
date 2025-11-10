import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryServices, QueryServicesData, QueryServicesResponse } from "~/api/requests"
import type { ServiceQueryResponse } from "~/api/requests/types.gen"
import { useEffect, useState, useRef } from "react"

function getAverageSpeed(): number {
  const speedEntries = (globalThis as any).speedEntries || []
  if (speedEntries.length === 0) return 1000 // Default to 1000 KB/s if no data

  const sum = speedEntries.reduce((acc: number, entry: any) => acc + entry.speed, 0)
  return sum / speedEntries.length
}

export const useServicesSearch = (
  from?: string | null,
  to?: string | null,
  date?: string | null
) => {
  const queryClient = useQueryClient()
  const [pendingCount, setPendingCount] = useState(0)
  const fetchingRef = useRef(false)
  const queryKeyRef = useRef<string>("")

  const query = useQuery({
    queryKey: ["services", from, to || null, date || null],
    queryFn: async () => {
      const newQueryKey = JSON.stringify(["services", from, to || null, date || null])
      if (queryKeyRef.current !== newQueryKey) {
        fetchingRef.current = false
        queryKeyRef.current = newQueryKey
      }

      const cachedData = queryClient.getQueryData<ServiceQueryResponse>([
        "services",
        from,
        to || null,
        date || null,
      ])
      if (cachedData && cachedData.services && cachedData.services.length > 0) {
        return cachedData
      }

      const dateStr = date || new Date().toISOString().split("T")[0]

      const passes_through: Array<{
        location_filter?: { crs?: string }
        time_from?: string
        time_to?: string
      }> = [
        {
          location_filter: {
            crs: from!,
          },
          time_from: `${dateStr}T00:00:00Z`,
          time_to: `${dateStr}T23:59:59Z`,
        },
      ]

      if (to) {
        passes_through.push({
          location_filter: {
            crs: to,
          },
        })
      }

      // First request: Get first 5 results to check total
      const { data: firstPage } = await queryServices({
        body: {
          passes_through,
          limit: 5,
        },
      })

      if (!firstPage || !firstPage.services || firstPage.services.length === 0) {
        setPendingCount(0)
        return firstPage
      }

      const totalResults = firstPage.pagination?.total_results || 0

      // If we got all results already, return them
      if (totalResults <= 5) {
        setPendingCount(0)
        return firstPage
      }

      // Set initial pending count
      setPendingCount(totalResults - 5)

      // Return initial results immediately
      return firstPage
    },
    enabled: !!from,
  })

  // Fetch remaining pages when initial data is loaded
  useEffect(() => {
    if (!query.data || !from) return

    const totalResults = query.data.pagination?.total_results || 0
    const currentCount = query.data.services?.length || 0

    // If we already have all results, nothing to do
    if (currentCount >= totalResults) {
      setPendingCount(0)
      fetchingRef.current = false
      return
    }

    // Only set pending count and fetch if we haven't started yet
    // This prevents showing skeletons on refetch when we already have data
    if (fetchingRef.current) return

    // Set pending count immediately when data is available
    setPendingCount(totalResults - currentCount)

    // Mark that we've started fetching
    fetchingRef.current = true

    let cancelled = false

    // Fetch remaining pages
    const fetchRemainingPages = async () => {
      const dateStr = date || new Date().toISOString().split("T")[0]

      const passes_through: Array<{
        location_filter?: { crs?: string }
        time_from?: string
        time_to?: string
      }> = [
        {
          location_filter: {
            crs: from,
          },
          time_from: `${dateStr}T00:00:00Z`,
          time_to: `${dateStr}T23:59:59Z`,
        },
      ]

      if (to) {
        passes_through.push({
          location_filter: {
            crs: to,
          },
        })
      }

      // Calculate optimal page size for ~1 second requests
      const averageSpeed = getAverageSpeed() // KB/s
      const serviceSize = 60 // KB per service (assumption)
      const targetDuration = 1
      const optimalPageSize = Math.min(
        50,
        Math.max(5, Math.floor((averageSpeed * targetDuration) / serviceSize))
      )

      const allServices = [...(query.data?.services || [])]
      let offset = currentCount

      while (offset < totalResults && !cancelled) {
        const { data: nextPage } = await queryServices({
          body: {
            passes_through,
            limit: optimalPageSize,
            offset,
          },
        })

        if (cancelled) break

        if (nextPage?.services && nextPage.services.length > 0) {
          allServices.push(...nextPage.services)

          // Update the cache with new results
          const updatedResult: ServiceQueryResponse = {
            services: allServices,
            pagination: {
              limit: allServices.length,
              offset: 0,
              total_results: totalResults,
              returned: allServices.length,
            },
          }

          queryClient.setQueryData(["services", from, to || null, date || null], updatedResult)
          if (!cancelled) {
            setPendingCount(totalResults - allServices.length)
          }
        }

        offset += optimalPageSize
      }

      if (!cancelled) {
        setPendingCount(0)
      }
    }

    fetchRemainingPages()

    return () => {
      cancelled = true
      fetchingRef.current = false
    }
  }, [query.data, from, to, date, queryClient])

  return {
    ...query,
    pendingCount,
  }
}
