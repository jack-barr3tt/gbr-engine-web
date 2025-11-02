import { Button } from "flowbite-react"
import { Link } from "react-router"

export default function NavBar() {
  return (
    <div className="flex flex-row items-center h-8 gap-4 px-8">
      <Link to="/">
        <h1 className="font-bold text-2xl mr-8 text-orange-500">Rail Engine</h1>
      </Link>

      {/* Navigation buttons */}
      {/* <Button pill>Home</Button> */}
    </div>
  )
}
