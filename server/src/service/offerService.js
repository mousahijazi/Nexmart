import { createOffer as createOfferRepository, getAllOffers as getAllOffersRepository, getOfferById as getOfferByIdRepository, updateOffer as updateOfferRepository, deleteOffer as deleteOfferRepository } from "../repositories/offerRepository.js";

const createOffer = async (offerData) => {
  return await createOfferRepository(offerData);
};

const getAllOffers = async ({page = 1, limit = 6}) => {
  const skip = (page - 1) * limit;
  const offers = await getAllOffersRepository({skip, limit});
  
  return {
      offers: offers.offers,
      total: offers.totaloffers,
      page: page,
      limit: limit,
      skip: skip,
      totalPages: Math.ceil(offers.totaloffers / limit),
  };
};

const getOfferById = async (offerId) => {
  return await getOfferByIdRepository(offerId);
};

const updateOffer = async (offerId, offerData) => {
  return await updateOfferRepository(offerId, offerData);
};

const deleteOffer = async (offerId) => {
  return await deleteOfferRepository(offerId);
};

export {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};