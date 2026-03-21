import { getHabitDetails, updateHabit } from "@/Api/Api";
import Container from "@/shared/Container";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { Button } from "../UI/Button";
import { manageExpairy } from "@/hooks/manageExpairy";
import { Calendar } from "../UI/calendar";
import { useHabitCalendar } from "@/hooks/useHabitCalendar";
import { useCompleteHabit } from "@/hooks/useCompleteHabit";
import Swal from "sweetalert2";

const HabitDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: habit, isLoading, isError, error } = useQuery({
        queryKey: ["habits", id],
        queryFn: () => getHabitDetails(id as string),
        enabled: !!id,
    });

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
        if (habit) {
            restoreHabitMutation(habit._id);
        }
    }

    const { handleComplete: habitComplete } = useCompleteHabit()

    const handleComplete = () => {
        if (habit) {
            habitComplete(habit)
        }
    }

    const exparyDate = manageExpairy(habit?._id || "");

    const progressValue = habit ? ((habit.successDays?.length || 0) / Number(habit.howManyDays || 30)) * 100 : 0;

    const {
        successDates,
        habitStart,
        habitEnd,
        monthCount,
        calendarModifiers,
        calendarModifierClassNames,
    } = useHabitCalendar(habit, exparyDate);

    if (isLoading) {
        return (
            <Container>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    </div>
                </div>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container>
                <div className="mt-10 p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Habit</h2>
                    <p className="text-red-400/60 mb-4">{error.message}</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">Try Again</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-10">
                {/* Left Section: Info */}
                <div className="flex items-start gap-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <h1 className="relative text-5xl font-black bg-gradient-to-br from-primary to-primary/40 w-24 h-24 flex items-center justify-center rounded-3xl text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                            {habit?.name?.[0].toUpperCase() || "H"}
                        </h1>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">{habit?.name}</h2>
                        <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">{habit?.category}</p>
                        <p className="text-xs text-muted-foreground/50 font-medium">Started: {habit?.createdAt ? new Date(habit.createdAt).toLocaleDateString() : "N/A"}</p>
                        <p className="text-xs text-muted-foreground/50 font-medium">Expary Date: {exparyDate}</p>
                    </div>
                </div>

                {/* Middle Section: Progress */}
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/[0.04] transition-all">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Current Progress</p>
                                <p className="text-sm font-bold text-white/90">Consistency Journey</p>
                            </div>
                            <p className="text-3xl font-black text-primary">{habit?.successDays?.length || 0}</p>
                        </div>

                        <div className="relative">
                            <div className="bg-white/5 w-full h-4 rounded-full overflow-hidden p-1 border border-white/5">
                                <div
                                    className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                    style={{ width: `${Math.min(progressValue, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Stock</p>
                                <p className="text-2xl font-black text-white">{habit?.howManyDays || 0}</p>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest mb-1">Failed Days</p>
                                <p className="text-2xl font-black text-white">{habit?.failedDays?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Actions & Notes */}
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="flex gap-3 mb-8">
                        {habit?.isDeleted ? (
                            <Button
                                onClick={handleRestore}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black h-12 rounded-2xl transition-all hover:-translate-y-1 shadow-lg shadow-amber-500/20"
                            >
                                Restore
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleComplete}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 rounded-2xl transition-all hover:-translate-y-1 shadow-lg shadow-primary/20"
                                >
                                    Mark Complete
                                </Button>
                                <Button
                                    variant="secondary"
                                    asChild
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold h-12 rounded-2xl border-white/5 transition-all hover:-translate-y-1"
                                >
                                    <Link to={`/edit-habit/${habit?._id}`}>Edit</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative shadow-inner">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                            <h1 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Today's Note</h1>
                        </div>
                        <p className="text-xl font-bold italic text-white/90 leading-relaxed">
                            "1 litter of water"
                        </p>
                    </div>
                </div>
            </div>
            {/* ── Calendar Section ──────────────────────────────────────── */}
            <div className="mt-10 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Habit Calendar</h2>

                <div className="flex justify-center">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 overflow-x-auto">
                        <Calendar
                            mode="multiple"
                            selected={successDates}
                            numberOfMonths={monthCount}
                            startMonth={habitStart}
                            endMonth={habitEnd}
                            modifiers={calendarModifiers}
                            modifiersClassNames={calendarModifierClassNames}
                            showOutsideDays={false}
                            className="pointer-events-none"
                        />
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 mt-8 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-green-700" />
                        <span className="text-sm text-white/70 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-[#263238] border border-[#ffc727]/40" />
                        <span className="text-sm text-[#ffc727] font-medium">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-red-700" />
                        <span className="text-sm text-white/70 font-medium">Missed</span>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default HabitDetail;