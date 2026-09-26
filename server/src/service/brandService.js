import Brand from "../model/Brand.js";
import { deleteFile } from "../middlewares/fileService.js";

const getAllBrands = async ({page = 1,limit = 6}) => {
    const skip = (page - 1) * limit;

    const brands = await Brand.find().skip(skip).limit(limit);
    const totalBrands = await Brand.countDocuments();

    return {
        brands,
        total: totalBrands,
        page: page,
        limit: limit,
        skip: skip,
        totalPages: Math.ceil(totalBrands / limit),
    };
};

const getBrandById = async (brandId) => {
    return await Brand.findById(brandId);
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
      new: true,
      runValidators: true,
    }
  );

  if (brandData.logo && oldBrand.logo) {
    await deleteFile(oldBrand.logo);
  }

  return updatedBrand;
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
    deleteBrand,
};