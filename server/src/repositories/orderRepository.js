import Order from "../model/Order.js";

const findAllOrders = async ({ filter, page, limit }) => {
    return Order.find(filter)
        .sort({ createdAt: -1 }).populate("totalItems").skip((page - 1) * limit).limit(limit).lean();
};

const countAllOrders = async (filter = {}) => {
    return Order.countDocuments(filter);
};

const countOrdersByStatus = async (field, value) => {
    return Order.countDocuments({ [field]: value });
};

const createOrder = async (data, session) => {
    const [order] = await Order.create([data], { session });
    return order;
};

const findOrderById = async (orderId, session) => {
    return Order.findById(orderId).populate("totalItems").session(session || null);
};

const findUserOrderById = async (orderId, userId, session) => {
    return Order.findOne({ _id: orderId, user: userId }).populate("totalItems").session(session || null);
};

const findOrdersByUser = async (userId, { page, limit }) => {
    return Order.find({ user: userId })
        .sort({ createdAt: -1 }).populate("totalItems").skip((page - 1) * limit).limit(limit).lean();
};

const countUserOrders = async (userId) => {
    return Order.countDocuments({ user: userId });
};

const updateOrderById = async (orderId, update, session) => {
    return Order.findByIdAndUpdate(
        orderId,
        update,
        {
            new: true,
            runValidators: true,
            session,
        }
    ).populate("totalItems");
};

const deleteOrderById = async (orderId, session) => {
    return Order.findByIdAndDelete(orderId).session(session || null);
};

export {
    createOrder,
    findOrderById,
    findUserOrderById,
    findOrdersByUser,
    countUserOrders,
    updateOrderById,
    findAllOrders,
    countAllOrders,
    countOrdersByStatus,
    deleteOrderById,
};
