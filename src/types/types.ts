

export type Habit = {
    _id: string;
    name: string;
    frequency?: string;
    selectedDays?: string[];
    days?: number[];
    failedDays: string[];
    successDays: string[];
    target: string;
    dailyOrWeekly: boolean;
    reminderTime: string;
    howManyDays: string;
    category: string;
    createdAt: Date;
    isDeleted: boolean;
    completeToday: boolean;
}



export type NewHabit = Omit<Habit, "_id" | "createdAt">;

export type HabitContextType = {
    habits: Habit[];
    handleAddHabit: (habit: NewHabit) => void;
}

export type HabitProviderProps = {
    children: React.ReactNode;
}