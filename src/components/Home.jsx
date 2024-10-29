import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [period, setPeriod] = useState('1M'); 
    const navigate = useNavigate();

    useEffect(() => {
        setFrom('');
        setTo('');
        setPeriod('1M');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
            alert("Please enter valid 3-letter currency codes (e.g., 'USD', 'EUR').");
            return;
        }

        navigate('/data', { state: { from, to, period } });
    };

    return (
        <div className="home-container">
            <h1 className="title">Forex Data Viewer</h1>
            <form onSubmit={handleSubmit} className="forex-form">
                <input
                    type="text"
                    placeholder="From Currency (INR)"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    className="input-field"
                    required
                />
                <input
                    type="text"
                    placeholder="To Currency (EUR)"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                    className="input-field"
                    required
                />
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="select-field"
                    required
                >
                    <option value="1W">1 Week</option>
                    <option value="1M">1 Month</option>
                    <option value="2M">2 Months</option>
                    <option value="3M">3 Months</option>
                    <option value="6M">6 Months</option>
                    <option value="1Y">1 Year</option>
                </select>
                <button type="submit" className="submit-button">Get Data</button>
            </form>
        </div>
    );
};

export default HomePage;
