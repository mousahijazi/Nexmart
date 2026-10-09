import cron from "node-cron";
import { deactivateExpiredOffers } from "../service/offer/offerExpirationService.js";

const startOfferExpirationJob = () => {
  cron.schedule("0 * * * *", async () => {
      try {
        const modifiedCount = await deactivateExpiredOffers();

        console.log(`[Offer Expiration Job] Deactivated ${modifiedCount} expired offers`);
      } catch (error) {
        console.error("[Offer Expiration Job] Failed:", error.message);
      }
    },
    {
      name: "offer-expiration-job",
      noOverlap: true,
    }
  );

  console.log("[Offer Expiration Job] Started");
};

export default startOfferExpirationJob;