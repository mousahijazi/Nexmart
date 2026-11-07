import Brand from "../model/Brand.js";
import Product from "../model/Product.js";

const findAllBrands = async ({ filter, page, limit }) => {
  return Brand.find(filter, { __v: false })
    .populate("productsCount").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
};

const countAllBrands = async (filter = {}) => {
  return Brand.countDocuments(filter);
};

const findBrandById = async (filter) => {
  return Brand.findOne(filter).populate("productsCount");
};

const createBrand = async (brandData) => {
  return Brand.create(brandData);
};

const updateBrandById = async (brandId, brandData) => {
  return Brand.findByIdAndUpdate(
    brandId,
    { $set: brandData },
    {
      new: true,
      runValidators: true,
    }
  ).populate("productsCount");
};

const deleteBrandById = async (brandId) => {
  return Brand.findByIdAndDelete(brandId);
};

const updateBrandProductsArchiveStatus = async (brandId, isArchived) => {
  return Product.updateMany(
    { brand: brandId },
    {
      $set: {
        archivedByBrand: isArchived,
      },
    }
  );
};

export {
  findAllBrands,
  countAllBrands,
  findBrandById,
  createBrand,
  updateBrandById,
  deleteBrandById,
  updateBrandProductsArchiveStatus,
};