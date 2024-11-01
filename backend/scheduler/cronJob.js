import cron from 'node-cron';
import { scrapData } from '../getData/scrapData.js';

const currencyPairs = [

    'USDJPY', 'INRUSD',
    'USDINR', 'INREUR',
    'EURINR', 'GBPUSD',
    'USDCHF', 'NZDUSD',
    'EURJPY', 'GBPJPY',
    'EURGBP', 'EURUSD',
    'GBPINR', 'AEDINR'
    
];

const periodDaysMap = {
    '1W': 7,       
    '1M': 30,      
    '2M': 60,     
    '3M': 90,      
    '6M': 180,     
    '1Y': 365,     
};


function calculateStartAndEndDate(period) {

    const endDate = Math.floor(new Date().getTime() / 1000); 
    const daysToSubtract = periodDaysMap[period];  

    if (!daysToSubtract) {
        return null; 
    }

    const startDate = Math.floor((new Date().getTime() - daysToSubtract * 24 * 60 * 60 * 1000) / 1000); 

    // both in UNIX time format for yahoo finance website url
    return { startDate, endDate };
}


// running after every 1 minutes and add the latest data of Period Selected - till this date in DB 
export function cronScheduler() {

    console.log( "Scheduler run after every 1 mins and period is 2M ( for testing )" );

    cron.schedule('*/1 * * * *', async () => {
        console.log('Scheduler running...');
        
        const period = '2M'; // Change this to the desired period, e.g., '1M', '3M', etc.

        const dateRange = calculateStartAndEndDate(period);
        
        if (!dateRange) {
            console.error('Invalid period specified');
            return; 
        }

        const { startDate, endDate } = dateRange; 

        for (const pair of currencyPairs) {
            try {
                await scrapData(pair, startDate, endDate);
                console.log(`Fetched data for ${pair}`);
            } catch (error) {
                console.error(`Error fetching data for ${pair}:`, error);
            }
        }
    });
}
