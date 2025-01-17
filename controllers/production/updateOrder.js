import Order from "../../models/orderSchema.js";
import moment from "moment-timezone";
export const updateProductionStatus = async (req, res) => {
  try {
    const { orderNo, status, remarks } = req.body;
    const productionPersonId = req.userId;
    const productionPersonName = req.userName;

    // Find the order by orderNo
    const order = await Order.findOne({ orderNo });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Ensure the user is from the production team
    if (req.userType !== "production") {
      return res
        .status(403)
        .json({ message: "Only production team can update the status." });
    }

    // Check if another production person is already working on the order
    if (
      order.productionTeam.id &&
      order.productionTeam.id.toString() !== productionPersonId
    ) {
      return res
        .status(409) // Conflict
        .json({
          message:
            "Another production team member is already working on this order.",
        });
    }

    // Check if the status is already "Started"
    if (order.productionTeam.status === "Started" && status === "Started") {
      return res
        .status(400) // Bad Request
        .json({
          message: "Production work has already been started for this order.",
        });
    }

    const now = moment().tz("Asia/Kolkata");

    // Update production status and remarks
    order.productionTeam.status = status || order.productionTeam.status;
    order.productionTeam.remarks = remarks || order.productionTeam.remarks;
    order.productionTeam.id = productionPersonId;
    order.productionTeam.name = productionPersonName;

    // Update dates and times based on the status
    if (status === "Started" && !order.productionTeam.assignedDate) {
      order.productionTeam.assignedDate = now.format("YYYY-MM-DD");
      order.productionTeam.assignedTime = now.format("hh:mm A");
    }

    if (status === "Dispatched" && !order.productionTeam.dispatchDate) {
      order.productionTeam.dispatchDate = now.format("YYYY-MM-DD");
      order.productionTeam.dispatchTime = now.format("hh:mm A");
    }

    // Save the updated order
    await order.save();

    // Return success response
    res.status(200).json({
      message: "Production status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating production status.",
      error: error.message,
    });
  }
};
