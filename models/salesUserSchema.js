import mongoose from "mongoose";

const salesUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true, default: "sales" },
  userName: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const SalesUser = mongoose.model("SalesUser", salesUserSchema);

export default SalesUser;
