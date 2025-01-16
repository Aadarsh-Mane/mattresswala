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
const port = 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for URL-encoded bodies
app.use(cors());
app.use("/admin", adminRouter);
app.use("/sales", salesRouter);
app.use("/prod", productionRouter);
app.use("/delivery", deliveryRouter);
connectDB();
app.get("/", (req, res) => {
  return res.status(200).json("Welcome to MattressWala!");
});
app.post("/api/v1/login", loginUser);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
