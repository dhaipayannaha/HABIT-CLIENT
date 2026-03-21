import { useQuery } from "@tanstack/react-query";
import { getHabits } from "@/Api/Api";
import type { Habit } from "@/types/types";

export const manageExpairy = (id: string) => {

    const { data: habits } = useQuery<Habit[]>({
        queryKey: ["habits"],
        queryFn: () => getHabits(),
    });

    let expiry: number | null = null;

    const habit = habits?.find((item: Habit) => item._id === id);
    const habitDuration: number = Number(habit?.howManyDays);
    const habitCreatedAt: number = habit?.createdAt ? new Date(habit.createdAt).getTime() : Date.now();

    if (habitDuration && !isNaN(habitDuration)) {
        expiry = habitCreatedAt + (Number(habitDuration) - 1) * 24 * 60 * 60 * 1000;
    }

    if (expiry === null) return "N/A";

    const ms = expiry;
    const d = new Date(ms);

    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const dayIs = d.getDate();

    const exparyDate = `${y}-${m}-${dayIs}`;

    return exparyDate
}