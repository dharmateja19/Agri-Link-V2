import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
import {
    getCrops,
    getFarmerCrops,
    getCropById,
    addCrop,
    updateCrop,
    deleteCrop
} from "../controllers/crop.controller.js";

const router = Router();

router.get('/', authorize(['admin', 'buyer']), getCrops);
router.get('/farmer', authorize(['farmer']), getFarmerCrops);
router.get('/:id', getCropById);
router.post("/addcrop", authorize(['farmer']), addCrop);
router.put("/updatecrop/:id", authorize(['farmer']), updateCrop);
router.delete("/deletecrop/:id", authorize(['farmer']), deleteCrop);

export default router;