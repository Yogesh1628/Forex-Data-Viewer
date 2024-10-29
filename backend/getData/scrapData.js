import { launch } from 'puppeteer';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
});


function formatDate(dateString) {
    const [month, day, year] = dateString.split(' ');
    const monthMap = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    return `${year}-${monthMap[month]}-${day.replace(',', '')}`;
}

async function insertForexData(records, currency_pair) 
{
    const insertQuery = `INSERT INTO forex_data (date, open, high, low, close, currency_pair) VALUES ($1, $2, $3, $4, $5, $6)`;

    for (const record of records) 
    {
        const formattedDate = formatDate(record.date);
        try {
            await pool.query(insertQuery, [formattedDate, record.open, record.high, record.low, record.close, currency_pair]);
        } catch (dbError) {
            console.error("Database insertion error:", dbError);
        }
    }
}


export const scrapData = async (currency_pair, fromDate, toDate) => {
    const browser = await launch({ headless: true });

    try {
        const page = await browser.newPage();
        const currency_pair_url = currency_pair + '%3DX';
        const url = `https://finance.yahoo.com/quote/${currency_pair_url}/history/?period1=${fromDate}&period2=${toDate}`;

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('table.table.yf-h2urb6.noDl tbody', { timeout: 60000 });

        const data = await page.evaluate(() => 
        {
            const rows = Array.from(document.querySelectorAll('table.table.yf-h2urb6.noDl tbody tr'));
            return rows.map(row => {
                const columns = row.querySelectorAll('td');
                return columns.length >= 5 ? {
                    date:  columns[0]?.innerText,
                    open:  columns[1]?.innerText,
                    high:  columns[2]?.innerText,
                    low:   columns[3]?.innerText,
                    close: columns[4]?.innerText,
                } : null;
            }).filter(row => row);
        });

        // data inserting in DB
        await insertForexData(data, currency_pair);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        await browser.close();
    }
};
