import Order from "../../models/orderSchema.js";
import moment from "moment-timezone";
export const listOrdersWithProductionDone = async (req, res) => {
  try {
    // Query to find orders with productionTeam.status = 'Done'
    const orders = await Order.find({ "productionTeam.status": "Done" });

    res.status(200).json({
      message: "Orders with production completed fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching orders with production completed.",
      error: error.message,
    });
  }
};
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderNo, status, remarks } = req.body;
    console.log("Request Body:", req.body);

    const deliveryPersonId = req.userId;
    const deliveryPersonName = req.userName;

    // Find the order by orderNo
    const order = await Order.findOne({ orderNo });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Ensure the user is from the delivery team
    if (req.userType !== "delivery") {
      return res
        .status(403)
        .json({ message: "Only delivery team can update the status." });
    }
    if (
      order.deliveryTeam.id &&
      order.deliveryTeam.id.toString() !== deliveryPersonId
    ) {
      return res
        .status(409) // Conflict
        .json({
          message:
            "Another delievery team member is already working on this order.",
        });
    }
    const now = moment().tz("Asia/Kolkata");

    // Update delivery status and remarks
    order.deliveryTeam.status = status || order.deliveryTeam.status;
    order.deliveryTeam.remarks = remarks || order.deliveryTeam.remarks;
    order.deliveryTeam.id = deliveryPersonId;
    order.deliveryTeam.name = deliveryPersonName;

    // Update dates and times based on the status

    if (status === "Dispatched" && !order.deliveryTeam.dispatchDate) {
      order.deliveryTeam.dispatchDate = now.format("YYYY-MM-DD");
      order.deliveryTeam.dispatchTime = now.format("hh:mm A");
    }

    // Save the updated order
    await order.save();

    // Return success response
    res.status(200).json({
      message: "Delivery status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating delivery status.",
      error: error.message,
    });
  }
};
