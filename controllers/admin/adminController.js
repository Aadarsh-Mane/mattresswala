import allUsersSchema from "../../models/allUsersSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Order from "../../models/orderSchema.js";
import SalesUser from "../../models/salesUserSchema.js";
import ProductionUser from "../../models/productionSchema.js";
import DeliveryUser from "../../models/deliverySchema.js";
import AdminUser from "../../models/adminSchema.js";
import puppeteer from "puppeteer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import sizeAndNames from "../../models/numbersSchema.js";
import sizeAndNamesSchema from "../../models/numbersSchema.js";
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
// export const getOrderDetails = async (req, res) => {
//   try {
//     // Get the orderNo from the request parameters or body
//     const { orderNo } = req.params;

//     // Find the order by orderNo
//     const order = await Order.findOne({ orderNo });

//     // If no order is found, return a 404 error
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Return the found order as a JSON response
//     return res.status(200).json(order);
//   } catch (error) {
//     // Log the error for debugging
//     console.error(error);

//     // Return a 500 error if something goes wrong
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };
export const filterOrders = async (req, res) => {
  try {
    const { team, status } = req.query;

    // If team or status is not provided or equals "All", return all orders.
    if (!team || !status || team === "All" || status === "All") {
      const orders = await Order.find({});
      return res.status(200).json(orders);
    }

    // Map team query to the appropriate field in the schema
    const teamFields = {
      productionTeam: "productionTeam.status",
      salesTeam: "salesPerson.remarks", // Replace with the appropriate field if needed
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
export const getOrderDetails = async (req, res) => {
  try {
    // Get the orderNo from the request parameters
    const { orderNo } = req.params;

    // Find the order by orderNo
    const order = await Order.findOne({ orderNo });

    // If no order is found, return a 404 error
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a single response object containing all order details
    const response = {
      salesPerson: {
        id: order.salesPerson.id,
        name: order.salesPerson.name,
        remarks: order.salesPerson.remarks,
        assignedDate: order.salesPerson.assignedDate,
        assignedTime: order.salesPerson.assignedTime,
      },
      productionTeam: {
        id: order.productionTeam.id,
        name: order.productionTeam.name,
        remarks: order.productionTeam.remarks,
        status: order.productionTeam.status,
        assignedDate: order.productionTeam.assignedDate,
        assignedTime: order.productionTeam.assignedTime,
        workDoneDate: order.productionTeam.workDoneDate,
        workDoneTime: order.productionTeam.workDoneTime,
      },
      deliveryTeam: {
        id: order.deliveryTeam.id,
        name: order.deliveryTeam.name,
        remarks: order.deliveryTeam.remarks,
        assignedDate: order.deliveryTeam.assignedDate,
        assignedTime: order.deliveryTeam.assignedTime,
        status: order.deliveryTeam.status,
        dispatchDate: order.deliveryTeam.dispatchDate,
        dispatchTime: order.deliveryTeam.dispatchTime,
        arrivedDate: order.deliveryTeam.arrivedDate, // Add if it's part of the schema
        arrivedTime: order.deliveryTeam.arrivedTime, // Add if it's part of the schema
      },
      orderDetails: {
        orderNo: order.orderNo,
        partyName: order.partyName,
        city: order.city,
        mobileNo: order.mobileNo,
        item: {
          itemName: order.item.itemName,
          imageUrl: order.item.imageUrl,
          size: order.item.size,
        },
        status: order.status,
        orderDate: order.orderDate,
        orderTime: order.orderTime,
      },
    };
    const ServiceAccount = {
      type: "service_account",
      project_id: "doctor-dd7e8",
      private_key_id: "5966d0605cb722f31fbcfdcd716153ad34529ed0",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDU8SYYtRBdRLgf\n9kRj70jHsNL6wj0s6I6NETYve1djm+okgfyAhU8MY0eKAexaaYQ+iJ9gRGaBoo1n\n7NMcMBd85HfKqYshuyyv/cqUIZKzRIn9czGkTkb2R2NsWRMfYWV7LeYfO3xkGWRD\nrII51YIJOujqNZMM3IJ4XiUkkww6iDC5ykEFtK7laPpXCL9ykdF9oMEybFtjF+1q\nVlh2PAilE7TzZWDnwjM5D6S2fdEj1WXDYMozsspBHOykk4RDcb1KkXjSSrbo5zTq\naCIuAxTHmA01EE5bJLP1DFrm+6VLMCjpZkdTxGOg8t3eMJ2L/o4ce8YW1QpBpc8x\ni5mjjYl1AgMBAAECggEAIr0ahXJYcpbI4PH4k0MQoP8wVBdHCqH/y3Sw3csl5Qql\nBoKsMj1NOYyiuZl5uQA4wkjgk0BlZqWhowAoKpOP6WCOSGIjYAPclPN2znaxq4w1\nZMMbqJ3ahsf7qMvZSkfF2fQRdCvsrZnU2RN2BUBXH/Fb2QWXcUQyBrf5ID/bAVs1\nJQKaSVT2cyRWPk6Q9t4DcXunpD7PXgFd8lyj/289SHMyf/0SDbNzcP5d+2zYj9D7\nSEXE7+n9odQRmIq+mRFIxIweyXY2w2H7aHpy5wtz00rQm+qFBlk+1VG3/JYMcOmu\nag/0E2JF3Pz1kjVh8/MZ6Plkc5++AGZ9oam+tqqoiwKBgQD3aE0HmOH7kMSewcM8\n0MYIxizFPQRLxIQ+O1aE+p/147Ey16SIgsc7oTnYFO1/TtxxCLvteMfHgrhHvqWK\ndRK9KR8JlzadojJAOI9U7AtVMThLNWDKxOupLrFhjA7eyYs0SlSLpuouNwnKe+FW\nQc+X4OB6gnM+pbgxkK3AM2WPwwKBgQDcVmpu1ZXNs+W6cmCYwhLLlwrLS1f0r8Nk\n9oAx0kg9PW2w/7Be4gFSKeAxFQ0OvHn6K5mLJc6QV6fPQL3zxtTbqubU3DYbLW2F\n7fZdI4zRA1EqiKrn+euT/F9TF0gS/00GQB8aSGjsJmdkaEjt6/9XD8T40+/5K+3a\nuv4kImNmZwKBgD9Uq6MuN2q1/B7Harq+lnLYh81VeSwL+e4UMmmH3jqLNmjVWoC3\nOVjCRJRThxf3j+Y/XhvDtyATDikPXEC9Bzb0t8U0t/5R7psR317VrXD5UHewCj7d\neZWtJiraN1RAMyoHfOzipT9/RzpVy7DQ19sA7XVuvyFiOmw1pMR2Y6ERAoGAOCcV\nzNVF7jyQqWmI0KV1IMmHiLPU4JkClPJ1TT0oB+Nl1xvymNvENmpRpnCU+VJzS5xc\n7yddc0/DhoAbaMsdaDYvycOtTlPPe7hfdvEebA4KW2qlE6WPshE5QfXG+oBx4svo\noUwe4UAQTXh+TZQ9aLSuIDPzDm9xmLLbHd5dsrUCgYA44Xm1h/kBmgaROuXjpJk+\nBY+N43Fx8EaXi2UGVSoRrdnk634nAJltQYaGeVPPwv+6I4Q2bBcL9VcjT8gNK43c\nImt+DRb9G2P6lfXBDGkPmHwmzhfszNEuyVglNLyggAWQgUcNZ7EmPYa43B6s3BXZ\nEZ3nHVzbmC/toUZ5OdiSFA==\n-----END PRIVATE KEY-----\n",
      client_email: "doctor-459@doctor-dd7e8.iam.gserviceaccount.com",
      client_id: "109450368952306583894",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/doctor-459%40doctor-dd7e8.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    };
    const OrdeDetail = ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Details</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9fafc;
            color: #333;
        }
        .container {
            max-width: 840px;
            margin: 20px auto;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 30%;
            height: 10%;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .header h1 {
            font-size: 23px;
            color: #555;
            margin: 0;
        }
        h2 {
            font-size: 16px;
            color: #444;
            margin-bottom: 13px;
            border-bottom: 2px solid #f4f4f4;
            padding-bottom: 3px;
        }
        .details {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-bottom: 20px;
        }
        .details div {
            flex: 1;
            min-width: 200px;
            font-size: 12px;
        }
        .details div strong {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table th, table td {
            padding: 12px 14px;
            text-align: left;
            border: 1px solid #ddd;
            font-size: 12px;
        }
        table th {
            background-color: #f8f8f8;
            font-weight: bold;
        }
        img.item-image {
            max-width: 180px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/dnznafp2a/image/upload/v1737110879/certificates/txxrap0kubdneojcddfx.jpg" alt="Banner">
            <h1>Order Details</h1>
        </div>

        <div class="section">
            <h2>Order Information</h2>
            <div class="details">
                <div><strong>Order Number:</strong> ${
                  response.orderDetails.orderNo
                }</div>
                <div><strong>Party Name:</strong> ${
                  response.orderDetails.partyName
                }</div>
                <div><strong>City:</strong> ${response.orderDetails.city}</div>
                <div><strong>Mobile Number:</strong> ${
                  response.orderDetails.mobileNo
                }</div>
                <div><strong>Order Status:</strong> ${
                  response.orderDetails.status
                }</div>
                <div><strong>Order Date:</strong> ${
                  response.orderDetails.orderDate
                }</div>
                <div><strong>Order Time:</strong> ${
                  response.orderDetails.orderTime
                }</div>
            </div>
        </div>

        <div class="section">
            <h2>Item Details</h2>
            <div class="details">
                <div><strong>Item Name:</strong> ${
                  response.orderDetails.item.itemName
                }</div>
                <div><strong>Size:</strong> ${
                  response.orderDetails.item.size
                }</div>
                <div><img src="
                " alt="Item Image" class="item-image"></div>
            </div>
        </div>

        <div class="section">
            <h2>Team Assignments</h2>
            <h3>Sales Team</h3>
            <div class="details">
                <div><strong>Name:</strong> ${response.salesPerson.name}</div>
                <div><strong>Remarks:</strong> ${
                  response.salesPerson.remarks || "N/A"
                }</div>
                <div><strong>Assigned Date:</strong> ${
                  response.salesPerson.assignedDate
                }</div>
                <div><strong>Assigned Time:</strong> ${
                  response.salesPerson.assignedTime
                }</div>
            </div>

            <h3>Production Team</h3>
            <div class="details">
                <div><strong>Name:</strong> ${
                  response.productionTeam.name
                }</div>
                <div><strong>Remarks:</strong> ${
                  response.productionTeam.remarks || "N/A"
                }</div>
                <div><strong>Status:</strong> ${
                  response.productionTeam.status
                }</div>
                <div><strong>Assign Date:</strong> ${
                  response.productionTeam.assignedDate
                }</div>
                <div><strong>Assign Time:</strong> ${
                  response.productionTeam.assignedTime
                }</div>
                <div><strong>Work Done Date:</strong> ${
                  response.productionTeam.workDoneDate
                }</div>
                <div><strong>Work Done Time:</strong> ${
                  response.productionTeam.workDoneTime
                }</div>
            </div>

            <h3>Delivery Team</h3>
            <div class="details">
                <div><strong>Name:</strong> ${response.deliveryTeam.name}</div>
                <div><strong>Remarks:</strong> ${
                  response.deliveryTeam.remarks || "N/A"
                }</div>
                <div><strong>Status:</strong> ${
                  response.deliveryTeam.status
                }</div>
                <div><strong>Dispatch Date:</strong> ${
                  response.deliveryTeam.dispatchDate
                }</div>
                <div><strong>Dispatch Time:</strong> ${
                  response.deliveryTeam.dispatchTime
                }</div>
                <div><strong>Arrived Date:</strong> ${
                  response.deliveryTeam.arrivedDate || "N/A"
                }</div>
                <div><strong>Arrived Time:</strong> ${
                  response.deliveryTeam.arrivedTime || "N/A"
                }</div>
            </div>
        </div>
    </div>
</body>
</html>
`;
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: "/usr/bin/google-chrome-stable",
    });
    // console.log("check thei path", process.env.PUPPETEER_EXECUTABLE_PATH);
    const page = await browser.newPage();
    await page.setContent(OrdeDetail);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Authenticate with Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: ServiceAccount,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    // Convert PDF buffer into a readable stream
    const bufferStream = new Readable();
    bufferStream.push(pdfBuffer);
    bufferStream.push(null);

    // Folder ID in Google Drive
    const folderId = "1RqOpon1sP9QK6NRMfdBQiidnGzBOEArZ";

    // Upload PDF to Google Drive
    const driveFile = await drive.files.create({
      resource: {
        name: `History_.pdf`,
        parents: [folderId],
      },
      media: {
        mimeType: "application/pdf",
        body: bufferStream,
      },
      fields: "id, webViewLink",
    });

    // Extract file's public link
    const fileLink = driveFile.data.webViewLink;
    // Return the response object
    return res.status(200).json({ response: response, fileLink: fileLink });
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Return a 500 error if something goes wrong
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const deleteOrderByOrderNo = async (req, res) => {
  const { orderNo } = req.params; // Get orderNo from URL parameters

  try {
    // Check if the order exists
    const order = await Order.findOne({ orderNo });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with the provided order number",
      });
    }

    // Delete the order
    await Order.deleteOne({ orderNo });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting the order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the order",
      error: error.message,
    });
  }
};
export const addSize = async (req, res) => {
  try {
    const { newSize } = req.body;

    // Find the first document (or you can use a filter condition if needed)
    const record = await sizeAndNamesSchema.findOne();

    // Check if the new size already exists in the size array
    if (record.size.includes(newSize)) {
      return res.status(400).json({ message: "Size already exists." });
    }

    // Add the new size to the array
    record.size.push(newSize);
    await record.save();

    return res
      .status(200)
      .json({ message: "Size added successfully.", record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const addItemName = async (req, res) => {
  try {
    const { newItemName } = req.body;

    // Find the first document (or you can use a filter condition if needed)
    let record = await sizeAndNamesSchema.findOne();

    // If no document exists, create a new one
    if (!record) {
      record = new sizeAndNamesSchema({
        itemName: [], // Initialize the array
      });
    }

    // Check if the new item name already exists in the itemName array
    if (record.itemName.includes(newItemName)) {
      return res.status(400).json({ message: "Item name already exists." });
    }

    // Add the new item name to the array
    record.itemName.push(newItemName);
    await record.save();

    return res
      .status(200)
      .json({ message: "Item name added successfully.", record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSize = async (req, res) => {
  try {
    const { sizeToDelete } = req.params; // The size to delete from the array

    // Find the record
    const record = await sizeAndNamesSchema.findOne();

    // Check if the size exists in the array
    if (!record.size.includes(sizeToDelete)) {
      return res.status(400).json({ message: "Size does not exist." });
    }

    // Remove the size from the array
    record.size = record.size.filter((size) => size !== sizeToDelete);
    await record.save();

    return res
      .status(200)
      .json({ message: "Size deleted successfully.", record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteItemName = async (req, res) => {
  try {
    const { itemNameToDelete } = req.params; // The item name to delete from the array

    // Find the record
    const record = await sizeAndNames.findOne();

    // Check if the item name exists in the array
    if (!record.itemName.includes(itemNameToDelete)) {
      return res.status(400).json({ message: "Item name does not exist." });
    }

    // Remove the item name from the array
    record.itemName = record.itemName.filter(
      (itemName) => itemName !== itemNameToDelete
    );
    await record.save();

    return res
      .status(200)
      .json({ message: "Item name deleted successfully.", record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getSizes = async (req, res) => {
  try {
    // const data = await fetchData(); // Call fetchData function
    const data = await sizeAndNamesSchema.find(); // Fetch all documents

    res.status(200).json(data); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error }); // Handle errors
  }
};
export const getOnlySizes = async (req, res) => {
  try {
    // const data = await fetchData(); // Call fetchData function
    const data = await sizeAndNamesSchema.find({}, "size"); // Fetch 'size' field only

    res.status(200).json(data); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error }); // Handle errors
  }
};
export const getOnlyNames = async (req, res) => {
  try {
    // const data = await fetchData(); // Call fetchData function
    const data = await sizeAndNamesSchema.find({}, "itemName"); // Fetch 'size' field only

    res.status(200).json(data); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error }); // Handle errors
  }
};
const itemNames = [
  "Mattress",
  "Curtain",
  "Mattress cover",
  "Pillow",
  "Cushion",
  "Bolster",
  "Comforter",
  "Bedsheets",
  "Bedsheets with fitted",
  "Bedsheets set",
  "Dohar",
  "Sofa Cover",
];

const itemSizes = [
  "72x36x4 Inch",
  "72x36x6 Inch",
  "78x72x5 Inch",
  "78x72x6 Inch",
  "17x27 Inch",
  "16x24 Inch",
  "16x16 Inch",
  "21x9 Inch",
  "108x108 Inch",
  "90x100 Inch",
];

// Controller to add data to MongoDB
export const addSizesAndNames = async (req, res) => {
  try {
    // Create a new document based on the schema
    const newSizeAndName = new sizeAndNamesSchema({
      size: itemSizes,
      itemName: itemNames,
    });

    // Save to the database
    await newSizeAndName.save();

    // Return success message
    res.status(201).json({
      message: "Sizes and item names successfully added to the database.",
    });
  } catch (error) {
    console.error("Error adding data: ", error);
    res.status(500).json({
      message: "Error adding sizes and item names to the database.",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await allUsersSchema.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};
