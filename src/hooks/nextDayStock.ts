import { getHabits } from "@/Api/Api";
import type { Habit } from "@/types/types";
import { useQuery } from "@tanstack/react-query";


export const useNextDayStock = () => {
    const { data: habits } = useQuery<Habit[]>({ queryKey: ["habits"], queryFn: () => getHabits() });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDay = days[tomorrowDate.getDay()];

    const nextDayHabits = habits?.filter((habit) =>
        !habit.isDeleted && (
            habit.frequency?.toLowerCase() === "daily" ||
            habit.selectedDays?.includes(tomorrowDay) ||
            (habit.frequency && habit.frequency.includes(tomorrowDay))
        )
    ) || [];

    return nextDayHabits.length;
}