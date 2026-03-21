import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHabit } from "@/Api/Api";
import type { Habit } from "@/types/types";
import { useEffect } from "react";
import { getLocalDateString } from "@/lib/utils";


export const useReconcileHabits = (habits: Habit[] | undefined) => {
    const queryClient = useQueryClient();

    const { mutate: updateBatch } = useMutation({
        mutationFn: async (payload: { id: string, missedDates: string[] }[]) => {
            return Promise.all(
                payload.map(p => {
                    const habit = habits?.find(h => h._id === p.id);
                    if (!habit) return Promise.resolve();
                    return updateHabit(p.id, {
                        failedDays: [...habit.failedDays, ...p.missedDates]
                    });
                })
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
        }
    });

    useEffect(() => {
        if (!habits || habits.length === 0) return;

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const missedPayload: { id: string, missedDates: string[] }[] = [];

        habits.forEach(habit => {
            const missedDates: string[] = [];
            const createdDate = new Date(habit.createdAt);
            createdDate.setHours(0, 0, 0, 0);

            // Iterate from createdAt to yesterday
            let current = new Date(createdDate);
            while (current <= yesterday) {
                const dateStr = getLocalDateString(current);
                const dayName = dayNames[current.getDay()];

                const isScheduled =
                    habit.frequency?.toLowerCase() === "daily" ||
                    habit.selectedDays?.includes(dayName) ||
                    (habit.frequency && habit.frequency.includes(dayName));

                if (isScheduled) {
                    const isCompleted = habit.successDays.includes(dateStr);
                    const isFailed = habit.failedDays.includes(dateStr);

                    if (!isCompleted && !isFailed) {
                        missedDates.push(dateStr);
                    }
                }
                current.setDate(current.getDate() + 1);
            }

            if (missedDates.length > 0) {
                missedPayload.push({ id: habit._id, missedDates });
            }
        });

        if (missedPayload.length > 0) {
            updateBatch(missedPayload);
        }
    }, [habits]);
};
