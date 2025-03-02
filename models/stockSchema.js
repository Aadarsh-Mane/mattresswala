import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  subitems: [
    {
      subitemName: { type: String, required: true },
      sizes: [
        {
          size: { type: String, required: true },
          quantity: { type: Number, required: true, default: 0 },
        },
      ],
    },
  ],
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;

// const stockSchema = new mongoose.Schema({
//   itemName: { type: String, required: true, unique: true },
//   subitems: [
//     {
//       subitemName: { type: String, required: true },
//       sizes: [
//         {
//           size: { type: String, required: true }, // e.g., "Small", "Medium", "Large"
//           quantity: { type: Number, required: true, default: 0 },
//         },
//       ],
//     },
//   ],
// });

// const Stock = mongoose.model("Stock", stockSchema);
// export default Stock;
