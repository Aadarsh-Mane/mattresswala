import express from "express";
import {
  addItem,
  addItemName,
  addMultipleSubitems,
  addSize,
  addSizesAndNames,
  addSizesToSubitem,
  addStock,
  addSubitem,
  addUser,
  deleteItem,
  deleteItemName,
  deleteOrderByOrderNo,
  deleteSize,
  deleteSubitem,
  deleteUser,
  filterOrders,
  getAllStocks,
  getAllUsers,
  getOnlyNames,
  getOnlySizes,
  getOrderDetails,
  getSizes,
  listOrdersWithDeliveryDone,
  updatePaymentStatus,
  updateQuantity,
  updateSizeOrQuantity,
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
adminRouter.delete("/deleteItemName/:itemNameToDelete", deleteItemName);
adminRouter.post("/addSize", addSize);
adminRouter.delete("/deleteSize/:itemName/:subitemName/:size", deleteSize);
adminRouter.get("/getSizes", getSizes);
adminRouter.get("/getOnlySizes", getOnlySizes);
adminRouter.get("/getOnlyNames", getOnlyNames);
adminRouter.post("/add1", addSizesAndNames);
adminRouter.delete("/deleteUser/:id", deleteUser);
adminRouter.post("/addStock", addStock);
// adminRouter.put("/updateStock/:itemName", updateStock);

adminRouter.post("/additem1", addItem);
adminRouter.post("/addSubitem", addMultipleSubitems);
adminRouter.post("/addSubitem", updateQuantity);
// adminRouter.put("/updateSubitem/:itemId/:subitemId", updateSubItem);
adminRouter.post("/addSubitem/:itemId", addSubitem);
// adminRouter.delete("/deleteSubitem/:itemId/:subitemId", deleteSubItem);
// adminRouter.delete("/deleteStock/:itemName", deleteStock);
adminRouter.get("/allStocks", getAllStocks);
adminRouter.put("/updateSizeOrQuantity", updateSizeOrQuantity);
adminRouter.delete("/deleteSubitem/:itemName/:subitemName", deleteSubitem);
adminRouter.post("/addSizesToSubitem", addSizesToSubitem);
adminRouter.delete("/deleteSubitem/:itemName/:subitemName", deleteSubitem);
adminRouter.delete("/deleteItem", deleteItem);
adminRouter.post("/updatePaymentStatus", updatePaymentStatus);
// adminRouter.post("/signin", );

// adminRouter.get("/profile", auth, getUserProfile);
// adminRouter.patch("/edit-profile", auth, upload.single("image"), editProfile);

export default adminRouter;
