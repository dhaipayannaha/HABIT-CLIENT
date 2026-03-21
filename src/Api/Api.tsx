import type { Habit } from "@/types/types";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002",
});


export const createHabit = async (habit: Omit<Habit, "_id" | "createdAt" | "failedDays" | "successDays" | "isDeleted">) => {
    const response = await api.post("/habits", {
        ...habit,
        createdAt: new Date().toISOString(),
        failedDays: [],
        successDays: [],
        isDeleted: false,
    });
    return response.data;
}


export const getHabits = async () => {
    const response = await api.get("/habits");
    return response.data;
}
export const getHabitDetails = async (id: string): Promise<Habit> => {
    const response = await api.get(`/habits/${id}`).then((res) => res.data);
    return response;
}

export const removeHabit = async (id: string): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, { isDeleted: true });
    return response.data;
}

export const deleteHabit = async (id: string): Promise<Habit> => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
}

export const updateHabit = async (id: string, habit: Partial<Habit>): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, habit);
    return response.data;
}