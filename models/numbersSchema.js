import mongoose from "mongoose";

const sizeAndName = mongoose.Schema({
  size: { type: [String] },
  itemName: { type: [String] },
});

const sizeAndNamesSchema = mongoose.model("sizes", sizeAndName);

export default sizeAndNamesSchema;
