import express from "express";
import { auth } from "../middleware/auth.js";
import { updateDeliveryStatus } from "../controllers/delievery/delivery.js";
const deliveryRouter = express.Router();

deliveryRouter.post(
  "/update-delivery-status",
  auth, // Allow up to 20 files

  updateDeliveryStatus
);

export default deliveryRouter;
