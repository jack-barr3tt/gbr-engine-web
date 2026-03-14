import { RedocStandalone } from "redoc"
import { useLoaderData } from "react-router"
import { getBackendUrl } from "~/config"

export function meta() {
  return [{ title: "API Docs" }]
}

export async function loader() {
  return { schemaUrl: `${getBackendUrl()}/schema` }
}

export default function Docs() {
  const { schemaUrl } = useLoaderData<typeof loader>()
  return (
    <div className="h-full w-full mt-16">
      <RedocStandalone definitionUrl={schemaUrl} />
    </div>
  )
}
