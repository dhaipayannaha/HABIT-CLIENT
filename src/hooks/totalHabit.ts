import { getHabits } from "@/Api/Api";
import type { Habit } from "@/types/types";
import { useQuery } from "@tanstack/react-query";


export const useTotalHabit = () => {
    const { data: habits } = useQuery<Habit[]>({ queryKey: ["habits"], queryFn: () => getHabits() });
    return habits?.filter((habit) => !habit.isDeleted).length || 0;
}