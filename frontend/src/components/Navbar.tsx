import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { MdLogin } from "react-icons/md";
import { Link } from "react-router-dom";
import { ModeToggle } from "./theme/ModeToggle";
import { Button } from "./ui/button";

export default function Navbar() {
	const { isSignedIn, user } = useUser();

	return (
		<nav className="flex items-center justify-between fixed w-full top-0 backdrop-blur-md bg-background/60 px-4 py-3 border-b z-30">
			<Link to="/" className="text-lg font-semibold">
				CN Event Management
			</Link>

			<div className="flex items-center space-x-4">
				<ul className="flex items-center space-x-4">
					<li className="hover:bg-accent p-4 rounded-md transition-all duration-200">
						<Link to="/">Home</Link>
					</li>
					<li className="hover:bg-accent p-4 rounded-md transition-all duration-200">
						<Link to="/events">Events</Link>
					</li>
					{isSignedIn && (
						<li>
							<Link
								to="/dashboard"
								className="hover:bg-accent p-4 rounded-md transition-all duration-200"
							>
								Dashboard
							</Link>
						</li>
					)}
				</ul>

				<div className="flex items-center space-x-2">
					{isSignedIn ? (
						<>
							<span className="text-sm">
								Welcome, {user?.firstName || user?.username}
							</span>
							<UserButton afterSignOutUrl="/" />
						</>
					) : (
						<SignInButton mode="modal">
							<Button className="p-5" variant="ghost" size="sm">
								<MdLogin className="mr-2 h-4 w-4" />
								Sign In
							</Button>
						</SignInButton>
					)}
				</div>

				<ModeToggle />
			</div>
		</nav>
	);
}
