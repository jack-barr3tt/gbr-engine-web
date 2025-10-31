import type { Route } from "./+types/home"

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home" }, { name: "description", content: "Welcome to Rail Engine!" }]
}

export default function Home() {
  return (
    <div>
      <h1>Rail Engine</h1>
    </div>
  )
}
