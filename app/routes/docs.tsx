import { RedocStandalone } from "redoc"

export default function Docs() {
  return (
    <div className="h-full w-full mt-16">
      <RedocStandalone definitionUrl={import.meta.env.VITE_BACKEND_URL + "/schema"} />
    </div>
  )
}
