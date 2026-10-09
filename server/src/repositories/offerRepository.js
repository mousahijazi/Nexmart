import Offer from "../model/Offer.js";

const createOffer = async (offerData) => {
  return await Offer.create(offerData);
};

const getAllOffers = async ({skip, limit}) => {
  const offers = await Offer.find({}, {"__v": false})
    .populate("product").populate("category").populate("season").sort({ createdAt: -1 }).skip(skip).limit(limit);

  const totaloffers = await Offer.countDocuments();

  return {
    offers,
    totaloffers,
  }
};

const getOfferById = async (offerId) => {
  return await Offer.findById(offerId, {"__v": false})
    .populate("product").populate("category").populate("season");
};

const updateOffer = async (offerId, offerData) => {
  return await Offer.findByIdAndUpdate(
    offerId,
    offerData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).populate("product").populate("category").populate("season");
};

const deleteOffer = async (offerId) => {
  return await Offer.findByIdAndDelete(offerId);
};

export {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};