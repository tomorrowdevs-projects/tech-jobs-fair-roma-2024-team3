import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Task } from "../types";
import { useMemo } from "react";

interface BarChartData {
    name: string
    repetitions: number
    completed: number
}

interface LineChartData {
    name: string;
    registered: number;
    date: string; // Format: DD/MM
}

interface PieChartData {
    name: string;
    repeated: number;
}

const Charts = ({ allTasks }: { allTasks: Task[] }) => {
    const barChartData: BarChartData[] = useMemo(() => {
        const taskMap = allTasks.reduce<Record<string, BarChartData>>((acc, task) => {
            const { name, done } = task;
            if (!acc[name]) {
                acc[name] = { name, repetitions: 0, completed: 0 };
            }
            acc[name].repetitions += 1;
            if (done) {
                acc[name].completed += 1;
            }
            return acc;
        }, {});

        return Object.values(taskMap);
    }, [allTasks]);

    const lineChartData: LineChartData[] = useMemo(() => {
        const taskMap = allTasks.reduce<Record<string, LineChartData>>((acc, task) => {
            const { name, date } = task;
            const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
            });
            const key = `${name}-${formattedDate}`;
            if (!acc[key]) {
                acc[key] = { name, registered: 0, date: formattedDate };
            }
            acc[key].registered += 1;

            return acc;
        }, {});
        return Object.values(taskMap);
    }, [allTasks]);

    const pieChartData: PieChartData[] = useMemo(() => {
        const taskMap = allTasks.reduce<Record<string, PieChartData>>((acc, task) => {
            const { name } = task;
            if (!acc[name]) {
                acc[name] = { name, repeated: 0 };
            }
            acc[name].repeated += 1;
            return acc;
        }, {});

        return Object.values(taskMap);
    }, [allTasks]);

    return (
        <div className="flex flex-col justify-center md:items-center items-start w-full pb-4">
            <p className="text-center w-full">Done vs Undone</p>
            <ResponsiveContainer width={"100%"} height={300} style={{ marginLeft: -20 }}>
                <BarChart
                    data={barChartData}
                    margin={{
                        top: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={45} textAnchor="start" style={{ fontSize: 10 }} />
                    <YAxis style={{ fontSize: 10 }} />
                    <Bar dataKey="repetitions" fill="#3b82f6" />
                    <Bar dataKey="completed" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
            <p className="text-center w-full mt-4">Number of tasks by time</p>
            <ResponsiveContainer width="100%" height={300} style={{ marginLeft: -20 }}>
                <LineChart
                    data={lineChartData}
                    margin={{
                        top: 20,
                        bottom: 20,
                        right: 10
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" interval={0} style={{ fontSize: 10 }} />
                    <YAxis style={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="registered" stroke="#3b82f6" />
                </LineChart>
            </ResponsiveContainer>
            <p className="text-center w-full">Most repeated tasks</p>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        dataKey="repeated"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#3b82f6"
                        label={({ name, repeated }) => `${name}: ${repeated}`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Charts