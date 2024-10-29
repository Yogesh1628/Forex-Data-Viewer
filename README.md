# Forex Data Viewer

## Overview
The Forex Data Viewer is a full-stack application that fetches and displays updated historical foreign exchange (forex) data. It uses Puppeteer for web scraping, PostgreSQL for database management, and Node.js for the backend.


## Features

- **Data Scraping**: Utilizes Puppeteer to scrape data from Yahoo Finance.
- **REST API**: Enables querying forex data from PostgreSQL based on currency pair and time period.
- **Frontend UI**: React.js interface for users to specify forex query parameters and view results.
- **Scheduler**: Periodically updates the forex data in PostgreSQL.
- **Environment Configuration**: Stores sensitive information in a `.env` file for security.

---

## Tech Stack

- **Backend**: Node.js, Express.js, Puppeteer, PostgreSQL
- **Frontend**: React.js, CSS
- **Database**: PostgreSQL

---

## API Endpoints

### Get Forex Data

- **Endpoint**: `/api/forex-data`
- **Method**: `GET`
- **Query Parameters**:
  - `from`: Currency to convert from (e.g., `USD`).
  - `to`: Currency to convert to (e.g., `EUR`).
  - `period`: The time period for the data (1W, 1M, 3M, 6M, 1Y).

## Scheduler API Working :
The backend API allows users to query historical forex data. The scheduler runs every 10 minutes to update the data in the database for the following currency pairs: 
- USDJPY
- INRUSD
- USDINR
- INREUR
- EURINR
  
You can modify the scheduler time according to your needs and we can add more Pairs if we want , but ensure that the backend server is running continuously.


## Database
This application uses PostgreSQL to store historical forex data. Make sure you have PostgreSQL installed and a database created before running the application.

## Scheduler
The application uses a cron job to run a scheduler that fetches data from Yahoo Finance. The scheduler is set to run every 10 minutes by default and we can select the time period for date range. You can modify the scheduling interval in the `cronScheduler` function within the backend code.

## Environment Variables
This project requires a `.env` file in the root directory for necessary environment variables. Create a `.env` file and add the following variables: `DB_CONNECTION_STRING=your_postgresql_connection_string`. Make sure to replace `your_postgresql_connection_string` with your actual database connection string.


## How to Run the Project
1. Clone the repository to your local machine: `git clone https://github.com/<your-username>/<your-repo>.git`.
2. Navigate to the project directory: `cd <your-repo>`.
3. Install the required dependencies for the backend: `npm install`.
4. Set up your PostgreSQL database and update the `.env` file with the connection string.
5. Start the backend server: `npm start / node app.js`.
6. Navigate to the frontend directory and install the required dependencies: `root_folder in our case` and `npm install`.
7. Start the frontend application: `npm start / npm run dev`.
8. Open your browser and navigate to `http://localhost:5173` to view the Forex Data Viewer.

### Table Schema

The Database name is also `forex_data`
---
The following SQL code defines the `forex_data` table schema used to store historical forex data :

```sql
CREATE TABLE forex_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    open DECIMAL(10, 4) NOT NULL,
    high DECIMAL(10, 4) NOT NULL,
    low DECIMAL(10, 4) NOT NULL,
    close DECIMAL(10, 4) NOT NULL,
    currency_pair VARCHAR(10) NOT NULL
);
