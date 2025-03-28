import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SalesUser from "../models/salesUserSchema.js";
import ProductionUser from "../models/productionSchema.js";
import DeliveryUser from "../models/deliverySchema.js";
import allUsersSchema from "../models/allUsersSchema.js";
import AdminUser from "../models/adminSchema.js";
const SECRET = "MATRESS";
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password, fcmtoken } = req.body;
//     console.log(email, password, fcmtoken);
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required." });
//     }

//     const user = await allUsersSchema.findOne({ email });
//     user.fcmToken = fcmtoken;
//     await user.save();

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials." });
//     }

//     let userToInsert;

//     const userData = {
//       email: user.email,
//       password: user.password,
//       usertype: user.usertype,
//       userName: user.userName,
//       imageUrl: user.imageUrl,
//       fcmToken: fcmtoken,
//       createdAt: user.createdAt,
//     };

//     if (user.usertype === "sales") {
//       userToInsert = await SalesUser.findOne({ email });
//       if (userToInsert) {
//         userToInsert.fcmToken = fcmtoken;
//         await userToInsert.save();
//       }
//       if (!userToInsert) {
//         userToInsert = new SalesUser(userData);
//         await userToInsert.save();
//       }
//     } else if (user.usertype === "production") {
//       userToInsert = await ProductionUser.findOne({ email });

//       if (!userToInsert) {
//         userToInsert = new ProductionUser(userData);
//         await userToInsert.save();
//       }
//     } else if (user.usertype === "delivery") {
//       userToInsert = await DeliveryUser.findOne({ email });
//       if (!userToInsert) {
//         userToInsert = new DeliveryUser(userData);
//         await userToInsert.save();
//       }
//     } else if (user.usertype === "admin") {
//       userToInsert = await AdminUser.findOne({ email });
//       if (!userToInsert) {
//         userToInsert = new AdminUser(userData);
//         await userToInsert.save();
//       }
//     } else {
//       return res.status(400).json({ message: "Invalid user type." });
//     }

//     const token = jwt.sign(
//       {
//         userId: userToInsert._id,
//         userType: userToInsert.usertype,
//         userName: userToInsert.userName,
//       },
//       SECRET,
//       { expiresIn: "30d" }
//     );

//     res.status(200).json({
//       message: "Login successful.",
//       token,
//       usertype: userToInsert.usertype,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "An error occurred during login.", error });
//   }
// };
export const loginUser = async (req, res) => {
  console.log("Login njnj");
  try {
    const { email, password, fcmtoken } = req.body;
    console.log(email, password, fcmtoken);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await allUsersSchema.findOne({ email });

    // Only update FCM token if it's defined and not already set or if it's different from the existing token
    if (
      fcmtoken !== undefined &&
      (!user.fcmToken || user.fcmToken !== fcmtoken)
    ) {
      user.fcmToken = fcmtoken;
      await user.save();
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    let userToInsert;

    const userData = {
      email: user.email,
      password: user.password,
      usertype: user.usertype,
      userName: user.userName,
      imageUrl: user.imageUrl,
      fcmToken: fcmtoken,
      createdAt: user.createdAt,
    };

    if (user.usertype === "sales") {
      userToInsert = await SalesUser.findOne({ email });
      if (userToInsert) {
        if (
          fcmtoken !== undefined &&
          (!userToInsert.fcmToken || userToInsert.fcmToken !== fcmtoken)
        ) {
          userToInsert.fcmToken = fcmtoken;
          await userToInsert.save();
        }
      }
      if (!userToInsert) {
        userToInsert = new SalesUser(userData);
        await userToInsert.save();
      }
    } else if (user.usertype === "production") {
      userToInsert = await ProductionUser.findOne({ email });
      if (userToInsert) {
        if (
          fcmtoken !== undefined &&
          (!userToInsert.fcmToken || userToInsert.fcmToken !== fcmtoken)
        ) {
          userToInsert.fcmToken = fcmtoken;
          await userToInsert.save();
        }
      }
      if (!userToInsert) {
        userToInsert = new ProductionUser(userData);
        await userToInsert.save();
      }
    } else if (user.usertype === "delivery") {
      userToInsert = await DeliveryUser.findOne({ email });
      if (userToInsert) {
        if (
          fcmtoken !== undefined &&
          (!userToInsert.fcmToken || userToInsert.fcmToken !== fcmtoken)
        ) {
          userToInsert.fcmToken = fcmtoken;
          await userToInsert.save();
        }
      }
      if (!userToInsert) {
        userToInsert = new DeliveryUser(userData);
        await userToInsert.save();
      }
    } else if (user.usertype === "admin") {
      userToInsert = await AdminUser.findOne({ email });
      if (userToInsert) {
        if (
          fcmtoken !== undefined &&
          (!userToInsert.fcmToken || userToInsert.fcmToken !== fcmtoken)
        ) {
          userToInsert.fcmToken = fcmtoken;
          await userToInsert.save();
        }
      }
      if (!userToInsert) {
        userToInsert = new AdminUser(userData);
        await userToInsert.save();
      }
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }

    const token = jwt.sign(
      {
        userId: userToInsert._id,
        userType: userToInsert.usertype,
        userName: userToInsert.userName,
      },
      SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      usertype: userToInsert.usertype,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login.", error });
  }
};
