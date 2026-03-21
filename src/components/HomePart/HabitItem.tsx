import type { Habit } from "@/types/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/UI/card"
import { Link } from "react-router"
import Swal from "sweetalert2"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeHabit } from "@/Api/Api";
import { useCompleteHabit } from "@/hooks/useCompleteHabit";
import { useFaildHabit } from "@/hooks/useFaildHabit";
import { manageExpairy } from "@/hooks/manageExpairy";
import { manageDays } from "@/hooks/manageDays";


const HabitItem = ({ habit, index }: { habit: Habit, index: number }) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const queryClient = useQueryClient();


    const { mutate: removeHabitMutation, isPending } = useMutation({
        mutationFn: (id: string) => removeHabit(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousHabits = queryClient.getQueryData(['habits']);

            queryClient.setQueriesData({ queryKey: ['habits'] }, (old: any) =>
                old ? old.filter((t: any) => t._id !== id) : []
            );
            return { previousHabits };
        },
        onSuccess: () => {
            Swal.fire("Deleted!", "Item moved to history.", "success");
        },
        onError: (error: Error) => {
            console.error("Error deleting habit:", error);
        }
    });


    const handleRemove = () => {
        Swal.fire({
            title: "Do you want to delete this item?",
            text: "This item will be moved to history.",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't delete`,
            confirmButtonColor: "#e24014",
            icon: "warning"
        }).then((result) => {
            if (result.isConfirmed) {
                removeHabitMutation(habit._id);
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        })
    }


    const { handleComplete: habitComplete } = useCompleteHabit()

    const handleComplete = () => {
        habitComplete(habit)
    }

    const { habitFailed } = useFaildHabit()


    const handleFail = () => {
        habitFailed(habit)
    }

    // handleFail()

    const exparyDate = manageExpairy(habit._id)
    console.log(exparyDate);

    const daysLeft = manageDays(habit._id)
    console.log(daysLeft)










    return (
        <div className="w-full">
            <Card key={habit._id} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/20 text-primary w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg border border-primary/20 group-hover:scale-110 transition-transform">
                            {index + 1}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">{habit.name}</CardTitle>
                            <CardDescription className="text-xs uppercase tracking-widest font-semibold text-muted-foreground/60">{habit.category}</CardDescription>
                        </div>
                    </div>
                    <Link
                        to={`/habits/${habit._id}`}
                        className="opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg transition-all border border-white/10"
                    >
                        View Details
                    </Link>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-3 pb-6 border-b border-white/5 mx-6">
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Commitment</p>
                        {/* <p className="text-sm font-medium text-white/90 underline decoration-primary/30 underline-offset-4">{habit.howManyDays} Days</p> */}
                        <p className="text-sm font-medium text-white/90 underline decoration-primary/30 underline-offset-4">{daysLeft + 1} Days</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Target</p>
                        <p className="text-sm font-medium text-white/90 italic">"{habit.target}"</p>
                    </div>
                </CardContent>

                <div className="p-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {habit.dailyOrWeekly && habit.selectedDays && habit.selectedDays.length > 0 ? (
                            <div className="flex gap-1.5">
                                {days.map((day) => (
                                    <span
                                        key={day}
                                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold border transition-all ${habit.selectedDays?.includes(day)
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                            : "bg-white/5 text-muted-foreground border-white/5 opacity-40"
                                            }`}
                                    >
                                        {day[0]}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-1.5 rounded-2xl bg-primary/10 border border-primary/20">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{habit.frequency || "Daily"}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            className="flex-1 md:flex-none text-muted-foreground hover:text-red-500 text-xs font-semibold px-3 transition-colors"
                            onClick={handleRemove}
                        >
                            {isPending ? "Removing..." : "Remove"}
                        </button>
                        <button
                            className="flex-[2] md:flex-none bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                            onClick={handleComplete}
                        >
                            Mark Complete
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default HabitItem;