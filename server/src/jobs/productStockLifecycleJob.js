import cron from "node-cron";
import Product from "../model/Product.js";

const startProductStockLifecycleJob = () => {
  cron.schedule("*/5 * * * *", async () => {
      try {
        const outOfStockResult = await Product.updateMany(
          {
            stock: 0,
            status: { $ne: "OutOfStock" },
          },
          {
            $set: {
              status: "OutOfStock",
            },
          }
        );

        const availableResult = await Product.updateMany(
          {
            stock: { $gt: 0 },
            status: { $ne: "Available" },
          },
          {
            $set: {
              status: "Available",
            },
          }
        );

        console.log("[Product Stock Lifecycle Job] " + `OutOfStock: ${outOfStockResult.modifiedCount}, ` + `Available: ${availableResult.modifiedCount}`);
      } catch (error) {
        console.error("[Product Stock Lifecycle Job] Failed:", error);
      }
    },
    {
      name: "product-stock-lifecycle-job",
      noOverlap: true,
    }
  );

  console.log("[Product Stock Lifecycle Job] Started");
};

export default startProductStockLifecycleJob;