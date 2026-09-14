import {createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand} from "../service/brandService.js";
import AppError from "../utils/AppError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";
import { formatBrandData } from "../utils/formatBrandData.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getAllBrandsController = async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const result = await getAllBrands({page: Number(page), limit: Number(limit),});

    res.status(200).json({
        status: SUCCESS,
        data: result,
    });
};

const getBrandByIdController = asyncHandler(
    async (req, res, next) => {
        const brand = await getBrandById(req.params.brandId);

        if (!brand) {
            return next(AppError.create("Brand not found", 404, FAIL));
        }

        res.status(200).json({
            status: SUCCESS,
            data: {
                brand,
            },
        });
    }
);

const createBrandController = async (req, res) => {
    const brandData = formatBrandData(req);
    const brand = await createBrand(brandData);

    res.status(201).json({
        status: SUCCESS,
        data: {
            brand,
        },
    });
};

const updateBrandController = asyncHandler(
    async (req, res, next) => {
        const brand = await updateBrand(req.params.brandId, req.body);

        if (!brand) {
            return next(AppError.create("Brand not found", 404, FAIL));
        }

        res.status(200).json({
            status: SUCCESS,
            data: {
                brand,
            },
        });
    }
);

const deleteBrandController = asyncHandler(
    async (req, res, next) => {
        const brand = await deleteBrand(req.params.brandId);

        if (!brand) {
            return next(AppError.create("Brand not found", 404, FAIL));
        }

        res.status(200).json({
            status: SUCCESS,
            data: {
                brand,
            },
        });
    }
);

export {
    createBrandController,
    getAllBrandsController,
    getBrandByIdController,
    updateBrandController,
    deleteBrandController,
};