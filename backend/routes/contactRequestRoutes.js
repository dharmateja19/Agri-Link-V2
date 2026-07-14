import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
import {
	getDealContactStatus,
	requestContact,
	respondContact,
	getFarmerRequests,
	getContactStatus,
	getBuyerRequests,
	getAllContactRequests
} from "../controllers/contact.controller.js";

const router = Router();

router.post("/request", authorize(["buyer"]), requestContact);
router.put("/respond/:id", authorize(["farmer"]), respondContact);
router.get("/farmer", getFarmerRequests);
router.get("/buyer", authorize(["buyer"]), getBuyerRequests);
router.get("/", authorize(["admin"]), getAllContactRequests);
router.get("/status/deal/:dealId", getDealContactStatus);
router.get("/status/:farmerId/:cropId", getContactStatus);

export default router;
