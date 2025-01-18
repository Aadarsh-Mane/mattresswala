import allUsersSchema from "../../models/allUsersSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Order from "../../models/orderSchema.js";
import SalesUser from "../../models/salesUserSchema.js";
import ProductionUser from "../../models/productionSchema.js";
import DeliveryUser from "../../models/deliverySchema.js";
import AdminUser from "../../models/adminSchema.js";
const SECRET = "MATRESS";
export const addUser = async (req, res) => {
  try {
    const { email, password, usertype, userName } = req.body;

    // Validate required fields
    if (!email || !password || !usertype || !userName) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Check if the user already exists
    const existingUser = await allUsersSchema.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    // Create a new user instance
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await allUsersSchema.create({
      email,
      password: hashedPassword,
      usertype,
      userName,
      // Add this field for FCM token
      // Link to doctor by name
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: result.email, id: result._id, usertype: result.usertype },
      SECRET,
      { expiresIn: "30d" }
    );
    // Save the user to the database
    res.status(201).json({ user: result, token });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the user.", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await allUsersSchema.find();

    // If no users are found, return a message
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Return the list of users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching users.", error });
  }
};
export const listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database

    res.status(200).json({
      message: "Orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching orders.",
      error: error.message,
    });
  }
};
const schemaMap = {
  sales: SalesUser,
  production: ProductionUser,
  delivery: DeliveryUser,
  admin: AdminUser,
};

export const getProfile = async (req, res) => {
  try {
    const { userId, userType } = req;

    // Validate input
    if (!userId || !userType) {
      return res
        .status(400)
        .json({ message: "User ID and user type are required." });
    }

    // Find the corresponding schema based on userType
    const UserModel = schemaMap[userType.toLowerCase()];

    if (!UserModel) {
      return res.status(400).json({ message: "Invalid user type provided." });
    }

    // Query the user profile from the appropriate schema
    const user = await UserModel.findById(userId).select("-password");

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with the profile
    res.status(200).json({
      message: "Profile retrieved successfully.",
      profile: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      message: "Error retrieving profile.",
      error: error.message,
    });
  }
};
export const getOrderDetails = async (req, res) => {
  try {
    // Get the orderNo from the request parameters or body
    const { orderNo } = req.params;

    // Find the order by orderNo
    const order = await Order.findOne({ orderNo });

    // If no order is found, return a 404 error
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the found order as a JSON response
    return res.status(200).json(order);
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Return a 500 error if something goes wrong
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const filterOrders = async (req, res) => {
  try {
    const { team, status } = req.query;

    // Validate required parameters
    if (!team || !status) {
      return res.status(400).json({
        message: "Both 'team' and 'status' query parameters are required.",
      });
    }

    // Map team query to the appropriate field in the schema
    const teamFields = {
      productionTeam: "productionTeam.status",
      salesTeam: "salesPerson.remarks", // Replace with an appropriate field if sales team has a status
      deliveryTeam: "deliveryTeam.status",
    };

    if (!teamFields[team]) {
      return res.status(400).json({
        message:
          "Invalid team specified. Choose from 'productionTeam', 'salesTeam', or 'deliveryTeam'.",
      });
    }

    // Build the filter query
    const filter = {
      [teamFields[team]]: status,
    };

    // Fetch orders matching the filter
    const orders = await Order.find(filter);

    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found matching the specified criteria.",
      });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error filtering orders:", error);
    res.status(500).json({
      message: "An error occurred while filtering orders.",
      error: error.message,
    });
  }
};
export const listOrdersWithDeliveryDone = async (req, res) => {
  try {
    // Query to find orders with productionTeam.status = 'Done'
    const orders = await Order.find({ "deliveryTeam.status": "Arrived" });

    res.status(200).json({
      message: "Orders with delivery  arrived fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching orders with delivery arrived.",
      error: error.message,
    });
  }
};
