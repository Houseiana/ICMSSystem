-- AlterTable: Add includesBreakfast to TripHotelRoom
ALTER TABLE "TripHotelRoom" ADD COLUMN "includesBreakfast" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add flight enhancement fields to TripFlight
ALTER TABLE "TripFlight" ADD COLUMN "aircraftModel" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "specialRequests" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "tripType" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "fareTermsConditions" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "changeStatus" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "changeDate" TIMESTAMP(3);
ALTER TABLE "TripFlight" ADD COLUMN "changePrice" DOUBLE PRECISION;
ALTER TABLE "TripFlight" ADD COLUMN "changedDepartureDate" TIMESTAMP(3);
ALTER TABLE "TripFlight" ADD COLUMN "changedDepartureTime" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "changedArrivalDate" TIMESTAMP(3);
ALTER TABLE "TripFlight" ADD COLUMN "changedArrivalTime" TEXT;
ALTER TABLE "TripFlight" ADD COLUMN "changeLeg" TEXT;
