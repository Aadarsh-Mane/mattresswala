import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getProductionDone,
  listOrdersWithProductionDone,
  updateDeliveryStatus,
} from "../controllers/delievery/delivery.js";
const deliveryRouter = express.Router();

deliveryRouter.post(
  "/update-delivery-status",
  auth, // Allow up to 20 files

  updateDeliveryStatus
);
deliveryRouter.get(
  "/list-production-done",
  auth, // Allow up to 20 files

  listOrdersWithProductionDone
);
deliveryRouter.get(
  "/latest-done",
  auth, // Allow up to 20 files

  getProductionDone
);

export default deliveryRouter;
