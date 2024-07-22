import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUsers } from '../features/UsersSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserChart = ({users}) => {
  const [dailyUserCounts, setDailyUserCounts] = useState([]);
  const dispatch = useDispatch();
  // const { Users: users } = useSelector((state) => state.user);


  useEffect(() => {
    dispatch(GetAllUsers());
}, [dispatch]);

  useEffect(() => {
    const calculateDailyCounts = () => {
      if (!users || users.length === 0) {
        setDailyUserCounts([]);
        return;
      }

      const counts = {};

      users.forEach(user => {
        const day = moment(user.createdAt).format('YYYY-MM-DD');
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

      setDailyUserCounts(countsArray);
    };

    calculateDailyCounts();
  }, [users]);

  const lineChartData = {
    labels: dailyUserCounts.map(entry => moment(entry.day).format('MMMM DD, YYYY')),
    datasets: [
      {
        data: dailyUserCounts.map(entry => entry.count),
        label: 'Users Created',
        borderColor: '#ff5733', // Adjust color as needed
        backgroundColor: 'rgba(255, 87, 51, 0.5)', // Adjust color as needed
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
        text: 'User Creation Insights',
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
          text: 'Number of Users'
        }
      }
    }
  };

  return (
    <div>
      <Line data={lineChartData} options={options} width={160} height={60} />
    </div>
  );
};

export default UserChart;
