import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHabit } from "@/Api/Api";
import type { Habit } from "@/types/types";
import Swal from "sweetalert2";

import { getLocalDateString } from "@/lib/utils";

export const useCompleteHabit = () => {
    const queryClient = useQueryClient();
    const today = getLocalDateString();

    const { mutate: completeHabitMutation } = useMutation({
        mutationFn: (habit: Habit) => updateHabit(habit._id, { completeToday: true, successDays: [...habit.successDays, today] }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
            Swal.fire({
                title: "Success!",
                text: "Habit marked as completed for today.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        },
        onError: (error) => {
            console.error("Error completing habit:", error);
            Swal.fire("Error", "Could not update habit.", "error");
        }
    });

    const handleComplete = (habit: Habit) => {
        completeHabitMutation(habit);
    };

    return { handleComplete };
};