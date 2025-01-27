import express from "express";
import {
  addUser,
  deleteOrderByOrderNo,
  filterOrders,
  getAllUsers,
  getOrderDetails,
  listOrdersWithDeliveryDone,
} from "../controllers/admin/adminController.js"; // import { signin, signup } from "../controllers/userController.js";
const adminRouter = express.Router();

//adminRouter.post("/signup", signup);
adminRouter.post("/api/v1/signup", addUser);
adminRouter.get("/api/v1/listAllUsers", getAllUsers);
adminRouter.get("/trackOrder/:orderNo", getOrderDetails);
adminRouter.get("/filterOrder", filterOrders);
adminRouter.get("/order-done", listOrdersWithDeliveryDone);
adminRouter.delete("/delete/:orderNo", deleteOrderByOrderNo);
// adminRouter.post("/signin", );

// adminRouter.get("/profile", auth, getUserProfile);
// adminRouter.patch("/edit-profile", auth, upload.single("image"), editProfile);

export default adminRouter;
