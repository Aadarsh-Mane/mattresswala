import mongoose from "mongoose";

const deliveryUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true, default: "delivery" },
  userName: { type: String, required: true },
  imageUrl: { type: String },
  fcmToken: { type: String }, // Store the FCM token here

  createdAt: { type: Date, default: Date.now },
});

const DeliveryUser = mongoose.model("DeliveryUser", deliveryUserSchema);

export default DeliveryUser;
