-- Clear all test data from consultations and crypto_payments tables
-- This resets the database to a clean state for production

-- Clear crypto payments test data
DELETE FROM crypto_payments;

-- Clear consultations test data  
DELETE FROM consultations;

-- Clear analytics events test data
DELETE FROM analytics_events;

-- Clear resource downloads test data
DELETE FROM resource_downloads;