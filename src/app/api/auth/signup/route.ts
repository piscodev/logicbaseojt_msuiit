import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Cashier } from "@/app/lib/Interface/route";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { DateTime } from "luxon";
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // ✅ Check database connection
    const connection = await pool.getConnection();
    try{
      // ✅ Check if email already exists
      const existingUser: [Cashier[], FieldPacket[]] = await connection.query("SELECT id FROM Cashier WHERE email = ?", [email]) as [Cashier[], FieldPacket[]];
      console.log('Existing user: ', existingUser[0]);
      if (existingUser[0].length > 0) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      }

      const formattedDateString = DateTime.now().setZone('Asia/Manila').toFormat('yyyy-LL-dd')
      // ✅ Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // ✅ Insert new user
      console.log('Will insert user ');
      const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
        "INSERT INTO Cashier (name, email, hashed_password, registeredAt) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, formattedDateString]
      ) as [ResultSetHeader, FieldPacket[]];
      console.log('Inserted user ');
      // ✅ Generate JWT Token
      const token = jwt.sign(
        { id: result.insertId, email }, // Payload
        process.env.JWT_SECRET!,        // Secret key
        { expiresIn: "1d" }             // Expires in 1 day
      );
      // ✅ Store token in cookies
      const response = NextResponse.json({ 
        message: "User registered successfully!", 
        user: { id: result.insertId, email } 
      },
        { status: 201 }
      );
      response.headers.set(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
      );
      return response;
    } catch(error){
      throw new Error (`Database error: ${error}`);
    } finally {
      if(connection) connection.release();
    }
    
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
