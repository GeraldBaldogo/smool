import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.ts";
import departmentRoutes from "./routes/departments.ts";
import { pool } from "./db.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);

// Test route
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is running");
});

// POST maintenance request
app.post("/requests", async (req: Request, res: Response) => {
  const { user_id, title, description } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO maintenance_requests (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, title, description]
    );

    res.json({ success: true, request: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create request",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
