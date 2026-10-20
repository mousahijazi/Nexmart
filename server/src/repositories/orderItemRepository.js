import OrderItem from "../model/OrderItem.js";

const createOrderItems = async (items, session) => {
    return OrderItem.insertMany(items, { session });
};

const findItemsByOrderId = async (orderId, session) => {
    return OrderItem.find({ order: orderId })
        .sort({ createdAt: 1 }).session(session || null).lean();
};

const deleteItemsByOrderId = async (orderId, session) => {
    return OrderItem.deleteMany({ order: orderId }, { session });
};

export {
    createOrderItems,
    findItemsByOrderId,
    deleteItemsByOrderId,
};
