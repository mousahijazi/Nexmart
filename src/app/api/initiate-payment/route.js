export async function POST(request) {
    try {
        const { paymentId, orderId } = await request.json();

        if (!paymentId || !orderId) {
            return Response.json({ success: false, message: "Missing required parameters" }, { status: 400 });
        }

        const response = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + Buffer.from(process.env.MOYASAR_SECRET_KEY + ":").toString("base64"),
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return Response.json({ success: false, message: data.message || "Failed to fetch payment details" }, { status: response.status });
        }

        const expectedOrderRef = orderId.slice(0, 8);
        if (!data.description || !data.description.includes(expectedOrderRef)) {
            return Response.json({ success: false, message: "Payment does not match this order" }, { status: 400 });
        }

        return Response.json({ success: true, payment: data });
    } catch (error) {
        console.error("API Error:", error);
        return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}