export const calculateDiscountAmount = (price, offer) => {
  if (offer.type === "percentage") {
    return (price * offer.discount) / 100;
  }

  if (offer.type === "fixed") {
    return Math.min(offer.discount, price);
  }

  return 0;
};

export const calculateFinalPrice = (price, discountAmount) => {
  return Math.max(price - discountAmount, 0);
};

export const isOfferValidNow = (offer, now = new Date()) => {
  if (!offer) {
    return false;
  }
  return offer.isActive && offer.startDate <= now && offer.endDate > now;
};