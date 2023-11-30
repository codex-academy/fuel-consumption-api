// vehicleService.js

export default function FuelConsumptionAPI(fuelConsumption) {

    async function addVehicle(req, res) {
        const {description, regNumber} = req.body;
        console.log(req.body);

        const result  = await fuelConsumption.addVehicle({description, regNumber});
        res.json(result);
    }

    async function vehicles(req, res) {

        const vehicles = await fuelConsumption.vehicles()
        res.json({
            status: "success",
            data: vehicles
        });

    }

    async function vehicle(req, res) {

        const {id} = req.query;

        const vehicle = await fuelConsumption.vehicle(id)
        res.json({
            status: "success",
            data: vehicle
        });
    }

    async function refuel(req, res) {
        
        const { vehicleId, liters, amount, distance, filledUp } = req.body;
        console.log(req.body);
        
        const status = await fuelConsumption.refuel(vehicleId, liters, amount, distance, filledUp)
        res.json(status);

    }



    return {
        addVehicle,
        vehicle,
        vehicles,
        refuel
    }

}