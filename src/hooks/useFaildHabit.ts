import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHabit } from "@/Api/Api";
import type { Habit } from "@/types/types";
import Swal from "sweetalert2";

import { getLocalDateString } from "@/lib/utils";

export const useFaildHabit = () => {
    const queryClient = useQueryClient();
    const today = getLocalDateString();

    const { mutate: failHabitMutation } = useMutation({
        mutationFn: (habit: Habit) => updateHabit(habit._id, { failedDays: [...habit.failedDays, today] }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
            Swal.fire({
                title: "Updated!",
                text: "Habit marked as failed for today.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false,
            });
        },
        onError: (error) => {
            console.error("Error failing habit:", error);
            Swal.fire("Error", "Could not update habit.", "error");
        }
    });

    const habitFailed = (habit: Habit) => {
        failHabitMutation(habit);
    };

    return { habitFailed };
}
