"use client";
import { ChevronDown } from "lucide-react";

export default function ProductForm({ form, categories, brands, locale, loadingOptions, handleChange, inputClass, labelClass, sectionClass,}) {
  return (
    <div className={sectionClass}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Title (English)
            </label>

            <input
              type="text"
              name="titleEn"
              value={form.titleEn}
              onChange={handleChange}
              placeholder="Product name"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              العنوان (عربي)
            </label>

            <input
              type="text"
              name="titleAr"
              value={form.titleAr}
              onChange={handleChange}
              placeholder="اسم المنتج"
              dir="rtl"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Description (English)
            </label>

            <textarea
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={handleChange}
              rows={4}
              placeholder="Product description"
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>
              الوصف (عربي)
            </label>

            <textarea
              name="descriptionAr"
              value={form.descriptionAr}
              onChange={handleChange}
              rows={4}
              placeholder="وصف المنتج"
              dir="rtl"
              required
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Price
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.1"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Category
            </label>

            <div className="relative">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loadingOptions}
                required
                className={`${inputClass} appearance-none pr-8 disabled:opacity-60`}
              >
                <option value="">
                  {loadingOptions ? "Loading..." : "Select category"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name?.[locale] || category.name?.en || category.nameEn || category.name?.ar || category.nameAr}
                  </option>
                ))}
              </select>

              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Brand
            </label>

            <div className="relative">
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                disabled={loadingOptions}
                required
                className={`${inputClass} appearance-none pr-8 disabled:opacity-60`}
              >
                <option value="">
                  {loadingOptions ? "Loading..." : "Select brand"}
                </option>

                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name?.[locale] || brand.name?.en || brand.nameEn || brand.name?.ar || brand.nameAr}
                  </option>
                ))}
              </select>

              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}