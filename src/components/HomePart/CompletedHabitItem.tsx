import type { Habit } from "@/types/types"
import { CheckCircle2 } from "lucide-react"

const CompletedHabitItem = ({ habit, index }: { habit: Habit, index: number }) => {
    return (
        <div className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-sm">
                    {index + 1}
                </span>
                <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                        {habit.name}
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <p className="text-xs text-muted-foreground">{habit.category}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    Done
                </span>
            </div>
        </div>
    )
}

export default CompletedHabitItem