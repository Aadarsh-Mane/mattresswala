import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { connectDB } from "./dbConnect.js";
import adminRouter from "./routes/admin.js";
import { loginUser } from "./controllers/userLogin.js";
import salesRouter from "./routes/sales.js";
import productionRouter from "./routes/production.js";
import deliveryRouter from "./routes/delivery.js";
import axios from "axios";
import {
  getProfile,
  listAllOrders,
} from "./controllers/admin/adminController.js";
import { auth } from "./middleware/auth.js";
import { Console } from "console";
const port = 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for URL-encoded bodies
app.use(cors());
// app.use(
//   cors({
//     origin: "*", // Or specify a domain like 'http://yourwebapp.com'
//     methods: ["GET", "POST"],
//   })
// );
app.use("/admin", adminRouter);
app.use("/sales", salesRouter);
app.use("/prod", productionRouter);
app.use("/delivery", deliveryRouter);
connectDB();
app.get("/", (req, res) => {
  return res.status(200).json("Welcome to MattressWala! ❤️");
});
app.post("/login", loginUser);
app.get("/listOrders", listAllOrders);
app.get("/getProfile", auth, getProfile);

app.get("/proxy", async (req, res) => {
  const imageUrl = req.query.url;
  console.log("Proxy request for URL:", imageUrl);

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0", // Mimic a browser request
      },
    });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).send("Failed to fetch the image.");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
