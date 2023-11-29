import FuelConsumptionAPI from 'FuelConsumptionAPI';

describe("The FuelConsumption API", function () {

    it("should be able to add a vehicle with no errors", async function() {

        const fuelConsumptionAPI = FuelConsumptionAPI();

        let vehicles = await fuelConsumptionAPI.vehicles();
        await assert.equal(0, vehicles.length);

        const result = await fuelConsumptionAPI.addVehicle({
            regNumber : "CY 125-980",
            description : "Grey Toyota Etios"
        });

        assert.equal("success", result.status)

        vehicles = await fuelConsumptionAPI.vehicles();
        await assert.equal(1, vehicles.length);
        
    });

    it("should be returning a error if no reg number given when adding a vehicle Vehicle", async function() {
        const fuelConsumptionAPI = FuelConsumptionAPI();

        let vehicles = await fuelConsumptionAPI.vehicles();
        await assert.equal(0, vehicles.length);

        const status = await fuelConsumptionAPI.addVehicle({
            regNumber : "CY 125-90",
            description : "Grey Toyota Etios"
        });

        assert.equal("error", result.status)
        assert.equal("Invalid reg number", result.message)

        vehicles = await fuelConsumptionAPI.vehicles();
        await assert.equal(0, vehicles.length);
    });

    it("should be able to return a list of vehicles", async function() {
        
        const fuelConsumptionAPI = FuelConsumptionAPI();

        let vehicles = await fuelConsumptionAPI.vehicles();
        await assert.equal(0, vehicles.length);

        await fuelConsumptionAPI.addVehicle({
            regNumber : "CY 125-905",
            description : "Grey Toyota Etios"
        });
        
        await fuelConsumptionAPI.addVehicle({
            regNumber : "CF 125-891",
            description : "White Toyota Etios"
        });
        
        await fuelConsumptionAPI.addVehicle({
            regNumber : "CA 275-959",
            description : "Grey VW Polo"
        });

        vehicles = await fuelConsumptionAPI.vehicles();
        await assert.equal(3, vehicles.length);

    });

    it("should be able to add fuel for a vehicle", async function() {
        
        const status = await fuelConsumptionAPI.addVehicle({
            regNumber : "CY 125-905",
            description : "Grey Toyota Etios"
        });

        const vehicleId = status.id;

        fuelConsumptionAPI.addFuel(vehicleId, 23, 560, 45011, true);   // 23.50 per liter
        fuelConsumptionAPI.addFuel(vehicleId, 21, 493.5, 45690, true);

        const vehicle = fuelConsumptionAPI.getVehicle(vehicleId);

        assert.equal(vehicle.fuel_con)
        

    });

    
});