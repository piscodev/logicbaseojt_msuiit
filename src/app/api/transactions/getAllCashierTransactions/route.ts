import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/lib/Database/db';
import { Cashier } from '@/app/lib/Interface/interface';
import { FieldPacket } from 'mysql2';
import { ParticularDefinition } from '@/app/lib/Interface/interface';

export async function POST(req: NextRequest){
    if(req.method === 'POST'){
        let connection;
        try{
            const date = await req.json();
            connection = await pool.getConnection()
            // Get all predefined particulars in order
            const [particulars]: [ParticularDefinition[], FieldPacket[]] = await connection.query(`
            SELECT id, name, type, fee_percent 
            FROM Particular
            ORDER BY FIELD(id, 
                1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18
            )
            `) as [ParticularDefinition[], FieldPacket[]];
            // Query to get all cashier names
            const [rows]: [Cashier[],FieldPacket[]] = await connection.query(
                `SELECT c.id, c.name 
                FROM Cashier AS c ORDER BY c.name ASC
                `
            ) as [Cashier[],FieldPacket[]];
            console.log('Result: ', rows);
            // Extract just the names from the result
            const cashiers = rows.map((row: Cashier) => ({
                cashier_id: row.id,
                name: row.name
            }));
            // console.log('Result: ', cashiers);
            
            return NextResponse.json(
                { cashiers },
                { status: 200 }
            );
      
    } catch (error) {

        } finally {

        }
    } else {
        return NextResponse.json({error: "Method not allowed.", status: 405})
    }
}