import OrderItem from "../model/OrderItem.js";

const createOrderItems = async (items, session) => {
    return OrderItem.insertMany(items, { session });
};

const findItemsByOrderId = async (orderId, session) => {
    return OrderItem.find({ order: orderId })
        .sort({ createdAt: 1, _id: 1 })
        .session(session || null)
        .lean();
};

const findOrderItemsPage = async (orderId, { page, limit }) => {
    const skip = (page - 1) * limit;

    return OrderItem.find({ order: orderId })
        .sort({ createdAt: 1, _id: 1 }).skip(skip).limit(limit).lean();
};

const countOrderItemsByOrderId = async (orderId) => {
    return OrderItem.countDocuments({ order: orderId });
};

const deleteItemsByOrderId = async (orderId, session) => {
    return OrderItem.deleteMany({ order: orderId }, { session });
};

export {
    createOrderItems,
    findItemsByOrderId,
    findOrderItemsPage,
    countOrderItemsByOrderId,
    deleteItemsByOrderId,
};
