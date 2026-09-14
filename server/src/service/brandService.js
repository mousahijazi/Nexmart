import Brand from "../model/Brand.js";

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
    return await Brand.findByIdAndUpdate(
        brandId,
        brandData,
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};

const deleteBrand = async (brandId) => {
    return await Brand.findByIdAndDelete(brandId);
};

export {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};