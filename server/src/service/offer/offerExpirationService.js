import Offer from "../../model/Offer.js";

const updateOffersStatus = async () => {
  const now = new Date();

  const expireResult = await Offer.updateMany(
    {
      endDate: { $lte: now },
      status: { $ne: "Expired" },
    },
    {
      $set: {
        isActive: false,
        status: "Expired",
      },
    }
  );

  const activateResult = await Offer.updateMany(
    {
      status: "Scheduled",
      isActive: false,
      archivedBySeason: { $ne: true },
      startDate: { $lte: now },
      endDate: { $gt: now },
    },
    {
      $set: {
        isActive: true,
        status: "Active",
      },
    }
  );

  return {
    expiredCount: expireResult.modifiedCount,
    activatedCount: activateResult.modifiedCount,
  };
};

export {
  updateOffersStatus,
};