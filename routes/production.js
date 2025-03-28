import express from "express";
import upload from "../middleware/multer.js";
import { auth } from "../middleware/auth.js";
import {
  getCreatedOrders,
  getLatestStartedOrders,
  getOrdersByProductionId,
  updateProductionStatus,
} from "../controllers/production/updateOrder.js";
const productionRouter = express.Router();

//productionRouter.post("/signup", signup);
// productionRouter.post("/api/v1/createOrder", createOrder);
productionRouter.post(
  "/update-order",
  auth, // Allow up to 20 files

  updateProductionStatus
);
productionRouter.get(
  "/created-orders",
  auth, // Allow up to 20 files

  getCreatedOrders
);
productionRouter.get(
  "/started-orders",
  auth, // Allow up to 20 files

  getOrdersByProductionId
);

productionRouter.get(
  "/latest-started-orders",
  auth, // Allow up to 20 files

  getLatestStartedOrders
);

export default productionRouter;
