"use client"
import { useState, useEffect } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { getUserOrders } from "@/helper/fetchApi";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { OrderDashboardButton } from "@/index";

const ORDERS_PER_PAGE = 2;

export default function OrderDashboardData() {
    const { user } = useUserContext();
    const {setCurrentOrderId} = useCheckoutContext();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        getUserOrders(user.id)
        .then((result) => {
            setOrders(result.orders);
            setLoading(false);
        });
    }, [user]);

    const toggleOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const goToPayment = (orderId) => {
        setCurrentOrderId(orderId);
        router.push("/checkout?mode=pay");
    };

    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    if (loading) {
        return <p className="mt-8 text-center text-gray-500">Loading orders...</p>;
    }

    if (!user) {
        return <p className="mt-8 text-center text-gray-500">Please log in to view this page.</p>;
    }

    if (orders.length === 0) {
        return <p className="mt-8 text-center text-gray-500">No orders yet.</p>;
    }

    return (
        <div className="mt-8 flex flex-col gap-5">
            {paginatedOrders.map((order) => {
                const isPending = order.payment_status === "pending";
                const isFailed = order.payment_status === "failed";
                const isPaid = order.payment_status === "paid";

                return (
                    <div key={order.id} className={`rounded-2xl overflow-hidden ${isFailed
                            ? "bg-red-200 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                            : "bg-[#fefefe] min-[480px]:bg-[#F7F4EF] dark:bg-[#1F1B17]"}`}>
                        <button
                            onClick={() => {
                                isPaid 
                                    ? toggleOrder(order.id) 
                                    : goToPayment(order.id)
                            }}
                            className="sm:w-full flex max-sm:flex-col sm:items-center sm:justify-between p-3.5 sm:p-5 cursor-pointer gap-3"
                        >
                            <div className="text-left">
                                <p className="font-semibold text-[#5B3A21] dark:text-[#F5EBE6]">
                                    Order #{order.id.slice(0, 8)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 max-sm:mt-1">
                                    {new Date(order.created_at).toLocaleDateString()}
                                    {isFailed && " — Payment failed"}
                                    {isPending && " — Awaiting payment"}
                                    {isPaid && " — Payment successful"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isPaid 
                                    ? <>
                                        <span className="font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
                                            ${order.total_price.toFixed(2)}
                                        </span>
                                        <ChevronDown className={`transition-transform duration-300 ${expandedOrders[order.id] ? "rotate-180" : ""}`} />
                                      </>
                                    : <div className={`px-4 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                                            isFailed ? "bg-red-600 hover:bg-red-700" : "bg-[#5B3A21] hover:opacity-90"
                                        }`}>
                                            {isFailed ? "Resolve & Retry" : "Complete Payment"}
                                        </div>
                                }
                            </div>
                        </button>

                        {isPaid && expandedOrders[order.id] && (
                            <div className="border-t border-gray-200 dark:border-zinc-700 p-5 flex flex-col gap-4">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex max-sm:flex-col gap-1 justify-between text-sm text-gray-600 dark:text-zinc-300">
                                        <span>{item.product_title} × {item.quantity}</span>
                                        <span className="text-[#5B3A21] font-semibold">${item.subtotal}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    )
            })}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-2">
                    <OrderDashboardButton 
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        label="Previous page"
                        icon={<ChevronRight />} 
                    />
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                        {currentPage} / {totalPages}
                    </span>
                    <OrderDashboardButton 
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        label="Next page"
                        icon={<ChevronLeft />} 
                    />
                </div>
            )}
        </div>
    );
}