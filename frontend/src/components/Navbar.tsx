import { Link } from "react-router-dom";
import { ModeToggle } from "./theme/ModeToggle";
import { Button } from "./ui/button"
import { MdLogin } from "react-icons/md";

export default function Navbar() {
    return (
        <nav className='flex items-center justify-between fixed w-full top-0 backdrop-blur-md bg-background/60 px-4 py-3 border-b z-30'>
            <Link to="/" className="text-lg font-semibold">CN Event Management</Link>

            <div className="flex items-center space-x-4">
                <ul className="flex items-center space-x-4">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/events">Events</Link>
                    </li>
                    <li>
                        <Button className="cursor-pointer"><MdLogin /> Sign In</Button>
                    </li>
                </ul>

                <ModeToggle />
            </div>
        </nav>
    )
}
