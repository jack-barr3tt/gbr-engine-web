import { Button } from "flowbite-react"
import { Link } from "react-router"
import { FaGithub } from "react-icons/fa"

export default function NavBar() {
  return (
    <div className="flex flex-row items-center h-8 gap-4 px-8">
      <Link to="/">
        <h1 className="font-bold text-2xl mr-8 text-orange-500">Rail Engine</h1>
      </Link>

      {/* Navigation buttons */}
      <Link to="/docs">
        <Button pill color="orange">
          API
        </Button>
      </Link>
      <Link to="https://github.com/jack-barr3tt/gbr-engine">
        <Button pill color="orange">
          <FaGithub />
        </Button>
      </Link>
    </div>
  )
}
