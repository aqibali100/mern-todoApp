import React, { useEffect, useState } from 'react';
import { Bar} from 'react-chartjs-2';
import moment from 'moment';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodosByadmin } from '../features/TodoSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TodosChart = ({todos}) => {
    // const todos = useSelector(state => state.todos.items)
    const [dailyTodoCounts, setDailyTodoCounts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodosByadmin());
    }, [dispatch]);

    useEffect(() => {
        const calculateDailyCounts = () => {
            if (!todos || todos.length === 0) {
                setDailyTodoCounts([]);
                return;
            }

            const counts = {};

            todos.forEach(todo => {
                const day = moment(todo.createdAt).format('YYYY-MM-DD');
                if (counts[day]) {
                    counts[day] += 1;
                } else {
                    counts[day] = 1;
                }
            });

            const countsArray = Object.keys(counts).map(day => ({
                day,
                count: counts[day]
            }));

            countsArray.sort((a, b) => {
                const dateA = moment(a.day, 'YYYY-MM-DD').toDate();
                const dateB = moment(b.day, 'YYYY-MM-DD').toDate();
                return dateA - dateB;
            });

            setDailyTodoCounts(countsArray);
        };

        calculateDailyCounts();
    }, [todos]);

    const lineChartData = {
        labels: dailyTodoCounts.map(entry => moment(entry.day).format('MMMM DD, YYYY')),
        datasets: [
            {
                data: dailyTodoCounts.map(entry => entry.count),
                label: 'Todos Created',
                borderColor: '#3333ff',
                backgroundColor: 'rgba(51, 51, 255, 0.5)',
                fill: true,
                tension: 0.5
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Todos Creation InSights',
                font: {
                    size: 20
                }
            },
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                type: 'category',
                labels: lineChartData.labels,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Todos'
                }
            }
        }
    };

    return (
        <div>
            <Bar data={lineChartData} options={options} width={160} height={60} />
        </div>
    );
};

export default TodosChart;
