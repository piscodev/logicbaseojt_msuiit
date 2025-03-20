import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/app/lib/Interface/interface";
import { FieldPacket } from "mysql2";

export async function POST(req: Request) {
  let connection = null;
  try {
    const { email, password } = await req.json();
    connection = await pool.getConnection();
    // Fetch user by email
    const [rows]: [User[], FieldPacket[]] = await pool.query(
      "SELECT * FROM users WHERE email = ?", 
      [email]
    ) as [User[], FieldPacket[]];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Email not found. Please sign up first." }, { status: 401 });;
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, rows[0].hashed_password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Generate JWT Token (expires in 1 day)
    const token = jwt.sign(
      { user_id: rows[0].user_id, email: rows[0].email, name: rows[0].name }, // Include name in the token
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    await connection.query(
      "UPDATE users SET last_login = NOW(), active = 1 WHERE email = ?", 
      [email]
    ) as [User[], FieldPacket[]];

    // Store token in cookies (Secure, HTTPOnly)
    const response = NextResponse.json(
      { message: "Login successful", user: { user_id: rows[0].user_id, name: rows[0].name, email: rows[0].email, user_type: rows[0].user_type } }, 
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
  } finally {
    if(connection) connection.release();
  }
}
