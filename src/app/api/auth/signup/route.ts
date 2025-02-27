import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // ✅ Ensure request body is valid JSON
    const body = await req.text();
    console.log("📥 Received Body:", body); // Debugging
    const { email, password } = JSON.parse(body);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Check database connection
    await pool.getConnection().then(() => console.log("✅ Database Connected!"));

    // ✅ Check if email already exists
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [existingUser]: any = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [result]: any = await pool.query(
      "INSERT INTO users (email, password, registeredAt) VALUES (?, ?, NOW())",
      [email, hashedPassword]
    );

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: result.insertId, email }, // Payload
      process.env.JWT_SECRET!,        // Secret key
      { expiresIn: "1d" }             // Expires in 1 day
    );

    // ✅ Store token in cookies
    const response = NextResponse.json(
      { message: "User registered successfully!", user: { id: result.insertId, email } },
      { status: 201 }
    );
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
