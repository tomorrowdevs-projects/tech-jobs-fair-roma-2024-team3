import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

// interface Props {
//     data: []
// }

const data = [
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

const Charts = () => {
    return (
        <div className="flex justify-center items-center">
            <BarChart
                width={800}
                height={400}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {/* <Legend /> */}
                <Bar dataKey="repetitions" fill="#8884d8" />
                <Bar dataKey="completed" fill="#82ca9d" />
            </BarChart>
        </div>
    )
}

export default Charts