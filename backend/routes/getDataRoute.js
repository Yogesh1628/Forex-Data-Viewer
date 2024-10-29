import express from 'express';
import { getDataFromDB } from '../getData/getDataFromDB.js';

const router = express.Router();


function calculateStartDate(period) {
    const endDate = new Date();
    let startDate;

    switch (period) {
        case '1W':
            startDate = new Date(endDate.setDate(endDate.getDate() - 7)); // 1 week ago
            break;
        case '1M':
            startDate = new Date(endDate.setMonth(endDate.getMonth() - 1)); // 1 month ago
            break;
        case '2M':
            startDate = new Date(endDate.setMonth(endDate.getMonth() - 2)); // 2 months ago
            break;    
        case '3M':
            startDate = new Date(endDate.setMonth(endDate.getMonth() - 3)); // 3 months ago
            break;
        case '6M':
            startDate = new Date(endDate.setMonth(endDate.getMonth() - 6)); // 6 months ago
            break;
        case '1Y':
            startDate = new Date(endDate.setFullYear(endDate.getFullYear() - 1)); // 1 year ago
            break;
        default:
            throw new Error('Invalid period specified');
    }

    return startDate;
}


router.get('/api/forex-data', async (req, res) => {
    const { from, to, period } = req.query;

    if (!from || !to || !period) {
        return res.status(400).send('Required query parameters: from, to, and period.');
    }

    const endDate = new Date();
    const startDate = calculateStartDate(period);

    try 
    {
        const data = await getDataFromDB(from, to, startDate, endDate);
        if (data.length === 0) 
        {
            return res.status(404).send('No data found for the specified range');
        }
        return res.json(data);
    } 
    catch (error) 
    {
        return res.status(500).send('Error fetching data');
    }
});


export default router;
