import mongoose from "mongoose";

const productionUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true, default: "production" },
  userName: { type: String, required: true },
  imageUrl: { type: String },
  fcmToken: { type: String }, // Store the FCM token here

  createdAt: { type: Date, default: Date.now },
});

const ProductionUser = mongoose.model("ProductionUser", productionUserSchema);

export default ProductionUser;
