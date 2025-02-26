import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Fetch user by email
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      const response = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      // Clear any existing token
      response.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
      return response;
    }

    const user = rows[0];

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const response = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      // Clear any existing token
      response.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
      return response;
    }

    // Generate JWT Token (expires in 1 day)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Store token in cookies (Secure, HTTPOnly)
    const response = NextResponse.json({ message: "Login successful", user }, { status: 200 });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
