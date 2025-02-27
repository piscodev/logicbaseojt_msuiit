import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Cashier } from "@/app/lib/Interface/route";
import { FieldPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Fetch user by email
    const [rows]: [Cashier[], FieldPacket[]] = await pool.query(
      "SELECT * FROM Cashier WHERE email = ?", 
      [email]
    ) as [Cashier[], FieldPacket[]];

    if (rows.length === 0) {
      const response = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      response.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
      return response;
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, rows[0].hashed_password);
    if (!isMatch) {
      const response = NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      response.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
      return response;
    }

    // Generate JWT Token (expires in 1 day)
    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email, name: rows[0].name }, // Include name in the token
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Store token in cookies (Secure, HTTPOnly)
    const response = NextResponse.json(
      { message: "Login successful", user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } }, 
      { status: 200 }
    );
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
