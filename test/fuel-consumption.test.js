import FuelConsumption from '../fuel-consumption.js';
import pgPromise from 'pg-promise';
import assert from 'assert';

const pgp = pgPromise();
const DATABASE_URL=  "postgresql://fuel:fuel@localhost:5432/fuel_consumption";

const config = { 
	connectionString : DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}

const db = pgp(config);

describe("The FuelConsumption API", function () {

    // set the test time out if needed
    this.timeout(3000); 

    this.beforeEach(async function(){
        await db.none(`delete from fuel_entries`);
        await db.none(`delete from vehicles`);
    });

    it("should be able to add a vehicle with no errors", async function() {

        const fuelConsumption = FuelConsumption(db);

        let vehicles = await fuelConsumption.vehicles();
        await assert.equal(0, vehicles.length);

        const result = await fuelConsumption.addVehicle({
            regNumber : "CY 125-980",
            description : "Grey Toyota Etios"
        });

        assert.equal("success", result.status)

        vehicles = await fuelConsumption.vehicles();
        await assert.equal(1, vehicles.length);
        
    });

    it("should be returning a error if no reg number given when adding a vehicle Vehicle", async function() {
        const fuelConsumption = FuelConsumption(db);

        let vehicles = await fuelConsumption.vehicles();
        await assert.equal(0, vehicles.length);

        const result = await fuelConsumption.addVehicle({
            // regNumber : "CY 125-90",
            description : "Grey Toyota Etios"
        });

        assert.equal("error", result.status)
        assert.equal("regNumber should not be blank", result.message)

        vehicles = await fuelConsumption.vehicles();
        await assert.equal(0, vehicles.length);
    });

    it("should be returning a error if invalid reg number given when adding a vehicle Vehicle", async function() {
        const fuelConsumption = FuelConsumption(db);

        let vehicles = await fuelConsumption.vehicles();
        await assert.equal(0, vehicles.length);

        const result = await fuelConsumption.addVehicle({
            regNumber : "CY 12-90",
            description : "Grey Toyota Etios"
        });

        assert.equal("error", result.status)
        assert.equal("regNumber is invalid - should by CA, CY, CF, CAA followed by 3 numbers - 3 numbers", 
            result.message)

        vehicles = await fuelConsumption.vehicles();
        await assert.equal(0, vehicles.length);
    });

    it("should be able to return a list of vehicles", async function() {
        
        const fuelConsumption = FuelConsumption(db);

        let vehicles = await fuelConsumption.vehicles();
        await assert.equal(0, vehicles.length);

        await fuelConsumption.addVehicle({
            regNumber : "CY 125-905",
            description : "Grey Toyota Etios"
        });
        
        await fuelConsumption.addVehicle({
            regNumber : "CF 125-891",
            description : "White Toyota Etios"
        });
        
        await fuelConsumption.addVehicle({
            regNumber : "CA 275-959",
            description : "Grey VW Polo"
        });

        vehicles = await fuelConsumption.vehicles();
        await assert.equal(3, vehicles.length);

    });

    it("should be able to add fuel for a vehicle", async function() {
        
        const fuelConsumption = FuelConsumption(db);

        const status = await fuelConsumption.addVehicle({
            regNumber : "CY 125-905",
            description : "Grey Toyota Etios"
        });

        const vehicleId = status.id;

        await fuelConsumption.refuel(vehicleId, 23, 560, 45011, true);   // 23.50 per liter
        await fuelConsumption.refuel(vehicleId, 21, 493.5, 45690, true);

        const vehicle = await fuelConsumption.vehicle(vehicleId);
        assert.equal(1053.5, vehicle.total_amount)
        assert.equal(44, vehicle.total_liters)
        
        // the fuel consumption is calculated like this
        // (45690 - 45011) / (23 + 21)
        // 679 kilometers / 44 liters
        // which is 15.43 kilometers for 1 liter
        assert.equal(15.43, vehicle.fuel_consumption);  
        

    });

    it("should be able to add fuel for another vehicle", async function() {
        
        const fuelConsumption = FuelConsumption(db);

        const status = await fuelConsumption.addVehicle({
            regNumber : "CF 354-117",
            description : "White Polo Vivo"
        });

        const vehicleId = status.id;

        await fuelConsumption.refuel(vehicleId, 17, 722, 6130, true);   // R23.50 per liter
        await fuelConsumption.refuel(vehicleId, 21, 493.5, 6708, true);

        const vehicle = await fuelConsumption.vehicle(vehicleId);
        assert.equal(1215.5, vehicle.total_amount)
        assert.equal(38, vehicle.total_liters)
    
        assert.equal(15.21, vehicle.fuel_consumption);  
        
    });

    it("should no fuel consumption if one of the last 2 refuels ws not a full refill", async function() {
        
        const fuelConsumption = FuelConsumption(db);

        const status = await fuelConsumption.addVehicle({
            regNumber : "CY 125-905",
            description : "Grey Toyota Etios"
        });

        const vehicleId = status.id;

        await fuelConsumption.refuel(vehicleId, 23, 560, 45011, false);   // 23.50 per liter
        await fuelConsumption.refuel(vehicleId, 21, 493.5, 45690, true);

        const vehicle = await fuelConsumption.vehicle(vehicleId);
        assert.equal(1053.5, vehicle.total_amount)
        assert.equal(44, vehicle.total_liters)
        
        // the fuel consumption is calculated like this
        assert.equal(null, vehicle.fuel_consumption);  
        
    });

    after(db.$pool.end)

    
});