import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { connectDB } from "./dbConnect.js";
const port = 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
connectDB();

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
