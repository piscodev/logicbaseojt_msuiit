import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Ensure only GET requests are allowed
  if (req.method !== "GET") {
    console.error("Method not allowed:", req.method);
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  // Create response
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Properly clear the token
  response.cookies.set("token", "", {
    path: "/", 
    httpOnly: true, 
    secure: true, 
    sameSite: "strict",
    expires: new Date(0), // Expire the cookie immediately
  });

  return response;
}
