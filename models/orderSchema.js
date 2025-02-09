import mongoose from "mongoose";
import moment from "moment-timezone";

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String, // Single string for the image URL
    required: true, // Image is required
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  salesPerson: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SalesUser", // Reference to Sales User
    },
    name: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      default: null, // Optional field for sales team remarks
    },
    createdBy: {
      type: String,
      default: null, // Optional field for sales team remarks
    },
    assignedDate: {
      type: String,
      default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD"), // Date when assigned
    },
    assignedTime: {
      type: String,
      default: () => moment().tz("Asia/Kolkata").format("hh:mm A"), // Time when assigned
    },
  },
  productionTeam: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionUser", // Reference to Production User
      default: null, // Initially not assigned
    },
    name: {
      type: String,
      default: null, // Name will be set when assigned
    },
    remarks: {
      type: String,
      default: null, // Optional field for production team remarks
    },
    updatedBy: {
      type: String,
      default: null, // Optional field for production team remarks
    },

    status: {
      type: String,
      required: true,
      enum: ["Not Yet Started", "Started", "Done"],
      default: "Not Yet Started", // Default status
    },
    assignedDate: {
      type: String,
      default: null, // Initially not assigned
    },
    assignedTime: {
      type: String,
      default: null, // Initially not assigned
    },
    workDoneDate: {
      type: String,
      default: null, // Initially not assigned
    },
    workDoneTime: {
      type: String,
      default: null, // Initially not assigned
    },
  },
  deliveryTeam: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryUser", // Reference to Delivery User
      default: null, // Initially not assigned
    },
    name: {
      type: String,
      default: null, // Name will be set when assigned
    },
    remarks: {
      type: String,
      default: null, // Optional field for delivery team remarks
    },
    assignedDate: {
      type: String,
      default: null, // Initially not assigned
    },
    assignedTime: {
      type: String,
      default: null, // Initially not assigned
    },
    status: {
      type: String,
      required: true,
      enum: ["Waiting", "Dispatched", "Arrived"],
      default: "Waiting", // Default status
    },
    updatedBy: {
      type: String,
      default: null, // Optional field for production team remarks
    },
    dispatchDate: {
      type: String,
      default: null, // Initially not assigned
    },
    dispatchTime: {
      type: String,
      default: null, // Initially not assigned
    },
    arrivedDate: {
      type: String,
      default: null, // Initially not assigned
    },
    arrivedTime: {
      type: String,
      default: null, // Initially not assigned
    },
  },
  serialNumber: {
    type: Number,
    unique: true, // Ensures uniqueness
  },
  orderNo: {
    type: String,
    required: true,
    unique: true,
  },
  orderDate: {
    type: String,
    required: true,
    default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD"), // Default in IST
  },
  orderTime: {
    type: String,
    required: true,
    default: () => moment().tz("Asia/Kolkata").format("hh:mm A"), // Default in 12-hour IST
  },
  partyName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, // Validate Indian mobile numbers
  },
  item: itemSchema, // Changed from an array to a single item object
  status: {
    type: String,
    required: true,
    enum: ["Order Created", "Ready", "Dispatched"],
    default: "Order Created", // Default status
  },
});

// Pre-save middleware to ensure date and time are always formatted
orderSchema.pre("save", function (next) {
  const now = moment().tz("Asia/Kolkata");
  this.orderDate = now.format("YYYY-MM-DD"); // Set to IST date

  this.orderTime = now.format("hh:mm A"); // Set to IST time in 12-hour format
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
