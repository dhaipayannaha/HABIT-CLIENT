import { Link } from "react-router"
import Container from "../../shared/Container"

import { useQuery } from "@tanstack/react-query"
import type { Habit } from "@/types/types"
import { getHabits } from "@/Api/Api"
import HabitItem from "./HabitItem"
import CompletedHabitItem from "./CompletedHabitItem"
import { getLocalDateString } from "@/lib/utils"
import { useReconcileHabits } from "@/hooks/useReconcileHabits"

const showContain = () => {
    const { data: habits, isLoading } = useQuery<Habit[]>({
        queryKey: ["habits"],
        queryFn: () => getHabits(),
    });

    useReconcileHabits(habits);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];
    const todayDate = getLocalDateString();

    const todayHabits = habits?.filter((habit) =>
        !habit.isDeleted && (
            habit.frequency?.toLowerCase() === "daily" ||
            habit.selectedDays?.includes(today) ||
            (habit.frequency && habit.frequency.includes(today))
        )
    ) || [];

    const pendingHabits = todayHabits.filter(habit => !habit.successDays.includes(todayDate));
    const completedHabits = todayHabits.filter(habit => habit.successDays.includes(todayDate));

    const progressPercentage = todayHabits.length > 0
        ? Math.round((completedHabits.length / todayHabits.length) * 100)
        : 0;

    if (isLoading) {
        return (
            <Container>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm border-white/5">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Daily Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Track and complete your habits for today, {today}.</p>
                    </div>
                    <Link to="/history" className="w-full md:w-auto text-center bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium transition-all backdrop-blur-sm border border-white/10">
                        View History
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Habit Lists */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Pending Habits */}
                        <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#121212] shadow-xl">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                    Today's Active Habits
                                </h2>
                                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                                    {pendingHabits.length} Pending
                                </span>
                            </div>
                            <div className="p-2 md:p-4">
                                {pendingHabits.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        {pendingHabits.map((habit, index) => (
                                            <HabitItem key={habit._id} habit={habit} index={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-4">
                                        <div className="text-4xl mb-4">✨</div>
                                        <h3 className="text-lg font-medium text-white">All caught up!</h3>
                                        <p className="text-muted-foreground">You've finished all your scheduled habits for now.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Completed Habits */}
                        {completedHabits.length > 0 && (
                            <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#121212] shadow-xl">
                                <div className="bg-emerald-600/20 border-b border-emerald-500/10 p-4 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Completed Today
                                    </h2>
                                    <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {completedHabits.length} Done
                                    </span>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {completedHabits.map((habit, index) => (
                                        <CompletedHabitItem key={habit._id} habit={habit} index={index} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats/Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-sm sticky top-8">
                            <h3 className="text-lg font-bold mb-6">Today's Progress</h3>

                            {/* Circular Progress (Simplified CSS version) */}
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-white/5">
                                    <div
                                        className="absolute inset-0 rounded-full border-8 border-emerald-500 transition-all duration-1000 ease-out"
                                        style={{
                                            clipPath: `inset(${100 - progressPercentage}% 0 0 0)`,
                                            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
                                        }}
                                    ></div>
                                    <span className="text-3xl font-black text-white">{progressPercentage}%</span>
                                </div>
                                <p className="mt-6 text-sm text-center text-muted-foreground">
                                    {completedHabits.length} of {todayHabits.length} habits completed today
                                </p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-sm font-medium">Points Earned</span>
                                    <span className="text-emerald-500 font-bold">+{completedHabits.length * 10}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-sm font-medium">Active Streak</span>
                                    <span className="text-amber-500 font-bold">5 Days</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                <span>Share Progress</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default showContain