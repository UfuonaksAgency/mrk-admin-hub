-- Update the check constraint to allow all the uppercase resource types we want to support
ALTER TABLE free_resources DROP CONSTRAINT IF EXISTS free_resources_type_check;

-- Add new constraint with all supported types in uppercase
ALTER TABLE free_resources ADD CONSTRAINT free_resources_type_check 
  CHECK (type IN ('PDF', 'VIDEO', 'TOOL', 'WORD', 'SPREADSHEET', 'IMAGE', 'APK'));