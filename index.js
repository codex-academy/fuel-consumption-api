import pgPromise from 'pg-promise';
import express from 'express';
import bodyParser from 'body-parser';
import { registerVehicle, calculateFuelConsumption } from './vehicleService';
import { validate } from './validator';

const pgp = pgPromise();

const connectionOptions = {
    connectionString: 'postgres://fuel_user:fuel123@localhost:5432/fuel_consumption',
    ssl: process.env.NODE_ENV === 'production', // Enable SSL in production
};

const db = pgp(connectionOptions);



const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/registerVehicle', async (req, res) => {
    const { brand, model, regNumber } = req.body;

    const validationErrors = validate({ regNumber }, { regNumber: { regNumber: true } });
    if (validationErrors) {
        return res.status(400).json({ error: `Invalid registration number: ${validationErrors.regNumber.join(', ')}` });
    }

    try {
        const result = await registerVehicle(brand, model, regNumber);
        res.json({ vehicle: result });
    } catch (error) {
        console.error('Error handling /registerVehicle', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/calculateFuelConsumption', async (req, res) => {
    const { regNumber } = req.body;

    const validationErrors = validate({ regNumber }, { regNumber: { regNumber: true } });
    if (validationErrors) {
        return res.status(400).json({ error: `Invalid registration number: ${validationErrors.regNumber.join(', ')}` });
    }

    try {
        const result = await calculateFuelConsumption(regNumber);
        res.json(result);
    } catch (error) {
        console.error('Error handling /calculateFuelConsumption', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { createApp };
