import { Link } from "react-router"
import Container from "./Container"

const Navbar = () => {
    return (
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container className="py-4">
                <ul className="flex justify-between items-center">
                    <li>
                        <Link to="/" className="text-xl font-bold tracking-tight">Habit Tracker</Link>
                    </li>
                    <li className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                        <Link to="/add-habit">Add Habit</Link>
                    </li>
                </ul>
            </Container>
        </div>
    )
}

export default Navbar         