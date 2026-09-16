"use client";
import { useEffect, useState } from "react";
import { getCategories, getBrand, createProduct } from "@/helper/fetchApi";

export default function ProductModal({ onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);

      const [categoriesResult, brandsResult] = await Promise.all([
        getCategories(),
        getBrand(),
      ]);

      setCategories(categoriesResult.categories || []);
      setBrands(brandsResult.brands || []);

      setLoadingOptions(false);
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      return;
    }

    const formData = new FormData();

    formData.append("titleAr", form.titleAr);
    formData.append("titleEn", form.titleEn);

    formData.append("descriptionAr", form.descriptionAr);
    formData.append("descriptionEn", form.descriptionEn);

    formData.append("price", form.price);
    formData.append("stock", form.stock);

    formData.append("category", form.category);
    formData.append("brand", form.brand);

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    setSubmitting(true);

    const result = await createProduct(formData, token);

    setSubmitting(false);

    if (!result.success) {
      console.log(result.message);
      return;
    }

    onSuccess?.(result.product);
    onClose();
  };

  return (
    <div>
      {/* تصميم Claude هنا */}

      <form onSubmit={handleSubmit}>
        <input
          name="titleAr"
          value={form.titleAr}
          onChange={handleChange}
        />

        <input
          name="titleEn"
          value={form.titleEn}
          onChange={handleChange}
        />

        <textarea
          name="descriptionAr"
          value={form.descriptionAr}
          onChange={handleChange}
        />

        <textarea
          name="descriptionEn"
          value={form.descriptionEn}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={loadingOptions}
        >
          <option value="">Select category</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name?.en || category.nameEn}
            </option>
          ))}
        </select>

        <select
          name="brand"
          value={form.brand}
          onChange={handleChange}
          disabled={loadingOptions}
        >
          <option value="">Select brand</option>

          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name?.en || brand.nameEn}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setMainImage(e.target.files?.[0] || null);
          }}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            setImages(Array.from(e.target.files || []).slice(0, 4));
          }}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}