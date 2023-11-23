import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import branchRoutes from "./routes/branchRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import foodRoutes from "./routes/foodRoute.js";
import cartRoute from "./routes/cartRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import billsRoute from "./routes/billsRoute.js";
import atRoute from "./routes/atRoute.js";
import roomcategoryRoutes from "./routes/roomcategoryRoutes.js"
import roomsubcategoryRoutes from "./routes/roomsubcategoryRoute.js"
import hotelbookRoute from "./routes/hotelbookRoute.js"
import roomRoute from "./routes/roomRoute.js"
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/At",atRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/branch", branchRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/roomcategory", roomcategoryRoutes);
app.use("/api/v1/roomsubcategory", roomsubcategoryRoutes);
app.use("/api/v1/food", foodRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/bills", billsRoute);
app.use("/api/v1/rooms",roomRoute)
app.use("/api/v1/hotel",hotelbookRoute)

// static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Restaurant app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//invoice generators

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
