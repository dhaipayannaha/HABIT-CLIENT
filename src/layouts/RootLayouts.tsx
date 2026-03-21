import Navbar from "../shared/Navbar"
import Footer from "../shared/Footer"
import { Outlet } from "react-router"

const RootLayouts = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default RootLayouts