import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if(req.method === 'GET'){
    // Create a JSON response to indicate logout
    const response = NextResponse.json({ message: "Logged out successfully" });
    // Clear the token by setting it to an empty value and expiring it immediately.
    response.headers.set(
      "Set-Cookie",
      "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
    );
    return response;
  } else {
    console.error("Method not allowed: ", req.method);
    return NextResponse.json({status:405})
  }
}
