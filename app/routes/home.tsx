import type { Route } from "./+types/home"
import ServiceSearch from "~/components/servicesearch"

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
  return (
    <div className="flex flex-col md:flex-row px-8 md:py-16 pt-4">
      <div className="md:w-1/3 -mx-12 md:mx-0 flex-1">
        <ServiceSearch />
      </div>

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
