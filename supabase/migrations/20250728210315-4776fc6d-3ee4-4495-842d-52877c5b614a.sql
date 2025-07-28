-- Grant admin role to the current user
INSERT INTO user_roles (user_id, role) 
VALUES ('028aee79-3087-41a5-9d5d-e9bb7dd54d0b', 'admin');

-- Also grant admin role to the admin@tradewithmrk.com user
INSERT INTO user_roles (user_id, role) 
VALUES ('2e6d8d27-c825-4214-bff6-bfbc9dbabdb1', 'admin');