UPDATE
  "User"
SET
  name = CONCAT(firstname, ' ', lastname);

-- Drop the "firstname" and "lastname" columns
ALTER TABLE
  "User" DROP COLUMN firstname,
  DROP COLUMN lastname;