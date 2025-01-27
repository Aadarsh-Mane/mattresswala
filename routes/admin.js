import express from "express";
import {
  addItemName,
  addSize,
  addSizesAndNames,
  addUser,
  deleteItemName,
  deleteOrderByOrderNo,
  deleteSize,
  filterOrders,
  getAllUsers,
  getOnlyNames,
  getOnlySizes,
  getOrderDetails,
  getSizes,
  listOrdersWithDeliveryDone,
} from "../controllers/admin/adminController.js"; // import { signin, signup } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
const adminRouter = express.Router();

//adminRouter.post("/signup", signup);
adminRouter.post("/api/v1/signup", addUser);
adminRouter.get("/api/v1/listAllUsers", getAllUsers);
adminRouter.get("/trackOrder/:orderNo", getOrderDetails);
adminRouter.get("/filterOrder", filterOrders);
adminRouter.get("/order-done", listOrdersWithDeliveryDone);
adminRouter.delete("/delete/:orderNo", deleteOrderByOrderNo);
adminRouter.post("/addItem", auth, addItemName);
adminRouter.delete("/delete/:itemNameToDelete", deleteItemName);
adminRouter.post("/addSize", addSize);
adminRouter.delete("/deleteSize/:sizeToDelete", deleteSize);
adminRouter.get("/getSizes", getSizes);
adminRouter.get("/getOnlySizes", getOnlySizes);
adminRouter.get("/getOnlyNames", getOnlyNames);
adminRouter.post("/add1", addSizesAndNames);
// adminRouter.post("/signin", );

// adminRouter.get("/profile", auth, getUserProfile);
// adminRouter.patch("/edit-profile", auth, upload.single("image"), editProfile);

export default adminRouter;
