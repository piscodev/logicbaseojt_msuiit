import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/Database/db';
import { FieldPacket } from 'mysql2';


interface ResponseData {
    version: string | number
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = await pool.getConnection();
    const [rows]:[ResponseData[], FieldPacket[]]= await connection.query('SELECT VERSION() AS version') as [ResponseData[], FieldPacket[]];
    connection.release();
    
    res.status(200).json({ 
      success: true,
      version: rows[0].version
    });
  } catch (error) {
    console.error('Connection test failed:', error);
    res.json({ 
      success: false,
      error: error, 
      status: 500
    });
  }
}