import Offer from "../model/Offer.js";

const createOffer = async (offerData) => {
    return await Offer.create(offerData);
};

const getOfferById = async (offerId) => {
    return await Offer.findById(offerId)
        .populate("season")
        .populate("category")
        .populate("targets.product");
};

const getAllOffers = async (filter = {}) => {
    return await Offer.find(filter)
        .populate("season")
        .populate("category")
        .populate("targets.product")
        .sort({ createdAt: -1 });
};

const updateOffer = async (offerId, updateData) => {
    return await Offer.findByIdAndUpdate(
        offerId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("season")
        .populate("category")
        .populate("targets.product");
};

const deleteOffer = async (offerId) => {
    return await Offer.findByIdAndDelete(offerId);
};

export default {
    createOffer,
    getOfferById,
    getAllOffers,
    updateOffer,
    deleteOffer,
};