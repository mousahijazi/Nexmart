// payment 
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function readApiResponse(response) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || result?.data?.message || "The request failed.");
  }

  return result?.data ?? result;
}

// export async function createBackendPaymentIntent(orderId, token, locale) {
//   const response = await fetch(`${API_URL}/api/v1/payments/intent`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ orderId, locale }),
//     cache: "no-store",
//   });

//   return readApiResponse(response);
// }

// export async function fulfillMoyasarPayment(intent, cardData) {
//   const response = await fetch(`https://api.moyasar.com/v1/payment_intents/${encodeURIComponent(intent.intentId)}/fulfill`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${btoa(`${intent.publishableKey}:`)}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         client_secret: intent.clientSecret,
//         source: {
//           type: "creditcard",
//           name: cardData.name.trim(),
//           number: cardData.number.replace(/\s/g, ""),
//           month: cardData.month,
//           year: cardData.year,
//           cvc: cardData.cvc,
//         },
//       }),
//     }
//   );

//   const result = await response.json().catch(() => null);

//   if (!response.ok) {
//     throw new Error(result?.message || "Moyasar could not process this card.");
//   }

//   return result;
// }

export async function createMoyasarPayment(order, cardData, locale) {
  const publishableKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Moyasar publishable key is not configured.");
  }

  if (!order?._id || !Number.isFinite(order.totalPrice)) {
    throw new Error("Invalid order details.");
  }

  const amount = Math.round(order.totalPrice * 100);

  const response = await fetch("https://api.moyasar.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${publishableKey}:`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "SAR",
      description: `Nexmart Order ${order._id}`,
      callback_url: `${window.location.origin}/${locale}/checkout?mode=pay&order_id=${order._id}`,
      source: {
        type: "creditcard",
        name: cardData.name.trim(),
        number: cardData.number.replace(/\s/g, ""),
        month: cardData.month,
        year: cardData.year,
        cvc: cardData.cvc,
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Moyasar could not process this payment."
    );
  }

  return result;
}

export async function verifyBackendPayment(paymentId, orderId, token) {
  const response = await fetch(`${API_URL}/api/v1/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentId, orderId }),
    cache: "no-store",
  });

  return readApiResponse(response);
}
