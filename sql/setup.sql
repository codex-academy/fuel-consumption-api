create database fuel_consumption;
create role fuel login password 'fuel';
grant all privileges on database fuel_consumption to fuel;