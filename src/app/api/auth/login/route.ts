import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Query the database for user with matching email and password
    const [rows]: any = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user: rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
