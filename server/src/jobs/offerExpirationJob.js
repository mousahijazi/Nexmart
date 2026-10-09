import cron from "node-cron";
import { updateOffersStatus } from "../service/offer/offerExpirationService.js";

const startOfferExpirationJob = () => {
  cron.schedule("0 * * * *", async () => {
      try {
        const { deactivatedCount, activatedCount } = await updateOffersStatus();

        console.log(`[Offer Expiration Job] Deactivated ${deactivatedCount}, Activated: ${activatedCount}`);
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