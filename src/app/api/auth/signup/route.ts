import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/app/lib/Interface/interface";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { DateTime } from "luxon";
export async function POST(req: Request) {
  try {
    const { first_name, last_name, contact_number, address, gender, email, age, password, user_type, rate, admin_position, user_admin_id } = await req.json();
    console.log("Rate: ", rate)
    console.log("Type: ", user_type)
    console.log("Password: ", password)
    console.log("First Name: ", first_name)
    console.log("Last Name: ", last_name)
    console.log("Email: ", email)
    console.log("Address: ", address)
    console.log("Gender: ", gender)
    console.log("Age: ", age)
    console.log("Contact Number: ", contact_number)

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // ✅ Check database connection
    const connection = await pool.getConnection();
    try{
      // ✅ Check if email already exists
      const existingUser: [User[], FieldPacket[]] = await connection.query("SELECT user_id FROM users WHERE email = ?", [email]) as [User[], FieldPacket[]];
      console.log('Existing user: ', existingUser[0]);
      if (existingUser[0].length > 0) {
        return NextResponse.json({ error: `The email: ${email} is already registered.`, title:"Account already exists" }, { status: 400 });
      }

      const formattedDateString = DateTime.now().setZone('Asia/Manila').toFormat('yyyy-LL-dd')
      // ✅ Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // ✅ Insert new user
      console.log('Will insert user ');
      let query;
      let values=[];
      if(user_type==='admin'){
        query = "INSERT INTO users (user_type, contact_number, first_name, last_name, address, email, gender, age, hashed_password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        values=[user_type, contact_number, first_name, last_name, address, email, gender, age, hashedPassword, formattedDateString];
      } else {
        query = "INSERT INTO users (contact_number, first_name,  last_name, address, email, gender, age, hashed_password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        values=[contact_number, first_name, last_name, address, email, gender, age, hashedPassword, formattedDateString];
      }
      const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
        query,
        values
      ) as [ResultSetHeader, FieldPacket[]];
      console.log('Inserted user ');

      const userId = result.insertId;
      let userAdminId = null;
      if(user_type!=='admin'){
        const [cashier]: [ResultSetHeader, FieldPacket[]] = await connection.query(
          "INSERT INTO users_cashiers (user_id, rate, user_admin_id) VALUES (?, ?, ?)",
          [userId, rate, user_admin_id]
        ) as [ResultSetHeader, FieldPacket[]];
        console.log("Inserted Cashier: ", cashier)
      } else if (user_type === 'admin') {
        const [admin]: [ResultSetHeader, FieldPacket[]] = await connection.query(
          "INSERT INTO users_admins (user_id, admin_position) VALUES (?, ?)",
          [userId, admin_position]
        ) as [ResultSetHeader, FieldPacket[]];
        console.log("Inserted Admin: ", admin)
        userAdminId = admin.insertId
      }
      
      // ✅ Generate JWT Token
      const token = jwt.sign(
        { id: result.insertId, email }, // Payload
        process.env.JWT_SECRET!,        // Secret key
        { expiresIn: "1d" }             // Expires in 1 day
      );
      // ✅ Store token in cookies
      const response = NextResponse.json({ 
        message: user_type==="cashier"?"Cashier registered successfully!":"User registered successfully!", 
        title: "Account Created!",
        user: { user_id: userId, user_admin_id: userAdminId} 
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
