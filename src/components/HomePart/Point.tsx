import Container from "../../shared/Container"
import { useTotalHabit } from "@/hooks/totalHabit"
import { useTodayDoneHabit } from "@/hooks/todayDoneHabit"
import { useCurrentStock } from "@/hooks/currentStock"
import { useNextDayStock } from "@/hooks/nextDayStock"

const Point = () => {
    const totalHabitCount = useTotalHabit();
    const todayDoneHabitCount = useTodayDoneHabit();
    const currentStock = useCurrentStock();
    const nextDayStock = useNextDayStock();


    return (
        <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                <div className="bg-card text-card-foreground border p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Habits</p>
                    <h2 className="text-3xl font-bold mt-2">{totalHabitCount}</h2>
                </div>
                <div className="bg-card text-card-foreground border p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Today Done</p>
                    <h2 className="text-3xl font-bold mt-2">{todayDoneHabitCount}</h2>
                </div>
                <div className="bg-card text-card-foreground border p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <h2 className="text-3xl font-bold mt-2">{currentStock}</h2>
                </div>
                <div className="bg-card text-card-foreground border p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Next Day Streak</p>
                    <h2 className="text-3xl font-bold mt-2">{nextDayStock}</h2>
                </div>
            </div>
        </Container>
    )
}

export default Point