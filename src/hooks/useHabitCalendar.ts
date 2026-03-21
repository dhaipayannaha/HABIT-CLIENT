import type { Habit } from "@/types/types";

// ── Utility ─────────────────────────────────────────────────────────────────
export const formatLocalDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// Map the abbreviations used in AddHabit → JS getDay() numbers (Sun=0…Sat=6)
const DAY_ABBREV_TO_NUM: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

// ── Return type ──────────────────────────────────────────────────────────────
export type HabitCalendarData = {
    /** Date objects for every completed day (fed to <Calendar selected={…}>) */
    successDates: Date[];
    /** First day of the habit (startMonth prop) */
    habitStart: Date;
    /** Last day of the habit (endMonth prop) */
    habitEnd: Date;
    /** How many months to show side-by-side */
    monthCount: number;
    /** react-day-picker modifiers: success | habitDay | missed */
    calendarModifiers: {
        success: (date: Date) => boolean;
        habitDay: (date: Date) => boolean;
        missed: (date: Date) => boolean;
    };
    /** Tailwind classes applied per modifier key */
    calendarModifierClassNames: {
        success: string;
        habitDay: string;
        missed: string;
    };
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useHabitCalendar = (
    habit: Habit | undefined,
    exparyDate: string
): HabitCalendarData => {

    const habitStart = habit?.createdAt ? new Date(habit.createdAt) : new Date();
    const habitEnd = exparyDate && exparyDate !== "N/A" ? new Date(exparyDate) : new Date();

    const successDates: Date[] = (habit?.successDays ?? []).map((d) => new Date(d));

    // selectedDays stores abbreviations like "Mon","Tue"…
    // dailyOrWeekly=true  → specific weekdays chosen by user
    // dailyOrWeekly=false → every day in range is a habit day (daily/frequency mode)
    const scheduledWeekdays: number[] = habit?.dailyOrWeekly
        ? (habit?.selectedDays ?? [])
            .map((d) => DAY_ABBREV_TO_NUM[d])
            .filter((n) => n !== undefined)
        : [];

    const todayStr = formatLocalDate(new Date());
    const startStr = formatLocalDate(habitStart);
    const endStr = formatLocalDate(habitEnd);

    // Helper used inside modifiers
    const isScheduledDay = (date: Date): boolean =>
        scheduledWeekdays.length > 0
            ? scheduledWeekdays.includes(date.getDay())
            : true; // no specific days → every day counts

    const isDoneDay = (dateStr: string): boolean =>
        successDates.some((s) => formatLocalDate(s) === dateStr);

    const calendarModifiers = {
        // 🟢 Completed
        success: (date: Date) => isDoneDay(formatLocalDate(date)),

        // 🌑 / 🟡 Scheduled but not yet done (today or future)
        habitDay: (date: Date) => {
            const ds = formatLocalDate(date);
            if (ds < startStr || ds > endStr) return false;
            return isScheduledDay(date) && !isDoneDay(ds) && ds >= todayStr;
        },

        // 🔴 Scheduled in the past but missed
        missed: (date: Date) => {
            const ds = formatLocalDate(date);
            if (ds < startStr || ds > endStr || ds >= todayStr) return false;
            return isScheduledDay(date) && !isDoneDay(ds);
        },
    };

    const calendarModifierClassNames = {
        success: "!bg-green-700 !text-[#e1e7ea] hover:!bg-green-700 hover:!text-[#e1e7ea] rounded-sm",
        habitDay: "!bg-[#263238] !text-[#ffc727] hover:!bg-[#263238] hover:!text-[#ffc727] rounded-sm",
        missed: "!bg-red-700  !text-[#e1e7ea] hover:!bg-red-700  hover:!text-[#e1e7ea] rounded-sm",
    };

    // How many month panels to render
    const monthCount = (() => {
        const sy = habitStart.getFullYear(), sm = habitStart.getMonth();
        const ey = habitEnd.getFullYear(), em = habitEnd.getMonth();
        return Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
    })();

    return {
        successDates,
        habitStart,
        habitEnd,
        monthCount,
        calendarModifiers,
        calendarModifierClassNames,
    };
};
