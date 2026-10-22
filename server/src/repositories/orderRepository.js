import Order from "../model/Order.js";

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

export {
    createOrder,
    findOrderById,
    findUserOrderById,
    findOrdersByUser,
    countUserOrders,
    updateOrderById,
};
