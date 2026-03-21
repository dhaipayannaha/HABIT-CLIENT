import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../components/sections/Home";
import AddHabit from "../components/sections/AddHabit";
import History from "@/components/sections/History";
import HabitDetail from "@/components/sections/HabitDetail";
import EditHabit from "@/components/sections/EditHabit";

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayouts,
        children: [
            {
                path: "/",
                Component: Home,
            },
            {
                path: "add-habit",
                Component: AddHabit,
            },
            {
                path: "history",
                Component: History,
            },
            {
                path: "habits/:id",
                Component: HabitDetail,
            },
            {
                path: "edit-habit/:id",
                Component: EditHabit,
            }
        ],  
    },
])  

export default router