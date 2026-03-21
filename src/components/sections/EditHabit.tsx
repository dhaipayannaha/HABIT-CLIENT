import { Button } from "../UI/Button"
import { Field, FieldGroup, FieldLabel } from "../UI/field"
import { Alert, AlertDescription, AlertTitle } from "../UI/alert"
import { AlertCircle } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../UI/select"
import { Input } from "../UI/input"
import { Checkbox } from "../UI/checkbox"
import { useState, type FormEvent, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getHabitDetails, updateHabit } from "@/Api/Api"
import { Link, useNavigate, useParams } from "react-router"
import type { Habit } from "@/types/types"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EditHabit = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: habitData, isLoading } = useQuery({
        queryKey: ["habits", id],
        queryFn: () => getHabitDetails(id as string),
        enabled: !!id,
    });

    const [habit, setHabit] = useState({
        name: "",
        frequency: "",
        target: "",
        reminderTime: "",
        howManyDays: "",
        category: "",
        dailyOrWeekly: false,
        completeToday: false,
    })

    const [dayWeek, setDayWeek] = useState(false)
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (habitData) {
            setHabit({
                name: habitData.name || "",
                frequency: habitData.frequency || "",
                target: habitData.target || "",
                reminderTime: habitData.reminderTime || "",
                howManyDays: habitData.howManyDays || "",
                category: habitData.category || "",
                dailyOrWeekly: habitData.dailyOrWeekly || false,
                completeToday: habitData.completeToday || false,
            });
            setDayWeek(habitData.dailyOrWeekly || false);
            setSelectedDays(habitData.selectedDays || []);
        }
    }, [habitData]);

    const { mutate: editHabitMutation, isPending } = useMutation({
        mutationFn: (updatedData: Partial<Habit>) => updateHabit(id as string, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
            navigate(`/habits/${id}`);
        },
    })

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const errors = [];
        if (!habit.name.trim()) errors.push("Habit Name is required");
        if (!habit.target.trim()) errors.push("Target/Goal is required");
        if (!habit.category.trim()) errors.push("Category is required");

        if (dayWeek) {
            if (selectedDays.length === 0) errors.push("At least one day must be selected");
        } else {
            if (!habit.frequency) errors.push("Frequency is required");
        }

        const days = Number(habit.howManyDays);
        if (!habit.howManyDays || isNaN(days) || days < 1 || days > 365) {
            errors.push("'How Many Days' must be between 1 and 365");
        }

        if (errors.length > 0) {
            setError(errors.join(". "));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const updatedHabitData = {
            ...habit,
            dailyOrWeekly: dayWeek,
            selectedDays: dayWeek ? selectedDays : [],
            frequency: dayWeek ? "" : habit.frequency
        };

        editHabitMutation(updatedHabitData);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto border rounded-xl p-8 bg-card text-card-foreground shadow-sm">
            <div>
                <h1 className="text-2xl font-bold text-center">Edit Habit</h1>
            </div>
            <div>
                <form className="w-full max-w-4xl mx-auto" onSubmit={handleFormSubmit}>
                    {error && (
                        <Alert variant="destructive" className="mb-6 mt-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Validation Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <FieldGroup>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <Field>
                                    <FieldLabel htmlFor="form-name">Habit Name</FieldLabel>
                                    <Input
                                        id="form-name"
                                        type="text"
                                        placeholder="Evil Rabbit"
                                        value={habit.name}
                                        onChange={(e) => setHabit({ ...habit, name: e.target.value })}
                                    />
                                </Field>

                                <Field orientation="horizontal">
                                    <Checkbox id="form-dailyOrWeekly"
                                        checked={dayWeek}
                                        onCheckedChange={(checked: boolean) => {
                                            setDayWeek(checked);
                                            if (checked) {
                                                setHabit({ ...habit, dailyOrWeekly: checked });
                                            } else {
                                                setSelectedDays([]);
                                                setHabit({ ...habit, dailyOrWeekly: checked });
                                            }
                                        }}
                                    />
                                    <FieldLabel htmlFor="form-dailyOrWeekly">Daily or Weekly</FieldLabel>
                                </Field>
                                {
                                    dayWeek ? (
                                        <Field>
                                            <FieldLabel>Select Days</FieldLabel>
                                            <div className="flex flex-wrap gap-2">
                                                {daysOfWeek.map((day) => (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => toggleDay(day)}
                                                        className={cn(
                                                            "w-10 h-10 rounded-full border transition-all duration-200 text-xs font-bold",
                                                            selectedDays.includes(day)
                                                                ? "bg-primary text-primary-foreground shadow-md scale-105"
                                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                        )}
                                                    >
                                                        {day[0]}
                                                    </button>
                                                ))}
                                            </div>
                                        </Field>
                                    ) : (
                                        <Field>
                                            <FieldLabel htmlFor="form-country">Frequency</FieldLabel>
                                            <Select value={habit.frequency} onValueChange={(value) => setHabit({ ...habit, frequency: value })}>
                                                <SelectTrigger id="form-country">
                                                    <SelectValue placeholder="Select Frequency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Daily">Daily</SelectItem>
                                                    
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )
                                }
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <Field>
                                    <FieldLabel htmlFor="form-phone">Target / Goal</FieldLabel>
                                    <Input id="form-phone" type="text" placeholder="100 pushups" value={habit.target} onChange={(e) => setHabit({ ...habit, target: e.target.value })} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="form-address">How Many Days</FieldLabel>
                                    <Input id="form-address" type="number" placeholder="input number" value={habit.howManyDays} onChange={(e) => setHabit({ ...habit, howManyDays: e.target.value })} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="form-address">Habit Category</FieldLabel>
                                    <Input id="form-address" type="text" placeholder="input category" value={habit.category} onChange={(e) => setHabit({ ...habit, category: e.target.value })} />
                                </Field>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4 mt-10">
                            <Button asChild type="button" variant="outline">
                                <Link to={`/habits/${id}`}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Updating..." : "Update Habit"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default EditHabit
