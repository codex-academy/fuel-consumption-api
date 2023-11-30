# Fuel consumption API

The fuel consumption API keeps track of vehicle fuel usage.

For each vehicle refuel it stores: 

* the `total distance` traveled,
* the `total liters` of fuel entered,
* the `total distance travelled` by the vehicle (odometer reading),

and calculates the `fuel consumption` from the travel distance & total liters entered.

The API will also keep track of the total amount spent on fuel & the total distance travelled by each vehicle.

If the vehcicle was *filled up* to capacity the last *two times* it was refueled the API will return the vehicles `fuel_consumption` in liters per kilometers (`kilometers the vehicle traveled per litre`). If the vehicle wasn't filled up to capacity the last two times it was refueled the API will return `null` for `fuel_consumption`.

> The API can calculate how much kilometers a car can travel per 1 liter of petrol based on the fuel entered and the distance traveled.

## API end points

Description            | URL              | Method
-----------------------|------------------|-------
Add a vehicle          | `/api/vehicle`   | `POST`
Get a specific car     | `/api/vehicle`   | `GET`
Get a list vehicles    | `/api/vehicles`  | `GET`
Refuel a vehicle       | `/api/refuel`    | `POST`

When recording a refuel via the API using `/api/refuel` endpoint you need to specify the `vehicleId`, the amount paid for fuel, how many liters of fuel was bought, and the current `odometer reading` (*distance* in the API) of the vehicle (the total kilometers on the vehicles clock) and if the vehicle was filled up to capacity or not. The fuel consumption algorithm depends on the fact that you are recording details each time the tank is being filled up. It use the difference between the last time you refueled the tank and how much was needed at last refuel to fill up the tank. Which will be the quantity of fuel used in litres.

## What you need to build

Use the API to build:

* A screen that list all the vehicles - showing the `description`, `total distance travelled`, `total fuel spent` & `fuel_consumption` for each car.
* A screen where a new car can be added.
* A screen where a car refuel can be recorded.

## What to do

### Get your own copy

Fork and the clone this repo into your projects folder.

### API setup and testing

* Get the API running locally - configure the Database connection string. Use the `db.sql` file.
* If you can run `npm test` locally successfully it is a good sign that your local database setup is working. (You can use a remote database from your local machine if you want.)
* Get the API tests to run in GitHub actions & add GitHub actions badge to this readme file.

You can make changes to `index.js` if you need to get the connection to your local & deployed databases going.

### Create a front-end

Create a front-end using client-side JavaScript that is using the supplied API building the screens mentioned above. Use `axios` and create your files in the `public` folder. Configure `ExpressJS` accordingly. Add some minimal styling to your app. Functionality that is using the API is more important that elaborate styling.

Look in the `/http/call-the-api.http` file to see the data that is being sent to the API for each call. You can call the API using this file by installing the `REST Client` plugin in VS Code.

If you are *not comfortable* with APIs yet - build a front-end using server-side Handlebars templates using the supplied Factory Function in `fuel-consumption.js`. Add new routes in the `index.js` file as you see fit then.

### Deploy

Deploy your app to render.com.
Create a database for deployment on [ElephantSQL](https://www.elephantsql.com/).
Share the deployment URL when requested.

### Planning

Spend at least 30 minutes planning what you need to do.

* Create a kanban board and share the link with the mentors
* Create some paper prototypes of the screens you are planning to build - add these to your GitHub repository please.
* Please send both of the above for review to `mentors@projectcodex.co`. Or even better ping the mentors for a quick review on Slack
* The link where you need to submit your URLs will be sent to you. Please keep an eye out and submit URLs as requested.

## Deadline

You have until `16h30` on `30 November 2023` to complete this.

Please let us know urgently if you have any loadshedding related issues. Then we will discuss with you how we can accomodate you in this regard.

Please commit your code locally to git by 16h30 even if you can't push to GitHub due to load shedding as we would like a benchmark of your progress at 16h30. Even if you have made alternative arrangements due to loadshedding with us.
