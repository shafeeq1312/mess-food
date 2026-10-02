import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`MessMate API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
  console.log("URI loaded:", !!process.env.MONGO_URI);
console.log(
  "Username:",
  process.env.MONGO_URI?.split("://")[1]?.split(":")[0]
);