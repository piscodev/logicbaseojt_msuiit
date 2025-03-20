import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/app/lib/Interface/interface";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { DateTime } from "luxon";
export async function POST(req: Request) {
  try {
    const { name, email, password, user_type, rate } = await req.json();
    console.log("Rate: ", rate)
    console.log("Type: ", user_type)
    console.log("Password: ", password)
    console.log("Name: ", name)
    console.log("Email: ", email)

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // ✅ Check database connection
    const connection = await pool.getConnection();
    try{
      // ✅ Check if email already exists
      const existingUser: [User[], FieldPacket[]] = await connection.query("SELECT user_id FROM users WHERE email = ?", [email]) as [User[], FieldPacket[]];
      console.log('Existing user: ', existingUser[0]);
      if (existingUser[0].length > 0) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      }

      const formattedDateString = DateTime.now().setZone('Asia/Manila').toFormat('yyyy-LL-dd')
      // ✅ Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // ✅ Insert new user
      console.log('Will insert user ');
      let query;
      let values=[];
      if(user_type==='admin'){
        query = "INSERT INTO users (user_type, name, email, hashed_password, created_at) VALUES (?, ?, ?, ?, ?)";
        values=[user_type, name, email, hashedPassword, formattedDateString];
      } else {
        query = "INSERT INTO users (name, email, hashed_password, created_at) VALUES (?, ?, ?, ?)";
        values=[name, email, hashedPassword, formattedDateString];
      }
      const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
        query,
        values
      ) as [ResultSetHeader, FieldPacket[]];
      console.log('Inserted user ');

      const userId = result.insertId;
      if(user_type!=='admin'){
        const [cashier]: [ResultSetHeader, FieldPacket[]] = await connection.query(
          "INSERT INTO users_cashiers (user_id, rate) VALUES (?, ?)",
          [userId, rate]
        ) as [ResultSetHeader, FieldPacket[]];
        console.log("Inserted Cashier: ", cashier)
      }
      
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
