import express from "express";

import resourceRouter from "./api/resource-router.js";
import normcatagoryRouter from "./api/normcatagory-router.js";
import normgroupRouter from "./api/normgroup-router.js";
import normsRouter from "./api/norms-router.js";
import cors from "cors";

import normdetailsRouter  from "./api/normdetails-router.js";

const router = express();
router.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Basic route
router.get("/", (req, res) => {
  res.send("Welcome to the ESM Node.js App with Router!");
});

// API routes
router.use("/api/normgroup", normgroupRouter);
router.use("/api/resources", resourceRouter);
router.use("/api/normcatagory", normcatagoryRouter);
router.use("/api/norms", normsRouter);

router.use("/api/normdetails",normdetailsRouter);

// 404 handler
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
