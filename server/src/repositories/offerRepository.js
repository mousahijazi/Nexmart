import Offer from "../model/Offer.js";

const createOffer = async (offerData) => {
    return await Offer.create(offerData);
};

const getOfferById = async (offerId) => {
    return await Offer.findById(offerId)
        .populate("season").populate("category").populate("targets.product");
};

const getAllOffers = async (filter = {}) => {
    return await Offer.find(filter)
        .populate("season").populate("category").populate("targets.product").sort({ createdAt: -1 });
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
        .populate("season").populate("category").populate("targets.product");
};

const deleteOffer = async (offerId) => {
    return await Offer.findByIdAndDelete(offerId);
};

// todo 
const findActiveProductOffersByProduct = async (productId) => {
    return await Offer.find({
        targetType: "product",
        isActive: true,
        "targets.product": productId,
    });
};

const findOverlappingProductOffersByProduct = async (productId, startDate, endDate, excludeOfferId = null) => {
    const filter = {
        targetType: "product",
        isActive: true,
        "targets.product": productId,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
    };

    if (excludeOfferId) {
        filter._id = { $ne: excludeOfferId };
    }

    return await Offer.find(filter);
};

const findOverlappingCategoryOffersByCategory = async (categoryId, startDate, endDate, excludeOfferId = null) => {
    const filter = {
        targetType: "category",
        isActive: true,
        category: categoryId,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
    };

    if (excludeOfferId) {
        filter._id = { $ne: excludeOfferId };
    }

    return await Offer.find(filter);
};

const findActiveProductOffersByProducts = async (productIds) => {
    return await Offer.find({
        targetType: "product",
        isActive: true,
        "targets.product": { $in: productIds },
    });
};

const findActiveCategoryOffersByCategory = async (categoryId) => {
    return await Offer.find({
        targetType: "category",
        category: categoryId,
        isActive: true,
    });
};

const removeProductTarget = async (offerId, productId) => {
    const offer = await Offer.findById(offerId);

    if (!offer) {
        return null;
    }

    offer.targets = offer.targets.filter((target) => String(target.product) !== String(productId));

    if (offer.targets.length === 0) {
        offer.isActive = false;
    }

    await offer.save();

    return offer;
};

const markOverrideApplied = async (offerId) => {
    return await Offer.findByIdAndUpdate(
        offerId, { overrideApplied: true }, { new: true, }
    );
};

export default {
    createOffer,
    getOfferById,
    getAllOffers,
    updateOffer,
    deleteOffer,

    findActiveProductOffersByProduct,
    findActiveProductOffersByProducts,
    findActiveCategoryOffersByCategory,
    removeProductTarget,
    
    findOverlappingProductOffersByProduct,
    findOverlappingCategoryOffersByCategory,
    markOverrideApplied,
};