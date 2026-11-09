import cron from "node-cron";
import Season from "../model/Season.js";
import Offer from "../model/Offer.js";

const startSeasonLifecycleJob = () => {
    cron.schedule("*/5 * * * *", async () => {
      try {
        const now = new Date();

        const scheduledSeasons = await Season.find({
          status: "Scheduled",
          startDate: { $lte: now },
          endDate: { $gt: now },
        }).select("_id");

        if (scheduledSeasons.length > 0) {
          const scheduledIds = scheduledSeasons.map((season) => season._id);

          await Season.updateMany(
            { _id: { $in: scheduledIds } },
            {
              $set: {
                isActive: true,
                status: "Active",
              },
            }
          );

          await Offer.updateMany(
            { season: { $in: scheduledIds } },
            {
              $set: {
                archivedBySeason: false,
              },
            }
          );
        }

        const expiredSeasons = await Season.find({
          endDate: { $lte: now },
          status: { $ne: "Expired" },
        }).select("_id");

        if (expiredSeasons.length > 0) {
          const expiredIds = expiredSeasons.map((season) => season._id);

          await Season.updateMany(
            { _id: { $in: expiredIds } },
            {
              $set: {
                isActive: false,
                status: "Expired",
              },
            }
          );

          await Offer.updateMany(
            { season: { $in: expiredIds } },
            {
              $set: {
                archivedBySeason: true,
              },
            }
          );
        }

        console.log(`[Season Lifecycle Job] Activated: ${scheduledSeasons.length}, Expired: ${expiredSeasons.length}`);
      } catch (error) {
        console.error("[Season Lifecycle Job] Failed:", error.message);
      }
    },
    {
      name: "season-lifecycle-job",
      noOverlap: true,
    }
  );

  console.log("[Season Lifecycle Job] Started");
};

export default startSeasonLifecycleJob;