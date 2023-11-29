CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    reg_number TEXT NOT NULL UNIQUE
);

CREATE TABLE fuel_entries (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    distance NUMERIC NOT NULL,
    fuel_amount NUMERIC NOT NULL,
    amount_paid NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
