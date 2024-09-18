import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// interface Props {
//     data: []
// }

const barChartData = [
    {
        name: 'Studying',
        repetitions: 3,
        completed: 1
    },
    {
        name: 'Coding',
        repetitions: 4,
        completed: 7
    },
    {
        name: 'Drink Water',
        repetitions: 3,
        completed: 2
    },
    {
        name: 'Playing',
        repetitions: 5,
        completed: 9
    },
    {
        name: 'Eating',
        repetitions: 4,
        completed: 2
    },
];

//this array needs to be sorted by date
const lineChartData = [
    {
        name: 'Studying',
        registered: 3,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
    },
    {
        name: 'Coding',
        registered: 4,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
    },
    {
        name: 'Drink Water',
        registered: 3,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
    },
    {
        name: 'Playing',
        registered: 5,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
    },
    {
        name: 'Eating',
        registered: 4,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
    },
];

const pieChartData = [
    {
        name: 'Studying',
        repeated: 4
    },
    {
        name: 'Coding',
        repeated: 2
    },
    {
        name: 'Drink Water',
        repeated: 5
    },
    {
        name: 'Playing',
        repeated: 3
    },
    {
        name: 'Eating',
        repeated: 8
    },
];

const Charts = () => {
    return (
        <div className="flex flex-col justify-center md:items-center items-start w-full pb-4">
            <p>Done vs Undone</p>
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
            <p className="mt-4">Number of tasks by time</p>
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
            <p>Most repeated tasks</p>
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