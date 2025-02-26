import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/Database/db';
import { FieldPacket } from 'mysql2';


interface ResponseData {
    version: string | number
}


export async function GET(req: NextRequest) {
    if (req.method === 'GET') {
        try {
            const connection = await pool.getConnection();
            const [rows]:[ResponseData[], FieldPacket[]]= await connection.query('SELECT VERSION() AS version') as [ResponseData[], FieldPacket[]];
            connection.release();
            console.log("rows: ",rows);
            return NextResponse.json({ 
            success: true,
            version: rows[0].version,
            status:200
            });
        } catch (error) {
            console.error('Connection test failed:', error);
            return NextResponse.json({ 
            success: false,
            error: error, 
            status: 500
            });
        }
    } else {
        console.error("Method is: ", req.method);
        return NextResponse.json({success: false,
            status: 505})
    }
}