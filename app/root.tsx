import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import type { Route } from "./+types/root"
import "./app.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { client } from "./api/requests"
import NavBar from "./components/navbar"
import { ThemeInit } from "../.flowbite-react/init"
import { createTheme, ThemeProvider } from "flowbite-react"
import { NetworkMonitorProvider, addSpeed } from "./hooks/networkmonitor"

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
]

const queryClient = new QueryClient()
client.setConfig({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  throwOnError: true,
})

client.instance.interceptors.request.use((config) => {
  ;(config as any).startTime = Date.now()
  return config
})

client.instance.interceptors.response.use((response) => {
  const endTime = Date.now()
  const startTime = (response.config as any).startTime

  if (startTime) {
    const duration = endTime - startTime
    const contentLength = response.headers["content-length"]

    if (contentLength) {
      const bytes = parseInt("" + contentLength, 10)
      const kilobytes = bytes / 1024
      const seconds = duration / 1000
      const speed = kilobytes / seconds

      addSpeed(speed)
    }
  }

  return response
})

const customTheme = createTheme({
  card: {
    root: {
      base: "border-none shadow-md/5 h-fit",
      children: "p-4",
    },
  },
  button: {
    color: {
      orange: "bg-orange-500 hover:bg-orange-600 text-white",
    },
  },
})

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="p-4 bg-linear-to-br from-orange-50 to-violet-100 h-screen w-screen"
        suppressHydrationWarning
      >
        <ThemeProvider theme={customTheme}>
          <ThemeInit />
          <NavBar />
          <NetworkMonitorProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </NetworkMonitorProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
