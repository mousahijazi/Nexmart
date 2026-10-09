import Offer from "../../model/Offer.js";

const updateOffersStatus = async () => {
  const now = new Date();

  const deactivateResult = await Offer.updateMany(
    {
      isActive: true,
      endDate: { $lte: now },
    },
    {
      $set: { isActive: false },
    }
  );

  const activateResult = await Offer.updateMany(
    {
      isActive: false,
      startDate: { $lte: now },
      endDate: { $gt: now },
    },
    {
      $set: { isActive: true },
    }
  );

  return {
    deactivatedCount: deactivateResult.modifiedCount,
    activatedCount: activateResult.modifiedCount,
  };
};

export {
  updateOffersStatus,
};