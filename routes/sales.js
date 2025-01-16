import express from "express";
import { createOrder } from "../controllers/sales/createOrder.js";
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
// salesRouter.get("/api/v1/listAllUsers", getAllUsers);
// salesRouter.post("/signin", );

// salesRouter.get("/profile", auth, getUserProfile);
// salesRouter.patch("/edit-profile", auth, upload.single("image"), editProfile);

export default salesRouter;
