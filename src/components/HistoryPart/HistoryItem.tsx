import { deleteHabit, updateHabit } from "@/Api/Api";
import { Button } from "../UI/Button"
import {
    TableRow,
    TableCell,
} from "@/components/UI/table"
import type { Habit } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { getLocalDateString } from "@/lib/utils";
import { Link, useNavigate } from "react-router";

const HistoryItem = ({ habit, index }: { habit: Habit, index: number }) => {
    const navigate = useNavigate();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];
    const isTodayShow = !habit.isDeleted && (
        habit.frequency?.toLowerCase() === "daily" ||
        habit.selectedDays?.includes(today) ||
        (habit.frequency && habit.frequency.includes(today))
    );

    const isCompletedToday = habit.successDays?.includes(getLocalDateString());

    const queryClient = useQueryClient();

    const { mutate: deleteHabitMutation } = useMutation({
        mutationFn: (id: string) => deleteHabit(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["habits"] })
            const previousHabits = queryClient.getQueryData(["habits"])
            queryClient.setQueryData(["habits"], (old: Habit[]) => old.filter((h) => h._id !== id))
            return { previousHabits }
        },
        onError: (_err, _id, context) => {
            if (context?.previousHabits) {
                queryClient.setQueryData(["habits"], context.previousHabits)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] })
        },
        onSuccess: () => {
            Swal.fire("Deleted!", "Item has been permanently deleted.", "success");
        }
    })

    const { mutate: restoreHabitMutation } = useMutation({
        mutationFn: (id: string) => updateHabit(id, {
            isDeleted: false,
            successDays: [],
            failedDays: [],
            createdAt: new Date()
        }),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] })
        },
        onSuccess: () => {
            Swal.fire("Restored!", "Item has been successfully restored.", "success");
        }
    })

    const handleRestore = () => {
        restoreHabitMutation(habit._id);
    }

    const handleDelete = () => {
        Swal.fire({
            title: "Do you want to delete this item permanently?",
            text: "This item will be deleted forever.",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't delete`,
            confirmButtonColor: "#e24014",
            icon: "warning"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteHabitMutation(habit._id);
            } else if (result.isDenied) {
                Swal.fire("Item not deleted", "", "info");
            }
        });
    }

    return (
        <TableRow key={habit._id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{habit.name}</TableCell>
            <TableCell>{habit.category}</TableCell>
            <TableCell>{!habit.dailyOrWeekly ? "Daily" : "Not Daily"}</TableCell>
            <TableCell className="text-right">{new Date(habit.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">{habit.successDays?.[habit.successDays.length - 1] || "N/A"}</TableCell>
            <TableCell className="text-right">
                {habit.isDeleted ? (
                    <span className="text-red-500 font-medium">Deleted</span>
                ) : isCompletedToday ? (
                    <span className="text-emerald-500 font-medium">Completed</span>
                ) : !isTodayShow ? (
                    <span className="text-gray-500 font-medium">Upcoming</span>
                ) : (
                    <span className="text-blue-500 font-medium">Showing</span>
                )}
            </TableCell>
            <TableCell className="text-right">{habit.target}</TableCell>
            <TableCell className="text-right">{habit.howManyDays} days</TableCell>
            <TableCell className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border-blue-500/20 shrink-0" onClick={() => navigate(`/habits/${habit._id}`)}>Details</Button>
                <Button variant="secondary" size="sm" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 shrink-0" onClick={handleDelete}>Delete</Button>

                {habit.isDeleted ? (
                    <Button variant="secondary" size="sm" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border-amber-500/20 shrink-0" onClick={handleRestore}>Restore</Button>
                ) : (
                    <Button
                        variant="secondary"
                        asChild
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border-emerald-500/20 shrink-0"
                    >
                        <Link to={`/edit-habit/${habit?._id}`}>Edit</Link>
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}

export default HistoryItem