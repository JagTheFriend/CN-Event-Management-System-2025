import { Link } from "react-router-dom";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { ModeToggle } from "./theme/ModeToggle";
import { Button } from "./ui/button";
import { MdLogin, MdPersonAdd } from "react-icons/md";

export default function Navbar() {
    const { isSignedIn, user } = useUser();

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
                    {isSignedIn && (
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    )}
                </ul>

                <div className="flex items-center space-x-2">
                    {isSignedIn ? (
                        <>
                            <span className="text-sm">Welcome, {user?.firstName || user?.username}</span>
                            <UserButton afterSignOutUrl="/" />
                        </>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">
                                    <MdLogin className="mr-2 h-4 w-4" />
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button size="sm">
                                    <MdPersonAdd className="mr-2 h-4 w-4" />
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </>
                    )}
                </div>

                <ModeToggle />
            </div>
        </nav>
    )
}
