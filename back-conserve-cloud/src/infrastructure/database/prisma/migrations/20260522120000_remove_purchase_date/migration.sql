-- Remove purchase date from conserves. This field is no longer part of the application.
ALTER TABLE "Conserve" DROP COLUMN "purchaseDate";
