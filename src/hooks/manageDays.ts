import { getHabits } from "@/Api/Api";
import type { Habit } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { manageExpairy } from "./manageExpairy";



export const manageDays = (id: string) => {

    const { data: habit } = useQuery<Habit[]>({ queryKey: ["habits"], queryFn: () => getHabits() });

    const exparyDate = manageExpairy(id);
    const findData = habit?.find((item: Habit) => item._id === id);

    if (!findData) return 0;

    const startHabit = new Date(findData.createdAt);
    const habitDays = findData.selectedDays || [];

    let matchedDaysCount: number = 0;

    let currentDate = new Date(startHabit);

    if (exparyDate === "N/A") return 0;
    const targetDate = new Date(exparyDate);

    const daysMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    while (currentDate.getTime() <= targetDate.getTime()) {
        const currentDayStr = daysMapping[currentDate.getDay()];
        if (
            habitDays.length > 0 &&
            habitDays.includes(currentDayStr)
        ) {
            matchedDaysCount++;
        } else if (habitDays.length === 0) {

            matchedDaysCount++;
        }

        // move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return matchedDaysCount;
}