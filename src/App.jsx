import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DataPage from './components/DataPage';

const App = () => {
    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<DataPage />} />
        </Routes>
    );
};

export default App;
