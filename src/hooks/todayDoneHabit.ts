import { getHabits } from "@/Api/Api";
import type { Habit } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getLocalDateString } from "@/lib/utils";


export const useTodayDoneHabit = () => {
    const { data: habits } = useQuery<Habit[]>({ queryKey: ["habits"], queryFn: () => getHabits() });
    return habits?.filter((habit) => habit.successDays?.includes(getLocalDateString())).length || 0;
}