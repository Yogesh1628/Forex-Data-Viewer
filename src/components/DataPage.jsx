import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DataPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { from, to, period } = location.state || {}; // Get parameters passed from HomePage
    const [forexData, setForexData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setForexData(null);
        const fetchData = async () => {
            try {

                // Use query parameters directly in the URL
                const response = await axios.get(`http://localhost:3000/api/forex-data`, {
                    params: { from, to, period },
                });

                setForexData(response.data);
                setError(''); // Reset error if data is fetched successfully

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('DATA NOT AVAILABLE FOR THIS CURRENCY PAIR');
            }
        };

        // Call fetchData if all required parameters are present
        if (from && to && period) {
            fetchData();
        } else {
            setError('Invalid parameters. Returning to Home page.');
            setTimeout(() => navigate('/'), 2000);
        }
    }, [from, to, period, navigate]);

    return (
        <div className="data-container">
            <h1 className="data-title">{`${from} to ${to} | Period Range: ${period}`}</h1>
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => navigate('/')}>Back to Home</button>
                </div>
            ) : forexData ? (
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
            ) : (
                <p className = "Loading">Loading data...</p>
            )}
        </div>
    );
};

export default DataPage;
