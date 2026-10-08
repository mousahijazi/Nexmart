import Brand from "../model/Brand.js";
import Product from "../model/Product.js";
import { deleteFile } from "../middlewares/fileService.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { userRoles } from "../utils/userRoles.js";

const getAllBrands = async ({page = 1, limit = 6}, userRole) => {
    const skip = (page - 1) * limit;
    const filter = {};

    if (userRole !== userRoles.ADMIN) {
      filter.isActive = true;
    }

    const brands = await Brand.find(filter, {"__v": false}).populate("productsCount").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalBrands = await Brand.countDocuments(filter);

    return {
        brands,
        total: totalBrands,
        page: page,
        limit: limit,
        skip: skip,
        totalPages: Math.ceil(totalBrands / limit),
    };
};

const getBrandById = async (brandId, userRole) => {
  const filter = {
    "_id": brandId
  };

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
  }

  return await Brand.findOne(filter).populate("productsCount");
};

const createBrand = async (brandData) => {
  return await Brand.create(brandData);
};

const updateBrand = async (brandId, brandData) => {
  const oldBrand = await Brand.findById(brandId);

  if (!oldBrand) {
    return null;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    brandId,
    { $set: brandData },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).populate("productsCount");

  if (brandData.logo && oldBrand.logo) {
    await deleteFile(oldBrand.logo);
  }

  return updatedBrand;
};

const updateBrandStatus = async (brandId, isActive) => {
  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw AppError.create("Brand not found", 404, FAIL);
  }

  brand.isActive = isActive;

  await brand.save();

  if (!isActive) {
    await Product.updateMany(
      { brand: brandId },
      {
        $set: {
          archivedByBrand: true,
        },
      }
    );
  }

  if (isActive) {
    await Product.updateMany(
      { brand: brandId },
      {
        $set: {
          archivedByBrand: false,
        },
      }
    );
  }

  return brand;
};

const deleteBrand = async (brandId) => {
  const brand = await Brand.findById(brandId);

  if (!brand) {
    return null;
  }

  await Brand.findByIdAndDelete(brandId);

  if (brand.logo) {
    await deleteFile(brand.logo);
  }

  return brand;
};

export {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    updateBrandStatus,
    deleteBrand,
};