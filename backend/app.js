import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getRoute from './routes/getDataRoute.js';  
import { cronScheduler } from './scheduler/cronJob.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


//get Data Request from User / Client
app.use(getRoute);


//Scheduler
cronScheduler();


//Server is running 
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
