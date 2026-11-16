import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import startOfferExpirationJob from "./jobs/offerExpirationJob.js";
import startSeasonLifecycleJob from "./jobs/seasonLifecycleJob.js";
import startProductStockLifecycleJob from "./jobs/productStockLifecycleJob.js";
import startOrderExpirationJob from "./jobs/orderExpirationJob.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    
    app.listen(PORT, () => {
      console.log(`Nexmart API running on port ${PORT}`);

      startSeasonLifecycleJob();
      startOfferExpirationJob();
      startProductStockLifecycleJob();
      startOrderExpirationJob();
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });