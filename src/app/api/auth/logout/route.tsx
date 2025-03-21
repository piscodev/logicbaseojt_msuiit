import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
export async function POST(req: Request) {
  if (req.method !== "POST") {
    console.error("Method not allowed:", req.method);
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }
  let connection = null;
  try{
    const email = await req.json()
    connection = await pool.getConnection();
    console.log("email: ", email);
    await connection.query("UPDATE users SET active = 0 WHERE email = ?", [email]) ;
  } catch (error) {
    console.error("Database error:", error);
  } finally{
    if (connection) connection.release();
    return NextResponse.json({ message: "Logged out successfully" });
  }
}
