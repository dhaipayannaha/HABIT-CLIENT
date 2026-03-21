import Container from "@/shared/Container"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/UI/table"
import { useQuery } from "@tanstack/react-query";
import { getHabits } from "@/Api/Api";
import type { Habit } from "@/types/types";

import HistoryItem from "../HistoryPart/HistoryItem";


const History = () => {

    const { data: habits } = useQuery<Habit[]>({
        queryKey: ["habits"],
        queryFn: () => getHabits(),
    });



    return (
        <Container>
            <div className="rounded-lg p-6 bg-card text-card-foreground border shadow-sm my-5">
                <h1>History</h1>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No</TableHead>
                            <TableHead className="w-[150px]">Habit Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead className="text-right">Created At</TableHead>
                            <TableHead className="text-right">Completed At</TableHead>
                            {/* <TableHead className="text-right">Today's Status</TableHead> */}
                            <TableHead className="text-right">Visibility</TableHead>
                            <TableHead className="text-right">Target</TableHead>
                            <TableHead className="text-right">Duration</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {habits?.map((habit, index) => (
                            <HistoryItem key={habit._id || index} habit={habit} index={index} />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total Habits</TableCell>
                            <TableCell className="text-right">{habits?.length || 0}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </Container>
    )
}

export default History