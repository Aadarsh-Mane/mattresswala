import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true, default: "admin" },
  userName: { type: String, required: true },
  imageUrl: { type: String },
  fcmToken: { type: String }, // Store the FCM token here

  createdAt: { type: Date, default: Date.now },
});

const AdminUser = mongoose.model("AdminUser", adminSchema);

export default AdminUser;
