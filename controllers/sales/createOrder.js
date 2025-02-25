import { Readable } from "stream";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import Order from "../../models/orderSchema.js";
import cloudinary from "../../helpers/cloudinary.js";
import allUsersSchema from "../../models/allUsersSchema.js";
import Counter from "../../models/trackSchema.js";
import { sendNotification } from "../admin/myNotification.js";
import Stock from "../../models/stockSchema.js";

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
const auth = new google.auth.GoogleAuth({
  credentials: ServiceAccount, // Replace with your service account credentials
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

export const createOrder = async (req, res) => {
  try {
    const { partyName, city, mobileNo, item, remarks, createdBy } = req.body;
    const salesPersonId = req.userId;
    const salesPersonName = req.userName;
    console.log(req.body);
    if (!partyName || !city || !mobileNo || !item) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    const orderNo = `ORD-${randomSixDigit}`;
    let serialNumber;
    const counter = await Counter.findOneAndUpdate(
      { name: "orderSerial" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    serialNumber = counter.value; // Get incremented serial number

    const itemImage = req.file; // Use req.file when using upload.single()
    let imageUrl = "";

    // Upload image to Google Drive if available
    if (itemImage) {
      const bufferStream = new Readable();
      bufferStream.push(itemImage.buffer);
      bufferStream.push(null);

      // Upload to Cloudinary
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "orders" }, // Optional folder name in Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        bufferStream.pipe(uploadStream);
      });
    }

    // Process the item and add the image URL
    const processedItem = {
      ...JSON.parse(item), // Assuming 'item' is a JSON string
      imageUrl, // Add the image URL to the item
    };
    const formattedItem = {
      itemName: processedItem.itemName.replace(/\(\d+\)/g, "").trim(), // Remove bracket numbers
      size: processedItem.size,
      quantity: processedItem.quantity,
      imageUrl, // Attach image URL if uploaded
    };
    console.log(formattedItem);
    const newOrder = new Order({
      serialNumber, // Assign the incremented serial number

      salesPerson: {
        id: salesPersonId,
        name: salesPersonName,
        remarks: remarks || null,
        createdBy: createdBy || null,
      },
      orderNo,
      partyName,
      city,
      mobileNo,
      item: formattedItem, // Directly set the item object (no need to use array)
    });

    await newOrder.save();
    const users = await allUsersSchema.find({ fcmToken: { $ne: null } });

    // Loop through the users and send a notification to each FCM token
    // users.forEach((user) => {
    //   sendNotification(user.fcmToken, partyName);
    // });
    // await Promise.all(
    //   users.map((user) =>
    //     sendNotification(user.fcmToken, partyName).catch((error) => {
    //       console.error(`Failed to send notification to ${user.email}:`, error);
    //     })
    //   )
    // );
    try {
      await Promise.all(
        users.map((user) =>
          sendNotification(user.fcmToken, partyName).catch((error) => {
            console.error(
              `Failed to send notification to ${user.email}:`,
              error
            );
            return null; // Ensures failure doesn't affect other notifications
          })
        )
      );
    } catch (err) {
      console.error("Unexpected error in sending notifications:", err);
    }

    res.status(201).json({
      message: "Order created successfully with an item.",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error while creating order.", error: error.message });
  }
};

export const getOrdersBySalesPerson = async (req, res) => {
  try {
    // Get the trUserId (salesperson ID) from the request params
    const salesId = req.userId;
    // Find orders where the sales person's ID matches the provided trUserId
    const orders = await Order.find({
      "salesPerson.id": salesId,
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this salesperson." });
    }

    // Return the orders found
    return res.status(200).json(orders);
  } catch (error) {
    // Handle errors and send response
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
};
export const getLatestOrderBySalesPerson = async (req, res) => {
  try {
    const salesId = req.userId; // Assuming req.userId contains the salesPerson ID

    // Fetch all orders for the given salesperson
    const orders = await Order.find({ "salesPerson.id": salesId });

    // Check if there are any orders
    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this salesperson." });
    }

    // Get the last order in the array
    const latestOrder = orders[orders.length - 1];

    // Return the latest order
    return res.status(200).json(latestOrder);
  } catch (error) {
    // Handle errors and send response
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
};

// export const getLatestOrdeWorkingPerson = async (req, res) => {
//   try {
//     // Extract userId (salesperson's ID) from the request parameters
//     // const { userId } = req.params;
//     const productionId = req.userId;

//     // Find the latest order created by the salesperson
//     const latestOrder = await Order.findOne({
//       "productionTeam.id": productionId, // Match the salesperson's ID
//       "productionTeam.status": "Started", // Match the production status as "Started"
//     })
//       .sort({ orderDate: -1, orderTime: -1 }) // Sort by order date and time in descending order
//       .limit(1); // Only get the most recent order

//     if (!latestOrder) {
//       return res
//         .status(404)
//         .json({ message: "No orders found for this salesperson." });
//     }

//     // Return the latest order found
//     return res.status(200).json(latestOrder);
//   } catch (error) {
//     // Handle errors and send response
//     console.error(error);
//     return res.status(500).json({ message: "Server error, please try again." });
//   }
// };
export const createFoamOrder = async (req, res) => {
  try {
    const { partyName, city, mobileNo, remarks, createdBy } = req.body;
    let items = req.body.items;

    const salesPersonId = req.userId;
    const salesPersonName = req.userName;

    try {
      items = typeof items === "string" ? JSON.parse(items) : items;
    } catch (error) {
      return res.status(400).json({ message: "Invalid items format." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items should be a non-empty array." });
    }

    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    const orderNo = `ORD-${randomSixDigit}`;

    let serialNumber;
    const counter = await Counter.findOneAndUpdate(
      { name: "orderSerial" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    serialNumber = counter.value;
    const itemImage = req.file; // Use req.file when using upload.single()
    let imageUrl = "";

    // Upload image to Google Drive if available
    if (itemImage) {
      const bufferStream = new Readable();
      bufferStream.push(itemImage.buffer);
      bufferStream.push(null);

      // Upload to Cloudinary
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "orders" }, // Optional folder name in Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        bufferStream.pipe(uploadStream);
      });
    }
    const processedItem = items[0];
    const formattedItem = {
      itemName: processedItem.itemName,
      size: processedItem.size,
      quantity: processedItem.quantity,
      imageUrl: imageUrl,
      layers: processedItem.layers.map((layer) => ({
        subitemName: layer.subitemName,
        layerNumber: layer.layerNumber,
        size: layer.size || null,
        quantity: layer.quantity || 0,
      })),
    };

    const stockRecord = await Stock.findOne({
      itemName: formattedItem.itemName,
    });
    if (!stockRecord) {
      return res.status(400).json({
        message: `Stock record not found for ${formattedItem.itemName}.`,
      });
    }

    for (const layer of formattedItem.layers) {
      const subitem = stockRecord.subitems.find(
        (s) => s.subitemName === layer.subitemName
      );
      if (!subitem) {
        return res.status(400).json({
          message: `Subitem ${layer.subitemName} not found in stock.`,
        });
      }
      if (subitem.stock < layer.quantity) {
        return res.status(400).json({
          message: `Not enough stock available for subitem ${layer.subitemName}.`,
        });
      }
      subitem.stock -= layer.quantity;
    }

    await stockRecord.save();

    const newOrder = new Order({
      serialNumber,
      salesPerson: {
        id: salesPersonId,
        name: salesPersonName,
        remarks: remarks || null,
        createdBy: createdBy || null,
      },
      orderNo,
      partyName,
      city,
      mobileNo,
      item: formattedItem,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res
      .status(500)
      .json({ message: "Error while creating order.", error: error.message });
  }
};
