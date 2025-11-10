import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("docs", "routes/docs.tsx"),
  route("services", "routes/services.tsx"),
] satisfies RouteConfig
