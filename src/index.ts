import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";

import { anyRoute } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

server.listen(3000, () => console.log("Server listening on port 3000"));

//all the routes
app.use("/any", anyRoute);

// mongo database connection ****

// const MONGO_DB_URL = process.env.MONGO_DB_URL!;

// mongoose
//   .connect(MONGO_DB_URL)
//   .then(() => console.log("Connect to MongoDB"))
//   .catch((err) => console.log("Error When Connecting to mongodb", err));
