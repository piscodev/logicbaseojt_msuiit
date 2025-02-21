import { NextResponse } from "next/server";


export async function GET()
{

    // query
    return NextResponse.json({ cashiers: [] })
}