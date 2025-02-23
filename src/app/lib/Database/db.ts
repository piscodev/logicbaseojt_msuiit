import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { promisify } from 'util';
import { FieldPacket } from 'mysql2';
dotenv.config();

const db_port : number = process.env.DB_PORT as unknown as number
// Create a pool with proper configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST, // "mysql-9f132e1-tcmc-62a0.l.aivencloud.com"
  user: process.env.DB_USER, // "avnadmin"
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // "logicbase_ojt_db"
  port: db_port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00',
  connectTimeout: 60000,
});

export const getConnection = promisify(pool.getConnection).bind(pool);

// Function to query the database

export const query = async (sql: string, params: unknown[]) =>
  {
    let conn
    try
    {
      conn = await pool.getConnection()
      const [rows]: [unknown[], FieldPacket[]] = await conn.query(sql, params) as [unknown[], FieldPacket[]]
  
      return rows
    } catch (error) {
      console.error('Database query error:', error)
    } finally {
  
      if (conn)
        conn.release()
    }
}

// Export the pool to be used in other modules
export default pool;
