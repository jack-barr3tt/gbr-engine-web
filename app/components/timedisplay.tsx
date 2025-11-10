interface TimeDisplayProps {
  actualTime?: string
  bookedTime?: string
}

export function TimeDisplay({ actualTime, bookedTime }: TimeDisplayProps) {
  if (!actualTime) return <span>-</span>

  if (!bookedTime) {
    return <span className="font-semibold text-green-600">{actualTime.substring(0, 5)}</span>
  }

  const [actualHours, actualMinutes] = actualTime.substring(0, 5).split(":").map(Number)
  const [bookedHours, bookedMinutes] = bookedTime.substring(0, 5).split(":").map(Number)

  const actualTotalMinutes = actualHours * 60 + actualMinutes
  const bookedTotalMinutes = bookedHours * 60 + bookedMinutes
  const delayMinutes = actualTotalMinutes - bookedTotalMinutes

  if (delayMinutes === 0) {
    return <span className="font-semibold text-green-600">{actualTime.substring(0, 5)}</span>
  } else if (delayMinutes > 0) {
    return (
      <span className="font-semibold text-red-600">
        {actualTime.substring(0, 5)} (+{delayMinutes})
      </span>
    )
  } else {
    return (
      <span className="font-semibold text-blue-600">
        {actualTime.substring(0, 5)} ({delayMinutes})
      </span>
    )
  }
}
