import express from "express";
import { pool } from "../db.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const result = await pool.query(
    "SELECT id, name FROM departments ORDER BY name"
  );
  res.json(result.rows);
});

export default router;
