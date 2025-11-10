import { createContext, useContext, useState, useCallback, useMemo } from "react"
import type { ReactNode } from "react"

type SpeedEntry = {
  speed: number
  time: number
}

type NetworkMonitorContextType = {
  speed: number
}

const NetworkMonitorContext = createContext<NetworkMonitorContextType | null>(null)

type NetworkMonitorProviderProps = {
  children: ReactNode
}

// Global state for speed entries
let speedEntries: SpeedEntry[] = []
let listeners: Set<() => void> = new Set()

// Expose speedEntries globally for other modules
;(globalThis as any).speedEntries = speedEntries

// Regular function to add speed - can be called from anywhere
export function addSpeed(speed: number) {
  const newEntry: SpeedEntry = {
    speed,
    time: Date.now(),
  }
  // Keep only the last 5 entries
  speedEntries = [...speedEntries, newEntry].slice(-5)
  // Update global reference
  ;(globalThis as any).speedEntries = speedEntries

  // Notify all listeners
  listeners.forEach((listener) => listener())
}

function calculateAverageSpeed(): number {
  if (speedEntries.length === 0) return 0

  const sum = speedEntries.reduce((acc, entry) => acc + entry.speed, 0)
  return sum / speedEntries.length
}

export function NetworkMonitorProvider({ children }: NetworkMonitorProviderProps) {
  const [speed, setSpeed] = useState<number>(calculateAverageSpeed())

  const updateSpeed = useCallback(() => {
    setSpeed(calculateAverageSpeed())
  }, [])

  // Subscribe to changes
  useMemo(() => {
    listeners.add(updateSpeed)
    return () => {
      listeners.delete(updateSpeed)
    }
  }, [updateSpeed])

  return (
    <NetworkMonitorContext.Provider value={{ speed }}>{children}</NetworkMonitorContext.Provider>
  )
}

export function useNetworkMonitor() {
  const context = useContext(NetworkMonitorContext)
  if (!context) {
    throw new Error("useNetworkMonitor must be used within a NetworkMonitorProvider")
  }
  return context
}
