import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  subitems: [
    {
      subitemName: { type: String, required: true },
      stock: { type: Number, required: true, default: 0 },
    },
  ],
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
