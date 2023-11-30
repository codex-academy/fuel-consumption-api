// vehicleService.js

export default function FuelConsumptionAPI(db) {

    async function addVehicle({ description, regNumber }) {

        if (!description) {
            return {
                status: "error",
                message: "description should not be blank"
            }
        }
        if (!regNumber) {
            return {
                status: "error",
                message: "regNumber should not be blank"
            }
        }


        const regex = /^(CA|CY|CF|CAA) \d{3}-\d{3}$/;
        if (!regex.test(regNumber)) {
            return {
                status: "error",
                message: "regNumber is invalid - should by CA, CY, CF, CAA followed by 3 numbers - 3 numbers"
            }
        }

        const result = await db.oneOrNone(`insert into vehicles (description, reg_number) values ($1, $2) returning id`, [description, regNumber]);
        return {
            status: "success",
            id: result.id
        };
    }

    async function vehicles() {
        return await db.manyOrNone(`select * from vehicles`);
    }

    async function vehicle(id) {
        return await db.oneOrNone(`select * from vehicles where id = $1`, [id]);
    }

    async function refuel(vehicleId, liters, amount, distance, filled_up) {
        // 
        if (!vehicleId) {
            return {
                status: "error",
                message: "vehicleId not specified"
            }
        }
        if (!liters) {
            return {
                status: "error",
                message: "liters not specified"
            }
        }
        if (!amount) {
            return {
                status: "error",
                message: "amount not specified"
            }
        }

        const result = await db.oneOrNone(`
            insert into fuel_entries(
                vehicle_id,
                liters,
                amount_paid,
                distance,
                full_tank_refill
            ) values (
                $1, $2, $3, $4, $5
            ) returning id
        `, [
            vehicleId,
            liters,
            amount,
            distance,
            filled_up
        ]);

        //
        const results = await db.oneOrNone(`
            select sum(liters) as total_liters, sum(amount_paid) as total_amount 
            from fuel_entries 
            where vehicle_id = $1`, [vehicleId])

        await db.none(`update vehicles set 
            total_amount = $1, 
            total_liters = $2 where id = $3`,
            [results.total_amount, results.total_liters, vehicleId])

        // update fuel consumption

        // // (45690 - 45011) / (23 + 21)
        const lastTwoEntriesForCar = await db.manyOrNone(`
            select * from fuel_entries 
            where vehicle_id = $1
            order by id desc limit 2`, [vehicleId]);

        let fuelConsumption = null;


        if (lastTwoEntriesForCar.length == 2) {

            const last = lastTwoEntriesForCar[0];
            const previous = lastTwoEntriesForCar[1];

            const fullTankRefuel = last.full_tank_refill && previous.full_tank_refill;

            if (fullTankRefuel) {

                const distanceTraveled = last.distance - previous.distance;
                const litersBought = Number(previous.liters) + Number(last.liters);

                fuelConsumption = (distanceTraveled) / litersBought;
                fuelConsumption = fuelConsumption.toFixed(2);

            }
        }

        await db.none(`update vehicles set fuel_consumption = $1 where id = $2`,
            [fuelConsumption, vehicleId]);


        return {
            status: "success",
            id: result.id
        }

    }

    return {
        addVehicle,
        vehicle,
        vehicles,
        refuel
    }

}