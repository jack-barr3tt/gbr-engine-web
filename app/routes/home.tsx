import { Button, Card, Label } from "flowbite-react"
import type { Route } from "./+types/home"
import { FiArrowRight } from "react-icons/fi"
import { useState } from "react"
import StationSelect from "~/components/stationselect"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    {
      name: "description",
      content:
        "Rail Engine combines open data feeds and advanced algorithms to provide real-time train information and unique insights to railway enthusiasts and trainspotters.",
    },
  ]
}

export default function Home() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  return (
    <div className="flex flex-col md:flex-row px-8 md:py-16 pt-4">
      <Card className="flex md:w-1/3 -mx-12 md:mx-0 flex-1">
        <h1 className="font-semibold text-2xl">Search</h1>

        <form className="flex flex-col gap-2">
          <Label htmlFor="origin" className="mt-2">
            Origin
          </Label>
          <StationSelect value={from} onValueChange={setFrom} id="origin" />
          <Label htmlFor="destination" className="mt-2">
            Destination
          </Label>
          <StationSelect value={to} onValueChange={setTo} id="destination" />
          <Button className="mt-2">
            Go <FiArrowRight className="ml-2" />
          </Button>
        </form>
      </Card>

      <div className="pt-8 md:p-8 flex items-center flex-col justify-center flex-1">
        <div className="flex-col flex gap-4">
          <h1 className="text-3xl md:text-5xl p-2 font-extrabold bg-linear-to-br text-center from-orange-400 to-orange-500 bg-clip-text text-transparent">
            The new standard in <br />
            UK railway insights
          </h1>
          <p className="text-center">
            Rail Engine doesn't just rely on public data feeds, <br />
            it uses advanced algorithms to fill knowledge gaps.
          </p>
        </div>
      </div>
    </div>
  )
}
