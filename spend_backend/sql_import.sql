-- Create the database
CREATE DATABASE IF NOT EXISTS spend_analysis;

-- Create individual CSV files for each statements
CREATE TABLE IF NOT EXISTS axis_statements (date varchar, description varchar, debit numeric, credit numeric, balance numeric);

CREATE TABLE IF NOT EXISTS hdfc_statements (date varchar, description varchar, debit numeric, credit numeric, balance numeric);

CREATE TABLE IF NOT EXISTS icici_statements (date varchar, description varchar, debit numeric, credit numeric, balance numeric);

-- Create a table for the combined statements
CREATE TABLE IF NOT EXISTS statements (date date, description varchar, debit numeric, credit numeric, balance numeric, bank_name varchar);

-- Import data into the individual data tables
COPY axis_statements FROM './axis_statements.csv' WITH (FORMAT csv);

COPY hdfc_statements FROM './hdfc_statements.csv' WITH (FORMAT csv);

COPY icici_statements FROM './icici_statements.csv' WITH (FORMAT csv);

-- Add date to the combined data table
INSERT INTO statements VALUES
(
    SELECT to_date(date), description, debit, credit, balance, 'AXIS' as bank_name from axis_statements
    UNION ALL
    SELECT to_date(date), description, debit, credit, balance, 'HDFC' as bank_name from hdfc_statements
    UNION ALL
    SELECT to_date(date), description, debit, credit, balance, 'ICICI' as bank_name from icici_statements
);