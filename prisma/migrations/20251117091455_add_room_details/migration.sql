-- AlterTable
ALTER TABLE "TripHotelRoom" DROP COLUMN "roomCategory",
DROP COLUMN "numberOfRooms",
ADD COLUMN     "unitCategory" TEXT NOT NULL DEFAULT 'Room',
ADD COLUMN     "roomNumber" TEXT,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "hasPantry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "guestNumbers" INTEGER,
ADD COLUMN     "bedType" TEXT,
ADD COLUMN     "connectedToRoom" TEXT;

-- Update existing records to have unitCategory set to 'Room' for any that were defaulted
UPDATE "TripHotelRoom" SET "unitCategory" = 'Room' WHERE "unitCategory" = 'Room';
