-- privilege limits, first check if the user already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'skyroute_user') THEN
    CREATE ROLE skyroute_user LOGIN PASSWORD 'password';
  END IF;
END
$$;

ALTER ROLE skyroute_user SET search_path TO public;

-- grant usage
GRANT USAGE ON SCHEMA public TO skyroute_user;

-- grant access to the tables in create.sql
GRANT SELECT, INSERT ON flight TO skyroute_user;
GRANT SELECT ON airport TO skyroute_user;

-- revoke public access
REVOKE ALL ON flight FROM PUBLIC;
REVOKE ALL ON airport FROM PUBLIC;
