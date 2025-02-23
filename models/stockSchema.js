import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 }, // Total stock
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
