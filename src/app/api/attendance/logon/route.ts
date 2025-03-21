import pool from "@/app/lib/Database/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface AttendanceData
{
    id: number,
    time_in: string,
    time_out: string,
}

export const dynamic = 'force-dynamic'

const workShiftHoursToMillis = 14_400_000 // 4 hours in milliseconds // 4 * 60 * 60 * 1000

// export async function GET() // testing purposes
export async function POST(req: NextRequest)
{
    let conn = null
    try
    {
        const { userId, imageSrc, time, hasTimedIn} = await req.json()
        if (!userId || !time)
            return NextResponse.json({ type: "error", message: "Missing userId or time in request body" }, { status: 400 })
        
        if (!imageSrc)
            return NextResponse.json({ type: "error", message: "Missing imageSrc" }, { status: 400 })

        // test purposes
        // console.log(userId, imageSrc, hasTimedIn)
        // if (!userId || !imageSrc || !hasTimedIn)
        //     return NextResponse.json({ type: "error", message: "Failed to initialize record" }, { status: 500 })
        // const userId = 2
        // const imageSrc = ''
        // const hasTimedIn = false
        if (hasTimedIn)
            console.log(hasTimedIn) // test purposes

        const initTime = new Date(time)

        // AM Shift: 8:00 AM - 12:00 PM (4 hours)
        // MID Shift: 12:00 PM - 4:00 PM (4 hours)
        // PM Shift: 4:00 PM - 8:00 PM (4 hours)
        let shift
        if (initTime.getHours() >= 8 && initTime.getHours() < 13)
            shift = "AM"
        else if (initTime.getHours() >= 12 && initTime.getHours() < 17)
            shift = "MID"
        else if (initTime.getHours() >= 16 && initTime.getHours() < 21)
            shift = "PM"

        conn = await pool.getConnection()

        // check if timed-out already
        const checkTimedOut = "SELECT * FROM users_cashiers_attendance WHERE user_cashier_id = (SELECT c.user_cashier_id FROM users_cashiers c JOIN users u ON c.user_id = u.user_id WHERE u.user_id = ?) AND DATE(time_out) = CURDATE() AND shift = ?"
        const [row_check]: [AttendanceData[], FieldPacket[]] = await conn.execute(checkTimedOut, [userId, shift]) as [AttendanceData[], FieldPacket[]]
        if (row_check.length === 1)
        {
            const rc_timeIn = row_check[0].time_in
            const rc_timeOut = row_check[0].time_out
            return NextResponse.json({ type: "info", message: "Already Timed-Out! Wait for the next shift.", timeIn: rc_timeIn, timeOut: rc_timeOut }, { status: 200 })
        }

        // kung naa na PM si specific user kay check for tomorrow napd
        const checkOccupiedShifts = "SELECT * FROM users_cashiers_attendance WHERE user_cashier_id = (SELECT c.user_cashier_id FROM users_cashiers c JOIN users u ON c.user_id = u.user_id WHERE u.user_id = ?) AND DATE(time_in) = CURDATE() AND shift = 'PM'"
        const [row_shift]: [AttendanceData[], FieldPacket[]] = await conn.execute(checkOccupiedShifts, [userId]) as [AttendanceData[], FieldPacket[]]
        if (row_shift.length === 1)
            return NextResponse.json({ type: "info", message: "Unable to Time-Out, try again tomorrow!" }, { status: 200 })

        // check if naka time-in
        const query = "SELECT * FROM users_cashiers_attendance WHERE user_cashier_id = (SELECT c.user_cashier_id FROM users_cashiers c JOIN users u ON c.user_id = u.user_id WHERE u.user_id = ?) AND DATE(time_in) = CURDATE() AND shift = ?"
        const [rows]: [AttendanceData[], FieldPacket[]] = await conn.execute(query, [userId, shift]) as [AttendanceData[], FieldPacket[]]
        if (rows.length === 0)
        {
            // if wala pa naka time-in ang cashier, insert
            const [result] : [ResultSetHeader, FieldPacket[]] = await conn.execute("INSERT INTO users_cashiers_attendance (user_cashier_id, time_in, time_in_image, shift) VALUES ((SELECT c.user_cashier_id FROM users_cashiers c WHERE c.user_id = ?), ?, ?, ?)", [userId, initTime, imageSrc, shift]) as [ResultSetHeader, FieldPacket[]]
            if (result.affectedRows === 0)
                return NextResponse.json({ type: "error", message: "Failed to insert record" }, { status: 500 })

            // Re-query the updated record
            const reQuery = "SELECT * FROM users_cashiers_attendance WHERE user_cashier_id = (SELECT c.user_cashier_id FROM users_cashiers c JOIN users u ON c.user_id = u.user_id WHERE u.user_id = ?) AND DATE(time_in) = CURDATE() AND shift = ? AND time_in_image = ?"
            const [updatedRow]: [AttendanceData[], FieldPacket[]] = await conn.execute(reQuery, [userId, shift, imageSrc]) as [AttendanceData[], FieldPacket[]]
            if (updatedRow.length === 0)
                return NextResponse.json({ type: "success", message: "Timed-In successfully!", timeIn: initTime.getTime()}, { status: 200 })

            return NextResponse.json({ type: "success", message: "Timed-In successfully!", timeIn: initTime.getTime() }, { status: 200 })
            // return NextResponse.json(updatedRow, { status: 200 })
        }

        // e check dayun kung pwede na mag time-out ang cashier saiyang shift
        const timeInStamp = new Date(rows[0].time_in).getTime()

        // check ang difference sa time-in ug sa current time para ma differentiate ang
        // time-in ug time-out sa iyang shift (4 hours ang shift; [AM, MID, PM]) // kulang pa condition if naka time-in na sya today so like MID, PM napd
        const timeElapsed = initTime.getTime() - timeInStamp // now - timeIn (previous)
        console.log(timeElapsed)
        // const timeLeft_ = (workShiftHoursToMillis - (diff)) //- 2_000_000
        // const timeLeft_ = (timeElapsed + initTime.getTime()) //- 2_000_000
        const timeLeft_ = workShiftHoursToMillis - timeElapsed
        if (timeElapsed <= workShiftHoursToMillis) // 4 hours in milliseconds
            return NextResponse.json({ type: "error", message: "Cannot time-out yet!", timeLeft: timeLeft_, timeIn: timeInStamp, hasTimedIn: true }, { status: 200 })

        // const isValidDate = () => new Date(rows[0].time_in).toString() !== 'Invalid Date'
        // if (isValidDate())
        //     return NextResponse.json({ type: "warning", message: "Already Timed-In!" }, { status: 200 })

        // init data
        // then update ang row if wla pa naka signout si cashier
        // actually pwede ra sya multiquery, pero for the sake of the exercise, i separate sa nako
        await conn.execute("UPDATE users_cashiers_attendance SET time_out = ?, time_out_image = ? WHERE (SELECT c.user_cashier_id FROM users_cashiers c WHERE c.user_id = ?) AND DATE(time_in) = CURDATE() AND shift = ?", [initTime, imageSrc, userId, shift])

        // Re-query the updated record
        const reQuery = "SELECT * FROM users_cashiers_attendance WHERE user_cashier_id = (SELECT c.user_id FROM users_cashiers c JOIN users u ON c.user_id = u.user_id WHERE u.user_id = ?) AND DATE(time_in) = CURDATE() AND shift = ?"
        const [updatedRow]: [AttendanceData[], FieldPacket[]] = await conn.execute(reQuery, [userId, shift]) as [AttendanceData[], FieldPacket[]]
        if (updatedRow.length === 0)
            return NextResponse.json({ type: "success", message: "Timed-Out successfully!", timeOut: initTime.getTime(),  }, { status: 200 })
            // return NextResponse.json( { type: "error", message: "No record found!" }, { status: 404 })

        return NextResponse.json({ ...updatedRow, timeOut: initTime.getTime() }, { status: 200 })
    } catch (error) {
        console.error(error)
    } finally {
        
        if (conn)
            conn.release()
    }
}