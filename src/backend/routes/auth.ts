// src/backend/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.ts";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

/* ================= ADMIN EXISTS ================= */
router.get("/admin-exists", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id FROM users WHERE role = $1 LIMIT 1",
      ["admin"]
    );

    res.json({ exists: result.rows.length > 0 });
  } catch (err) {
    console.error("Admin exists check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  const { full_name, email, password, role, department_id } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const userRole = role || "student";

  if (userRole !== "admin" && !department_id) {
    return res.status(400).json({ message: "Department is required" });
  }

  try {
    if (userRole === "admin") {
      const existingAdmin = await pool.query(
        "SELECT id FROM users WHERE role = $1 LIMIT 1",
        ["admin"]
      );

      if (existingAdmin.rows.length > 0) {
        return res.status(400).json({
          message: "Admin limit exceeded. Only one admin is allowed"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
       (full_name, email, password_hash, role, department_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, role`,
      [
        full_name,
        email.toLowerCase(),
        hashedPassword,
        userRole,
        userRole === "admin" ? null : department_id
      ]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const emailLower = email.toLowerCase();

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [emailLower]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    let isMatch = false;

    if (user.password_hash.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      isMatch = password === user.password_hash;
      if (isMatch) {
        const newHashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          "UPDATE users SET password_hash = $1 WHERE id = $2",
          [newHashedPassword, user.id]
        );
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.cookie("user", user.email, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    });

    res.cookie("user_id", user.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        department_id: user.department_id
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGOUT ================= */
router.post("/logout", (_req, res) => {
  res.clearCookie("user", { path: "/" });
  res.json({ success: true });
});

export default router;