import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend);

const DataPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { from, to, period } = location.state || {}; 
    const [forexData, setForexData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setForexData(null);
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/forex-data`, {
                    params: { from, to, period },
                });

                console.log('Fetched Data:', response.data);
                setForexData(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('DATA NOT AVAILABLE FOR THIS CURRENCY PAIR');
            }
        };

        if (from && to && period) {
            fetchData();
        } else {
            setError('Invalid parameters. Returning to Home page.');
            setTimeout(() => navigate('/'), 2000);
        }
    }, [from, to, period, navigate]);

    const chartData = {
        labels: forexData ? forexData.map(data => new Date(data.date).toLocaleDateString()) : [],
        datasets: [
            {
                label: `${from} to ${to}`, 
                data: forexData ? forexData.map(data => data.close) : [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Exchange Rate',
                },
            },
        },
    };

    return (
        <div className="data-container">
            <h1 className="data-title">{`${from} to ${to} | Period Range: ${period}`}</h1>
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => navigate('/')}>Back to Home</button>
                </div>
            ) : forexData ? (
                <>
                    <Line data={chartData} options={options} height={50} width={100} />
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Open</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forexData.map((data, index) => (
                                <tr key={index}>
                                    <td>{new Date(data.date).toLocaleDateString()}</td>
                                    <td>{data.open}</td>
                                    <td>{data.high}</td>
                                    <td>{data.low}</td>
                                    <td>{data.close}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="Loading">Loading data...</p>
            )}
        </div>
    );
};

export default DataPage;
