import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config(); 

//connection with Postgres
const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
});


//Function for searching data in DB and sending to UI
export async function getDataFromDB(from, to, startDate, endDate) 
{
    const currencyPair = `${from}${to}`; // Concatenate to form the currency pair string

    // Format dates to 'YYYY-MM-DD' as PostgreSQL stores dates in this format
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Query PostgreSQL for the specified currency pair and date range
    const query = `
        SELECT date, open, high, low, close, currency_pair 
        FROM forex_data 
        WHERE currency_pair = $1 
        AND date BETWEEN $2 AND $3 
        ORDER BY date ASC;
    `;

    const values = [currencyPair, formattedStartDate, formattedEndDate];
    
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error fetching forex data:', error);
        throw error;
    }
}
