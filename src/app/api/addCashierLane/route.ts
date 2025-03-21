import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    console.log("Cashier Lane: ", name);

    // ✅ Check database connection
    const connection = await pool.getConnection();
    try{
      const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
        "INSERT INTO users_cashiers_lane (lane_name) VALUES (?)",
        [name]
      ) as [ResultSetHeader, FieldPacket[]];
      console.log('Inserted Cashier Lane: ', result);
      
      // ✅ Store token in cookies
      return NextResponse.json({ message: "User Cashier Lane added successfully!"},
        { status: 201 }
      );
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
