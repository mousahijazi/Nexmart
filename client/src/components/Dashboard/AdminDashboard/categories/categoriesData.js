export const categoriesData = [
  {
    id: "cat-1",
    name: {
      en: "Oud & Luxury Perfumes",
      ar: "عطور العود والفخامة",
    },
    image: "/images/categories/oud.jpg",
    parent: null,
    productsCount: 4820,
    status: "Active",
    expanded: true,
    products: [
      {
        id: "p-1",
        name: "Royal Taif Rose EDP",
        price: 890,
        image: "/images/products/perfume-1.jpg",
        stock: 184,
      },
      {
        id: "p-2",
        name: "Cambodian Agarwood",
        price: 1250,
        image: "/images/products/perfume-2.jpg",
        stock: 92,
      },
      {
        id: "p-3",
        name: "Majestic Amber & White",
        price: 640,
        image: "/images/products/perfume-3.jpg",
        stock: 310,
      },
      {
        id: "p-4",
        name: "Heritage Ceramic Burner",
        price: 380,
        image: "/images/products/perfume-4.jpg",
        stock: 45,
      },
    ],
  },

  {
    id: "cat-2",
    name: {
      en: "Gourmet Dates & Confectionery",
      ar: "تمور فاخرة وحلويات",
    },
    image: "/images/categories/dates.jpg",
    parent: "Gourmet Food & Pantry",
    productsCount: 1240,
    status: "Active",
    products: [],
  },

  {
    id: "cat-3",
    name: {
      en: "Handcrafted Leather Goods",
      ar: "مصنوعات جلدية يدوية",
    },
    image: "/images/categories/leather.jpg",
    parent: "Accessories & Leather",
    productsCount: 760,
    status: "Active",
    products: [],
  },

  {
    id: "cat-4",
    name: {
      en: "Artisanal Coffee & Dallah",
      ar: "القهوة العربية والدلال",
    },
    image: "/images/categories/coffee.jpg",
    parent: "Dining & Kitchenware",
    productsCount: 512,
    status: "Active",
    products: [],
  },

  {
    id: "cat-5",
    name: {
      en: "Haute Couture Abayas & Silk Robes",
      ar: "عبايات راقية وأثواب حريرية",
    },
    image: "/images/categories/abaya.jpg",
    parent: "Modest Wear",
    productsCount: 1890,
    status: "Active",
    products: [],
  },

  {
    id: "cat-6",
    name: {
      en: "Seasonal Gifts & Eid Hampers",
      ar: "هدايا الموسم وهدايا العيد",
    },
    image: null,
    parent: "Seasonal Campaigns",
    productsCount: 0,
    status: "Draft",
    products: [],
  },
];

export const categoryStats = {
  total: 48,
  withProducts: 42,
  empty: 6,
  uncategorized: 14,
};