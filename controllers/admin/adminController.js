import allUsersSchema from "../../models/allUsersSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
