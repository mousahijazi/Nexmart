import Offer from "../../model/Offer.js";

const deactivateExpiredOffers = async () => {
  const now = new Date();

  const result = await Offer.updateMany(
    {
      isActive: true,
      endDate: { $lte: now },
    },
    {
      $set: {
        isActive: false,
      },
    }
  );

  return result.modifiedCount;
};

export {
  deactivateExpiredOffers,
};