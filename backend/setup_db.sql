-- Setup script for SmartLearn database

-- Create user if not exists
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'smartlearn') THEN
      CREATE USER smartlearn WITH PASSWORD 'infobloom';
   END IF;
END
$$;

-- Create database if not exists
SELECT 'CREATE DATABASE smartlearn OWNER smartlearn'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartlearn')\gexec

-- Connect to smartlearn database
\c smartlearn

-- Grant permissions
GRANT ALL ON SCHEMA public TO smartlearn;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smartlearn;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smartlearn;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO smartlearn;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO smartlearn;
