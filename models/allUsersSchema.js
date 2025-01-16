import mongoose from "mongoose";

const allUsers = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true },
  userName: { type: String, required: true },
  imageUrl: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const allUsersSchema = mongoose.model("allUsers", allUsers);

export default allUsersSchema;
