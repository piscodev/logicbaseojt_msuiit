import { NextResponse } from 'next/server';
import pool from '@/app/lib/Database/db';
import { RowDataPacket } from 'mysql2';

// Define the structure for DataType and CashierLane
interface DataType {
  key: string;
  id: number;
  name: string;
  email: string;
  last_login?: string;
  address?: string;
  active?: number;
  gender?: string;
  contact_number?: string;
  total_hours_worked?: number;
  total_earnings?: number;
  cashier_lane_id?: number | null;
}

interface CashierLane {
  id: number;
  name: string;
  assignedCashiers: DataType[];
  initialCashiers: DataType[];
}

export async function GET() {
  try {
    const connection = await pool.getConnection();

    // Fetch all cashier lanes and their assigned cashiers
    const [lanes] = await connection.execute<RowDataPacket[]>(
      `
      SELECT 
        CL.lane_id AS id, CL.lane_name AS name,
        C1.user_cashier_id AS cashier1_id, CONCAT(U1.first_name, ' ', U1.last_name) AS user1_name, U1.email AS user1_email, 
        U1.user_type AS user1_type, U1.last_login AS user1_last_login, U1.address AS user1_address,
        U1.active AS user1_active, U1.gender AS user1_gender, U1.contact_number AS user1_contact_number,

        C2.user_cashier_id AS cashier2_id, CONCAT(U2.first_name, ' ', U2.last_name) AS user2_name, U2.email AS user2_email, 
        U2.user_type AS user2_type, U2.last_login AS user2_last_login, U2.address AS user2_address,
        U2.active AS user2_active, U2.gender AS user2_gender, U2.contact_number AS user2_contact_number,

        C3.user_cashier_id AS cashier3_id, CONCAT(U3.first_name, ' ', U3.last_name) AS user3_name, U3.email AS user3_email,
        U3.user_type AS user3_type, U3.last_login AS user3_last_login, U3.address AS user3_address,
        U3.active AS user3_active, U3.gender AS user3_gender, U3.contact_number AS user3_contact_number

      FROM users_cashiers_lane CL
      LEFT JOIN users_cashiers C1 ON CL.cashier1_id = C1.user_cashier_id
      LEFT JOIN users U1 ON C1.user_id = U1.user_id
      LEFT JOIN users_cashiers C2 ON CL.cashier2_id = C2.user_cashier_id
      LEFT JOIN users U2 ON C2.user_id = U2.user_id
      LEFT JOIN users_cashiers C3 ON CL.cashier3_id = C3.user_cashier_id
      LEFT JOIN users U3 ON C3.user_id = U3.user_id
      `
    );

    // Transform the data into the desired structure
    const cashierLanes: CashierLane[] = lanes.map((lane) => {
      const assignedCashiers: DataType[] = [];

      // Check and add each cashier if assigned
      [1, 2, 3].forEach((num) => {
        const cashierId = lane[`cashier${num}_id`];
        if (cashierId) {
          assignedCashiers.push({
            key: String(cashierId),
            id: cashierId,
            name: lane[`user${num}_name`],
            email: lane[`user${num}_email`],
            cashier_lane_id: lane.id,
            last_login: lane[`user${num}_last_login`],
            address: lane[`user${num}_address`],
            active: lane[`user${num}_active`],
            gender: lane[`user${num}_gender`],
            contact_number: lane[`user${num}_contact_number`],

          });
        }
      });

      return {
        id: lane.id,
        name: lane.name,
        assignedCashiers:assignedCashiers,
        initialCashiers: assignedCashiers, // Set initialCashiers for comparison
      };
    });

    connection.release();

    // Return the structured data
    return NextResponse.json({ success: true, data: cashierLanes });
  } catch (error) {
    console.error('Error fetching cashier lanes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
