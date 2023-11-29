// vehicleService.js
import { db } from './database';

export default function FuelConsumption() {

    async function registerVehicle(description, regNumber) {
        try {
            const result = await db.one(
                'INSERT INTO vehicles (description, reg_number) VALUES ($1, $2, $3) RETURNING *',
                [brand, model, regNumber]
            );
    
            return result;
        } catch (error) {
            console.error('Error registering vehicle', error);
            throw new Error('Internal server error');
        }
    }
    async function calculateFuelConsumption(regNumber) {
        try {
            const vehicleResult = await db.oneOrNone('SELECT id, total_distance, total_money_spent FROM vehicles WHERE reg_number = $1', [regNumber]);
    
            if (!vehicleResult) {
                throw new Error('Vehicle not found');
            }
    
            const vehicleId = vehicleResult.id;
            let { totalDistance, totalMoneySpent } = vehicleResult;
    
            const fuelEntriesResult = await db.any(
                'SELECT * FROM fuel_entries WHERE vehicle_id = $1 ORDER BY created_at DESC LIMIT 2',
                [vehicleId]
            );
    
            if (fuelEntriesResult.length < 2) {
                throw new Error('At least two fuel entries are needed to calculate fuel consumption');
            }
    
            const latestFuelEntry = fuelEntriesResult[0];
            const secondLatestFuelEntry = fuelEntriesResult[1];
    
            const distanceTraveled = latestFuelEntry.distance - secondLatestFuelEntry.distance;
            const fuelConsumed = latestFuelEntry.fuel_amount;
            const fuelConsumption = distanceTraveled / fuelConsumed;
    
            totalDistance += distanceTraveled;
            totalMoneySpent += latestFuelEntry.amount_paid;
    
            await db.none(
                'UPDATE vehicles SET total_distance = $1, total_money_spent = $2 WHERE id = $3',
                [totalDistance, totalMoneySpent, vehicleId]
            );
    
            return { fuelConsumption, totalDistance, totalMoneySpent };
        } catch (error) {
            console.error('Error calculating fuel consumption', error);
            throw new Error('Internal server error');
        }
    }
}