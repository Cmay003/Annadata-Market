-- Drop stale check constraints that were created when enum was ORDINAL
-- Now enum uses STRING type so these constraints are invalid

ALTER TABLE seller DROP CHECK seller_chk_1;
ALTER TABLE seller DROP CHECK seller_chk_2;

-- Also drop other stale ordinal constraints from related tables
ALTER TABLE `user` DROP CHECK user_chk_1;

-- Verify constraints removed
SELECT CONSTRAINT_NAME, CHECK_CLAUSE 
FROM information_schema.CHECK_CONSTRAINTS 
WHERE CONSTRAINT_SCHEMA = 'zosh';
