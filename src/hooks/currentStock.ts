import { getHabits } from "@/Api/Api";
import { getLocalDateString } from "@/lib/utils";
import type { Habit } from "@/types/types";
import { useQuery } from "@tanstack/react-query";


export const useCurrentStock = () => {
    const { data: habits } = useQuery<Habit[]>({ queryKey: ["habits"], queryFn: () => getHabits() });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];
    const todayDate = getLocalDateString();

    const pendingHabits = habits?.filter((habit) =>
        !habit.isDeleted && (
            habit.frequency?.toLowerCase() === "daily" ||
            habit.selectedDays?.includes(today) ||
            (habit.frequency && habit.frequency.includes(today))
        ) && !habit.successDays?.includes(todayDate)
    ) || [];

    return pendingHabits.length;
}