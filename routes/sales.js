import express from "express";
import {
  createFoamOrder,
  createOrder,
  getLatestOrderBySalesPerson,
  getOrdersBySalesPerson,
} from "../controllers/sales/createOrder.js";
import upload from "../middleware/multer.js";
import { auth } from "../middleware/auth.js";
const salesRouter = express.Router();

//salesRouter.post("/signup", signup);
// salesRouter.post("/api/v1/createOrder", createOrder);
salesRouter.post(
  "/create-order",
  auth, // Allow up to 20 files

  upload.single("itemImage"),
  createOrder
);
salesRouter.post(
  "/create-foam",
  auth, // Allow up to 20 files

  upload.single("itemImage"),
  createFoamOrder
);
salesRouter.get("/myOrders", auth, getOrdersBySalesPerson);
salesRouter.get("/latestOrder", auth, getLatestOrderBySalesPerson);
// salesRouter.get("/api/v1/listAllUsers", getAllUsers);
// salesRouter.post("/signin", );

// salesRouter.get("/profile", auth, getUserProfile);
// salesRouter.patch("/edit-profile", auth, upload.single("image"), editProfile);

export default salesRouter;
