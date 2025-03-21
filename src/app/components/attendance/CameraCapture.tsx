'use client'

import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Alert, Space } from "antd";
import { useUserStore } from "@/stores/userStore";
import Meta from "antd/es/card/Meta";
import ShiftHistoryTable from "./ShiftHistoryTable";
// import CashiersTable from "../CashiersTable";

// computation: 8 * 60 * 60 * 1000
// para mas dali kay difference lang ang computon ayha sya maka time-out dadto sa api
// return lng dayn ug message na di pa kalogout chuchu
// const workHours = 28_800_000 // 8 hours in milliseconds // maybe kato 4hrs sguro

// const shiftHour = 14_400_000 // 4 hours in milliseconds


// GPT
const formatTimeLeft = (ms: number) =>
{
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}h : ${minutes}m : ${seconds}s`
}

function isNumeric(value: number): boolean
{
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dateConv(date: number): string
{
  return isNumeric(date)
    ? new Date(date).toLocaleString("en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "numeric",
        hour12: true
      })
    : ""
}


// TODO (paklay): revise pa nako ang login kay murag lisod e scale pd. bale simpleon lang,
                  // input ang html form data: user | email, password
                  // tapos retrieve sa api ang result sa query pag login sa user, then e set sa login component then e store sa userStore()

const CameraCapture = () =>
{
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [cashierTimeInData, setCashierTimeInData] = useState([])
  const [btnLoading, setBtnLoading] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const photoRef = useRef<HTMLImageElement | null>(null)

  const [timeInStamp, setTimeInStamp] = useState<number>(0)
  const [timeOutStamp, setTimeOutStamp] = useState<number>(0)

  const [isTimedIn, setIsTimedIn] = useState<boolean>(false)
  const [message, setMessage] = useState<string[] | null>()

  const fetchTodayAttendance = async() =>
  {
    if (!user)
      return

    const name = user.first_name + " " + user.last_name
    const response = await fetch('/api/attendance/shiftHistory',
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name })
    })

    const data = await response.json()
    if (!data)
      return console.error("Error getting Cashier data")

    setCashierTimeInData(data.data)
    startCamera()

    const videoElement = videoRef.current
    if (videoElement?.srcObject)
    {
        const stream = videoElement.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
    }

    // console.log("TEST: ", Array.from(data.data));

    // setCashierTimeInData(Array.from(data.data))
      
    // if(data.message === "Record for today doesn't exists"){
    // if(data.success){

      
        // setIsTimedIn(false)
        // setIsTimedOut(false)
      // } else if (data.message === "Record for time in already exists") {
        // setIsTimedIn(true)
        // setTimeInTimeStamp(DateTime.fromISO(data.data.time_in).toFormat("yyyy-LL-dd HH:mm:ss"))
        // setIsTimedOut(false)
      // }
      // else if (data.message === "Record for today already exists") {
        // setIsTimedIn(true)
        // setIsTimedOut(true)
        // setTimeInTimeStamp(DateTime.fromISO(data.data.time_in).toFormat("yyyy-LL-dd HH:mm:ss"))
        // setTimeOutTimeStamp(DateTime.fromISO(data.data.time_out).toFormat("yyyy-LL-dd HH:mm:ss"))
      // }
    }

  const startCamera = async () =>
  {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop()) // Stop old tracks
    }
  
    try
    {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 640, facingMode: "user" },
        audio: false,
      })

      if (videoRef.current)
      {
        videoRef.current.srcObject = stream
        videoRef.current.style.transform = "scaleX(-1)"
        await videoRef.current.play()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  useEffect(() =>
  {
      fetchTodayAttendance()
  }, [timeInStamp, timeOutStamp, isTimedIn, user])

  const handleTimeIn = async () =>
  {
    if (btnLoading)
      return

      takePhoto('in')
  }

  const handleTimeOut = async () =>
  {
    if (btnLoading)
      return

    takePhoto('out')
  }

  // Optimized GPT
  const takePhoto = async (type: "in" | "out") =>
  {
    if (!videoRef.current || !canvasRef.current || !photoRef.current)
      return
  
    setBtnLoading(true)
  
    try
    {
      const context = canvasRef.current.getContext("2d")
      if (!context)
        return
  
      const width = 320
      const height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width)
  
      canvasRef.current.width = width
      canvasRef.current.height = height
      context.drawImage(videoRef.current, 0, 0, width, height)
  
      const imageData = canvasRef.current.toDataURL("image/png")
      photoRef.current.src = imageData
  
      const dateNow = new Date()
  
      const response = await fetch("/api/attendance/logon",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.user_id, imageSrc: imageData, time: dateNow, hasTimedIn: isTimedIn }),
      })
  
      if (!response.ok)
        throw new Error("Failed to log attendance")
  
      const data = await response.json()
      if (!data)
        throw new Error("No data received")
  
      if (type === "in" && data.timeIn)
      {
        if (user)
        {
          setUser({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            contact_number:user.contact_number,
            age:user.age,
            email: user.email,
            user_type: user.user_type,
            loginData: {
              time_in: new Date(data.timeIn).toString(),
              time_in_image: imageData,
              time_out: (timeOutStamp > 0) ? new Date(timeOutStamp).toString() : "",
              time_out_image: (timeOutStamp > 0) ? imageData : ""
            }
          })
        }

        setTimeInStamp(data.timeIn || 0)
        sendNotification("🔔 Attendance Notification", `Cashier: ${user?.first_name} ${user?.last_name} has successfully Timed-In!`)
        setIsTimedIn(true)
      } else if (type === "out" && data.timeOut)
      {
        if (user)
        {
          setUser({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            contact_number:user.contact_number,
            age:user.age,
            email: user.email,
            user_type: user.user_type,
            loginData: {
              time_in: user.loginData?.time_in ? user.loginData?.time_in : "",
              time_in_image: user.loginData?.time_in_image ? user.loginData?.time_in_image : "",
              time_out: new Date(dateNow).toString(),
              time_out_image: imageData
            }
          })
        }

        setTimeOutStamp(data.timeOut || 0)
        sendNotification("🔔 Attendance Notification", `Cashier: ${user?.first_name} ${user?.last_name} has successfully Timed-Out!`)
        setIsTimedIn(false)
      }
  
      setMessage([data.type || "error", data.message || "", data.timeLeft || 0])
      fetchTodayAttendance()
    } catch (error) {
      console.error("Error logging attendance:", error)
      setIsTimedIn(false)
    } finally {
      setBtnLoading(false)
    }
  }

  const sendNotification = async (title: string, desc: string) =>
  {
    try {
      await fetch("/api/notifications/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc }),
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }  
  
  // unoptimized Paklay
  // const takePhoto = async (typ: string) =>
  // {
  //   if (!videoRef.current || !canvasRef.current || !photoRef.current)
  //       return

  //   setBtnLoading(true)

  //   try
  //   {
  //   const context = canvasRef.current.getContext("2d")
  //   if (!context)
  //       return

  //   const dateNow = new Date(getCurrentTime())

  //   if (dateNow.getHours() >= 8 && dateNow.getHours() < 13 || dateNow.getHours() >= 12 && dateNow.getHours() < 17 || dateNow.getHours() >= 16 && dateNow.getHours() < 21)
  //   {
  //     setIsTimedIn(false)
  //     setTimeInStamp(0)
  //   }

  //   const width = 320
  //   const height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width)

  //   canvasRef.current.width = width
  //   canvasRef.current.height = height
  //   context.drawImage(videoRef.current, 0, 0, width, height)

  //   const imageData = canvasRef.current.toDataURL("image/png")
  //   photoRef.current.src = imageData
  //   // console.log("Image data: ", imageData)
  //   // setImageSrc(() =>
  //   // {
  //   //   console.log("Setting ImageSrc:", imageData.substring(0, 50))
  //   //   return imageData
  //   // })

  //   if (typ === 'in')
  //   {
  //     await fetch('/api/attendance/logon',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ userId: user?.user_id, imageSrc: imageData, time: dateNow, hasTimedIn: isTimedIn })
  //     }).then(async response =>
  //     {
  //       // if (!response.ok)
  //       //   return console.error("Error: ", response.statusText)

  //       const data = await response.json()
  //       if (!data)
  //         return console.error("Error: No data received")

  //       if (data.timeIn)
  //       {
  //         if (user)
  //         {
  //           setUser({
  //             user_id: user.user_id,
  //             name: user.name,
  //             email: user.email,
  //             user_type: user.user_type,
  //             loginData: {
  //               time_in: new Date(data.timeIn).toString(),
  //               time_in_image: imageData,
  //               time_out: (timeOutStamp > 0) ? new Date(timeOutStamp).toString() : "",
  //               time_out_image: (timeOutStamp > 0) ? imageData : ""
  //             }
  //           })
  //         }

  //         setTimeInStamp(data.timeIn || 0)
  //         fetchTodayAttendance()
  //         sendNotification("🔔 Attendance Notification", `Cashier: ${user?.name} has successfully Timed-In!`)
  //       }
  //       setIsTimedIn(true)


  //       setMessage([data.type || "error", data.message || "", data.timeLeft || 0])
  //     }).catch(err => 
  //     {
  //       console.error("Error accessing camera:", err)
  //       setIsTimedIn(false)
  //     }).finally(() => setBtnLoading(false))
  //   } else {

  //     // time-out
  //     await fetch('/api/attendance/logon',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ userId: user?.user_id, imageSrc: imageData, time: dateNow, hasTimedIn: isTimedIn })
  //     }).then(async response =>
  //     {
  //       if (!response.ok)
  //         return console.error("Error: ", response.statusText)
  
  //       const data = await response.json()
  //       if (!data)
  //         return console.error("Error: No data received")
  
  //       if (data.type === "error")
  //       {
  //         setIsTimedIn(false)
  //       } else {

  //         if (data.timeOut)
  //         {
  //           setTimeOutStamp(data.timeOut || 0)
  //           console.log(data.timeOut)
  //         }

  //         if (user)
  //         {
  //           setUser({
  //             user_id: user.user_id,
  //             name: user.name,
  //             email: user.email,
  //             user_type: user.user_type,
  //             loginData: {
  //               time_in: user.loginData?.time_in ? user.loginData?.time_in : "",
  //               time_in_image: user.loginData?.time_in_image ? user.loginData?.time_in_image : "",
  //               time_out: new Date(dateNow).toString(),
  //               time_out_image: imageData
  //             }
  //           })
  //         }

  //         fetchTodayAttendance()
  //         sendNotification("🔔 Attendance Notification", `Cashier: ${user?.name} has successfully Timed-Out!`)
  //         setIsTimedIn(false)
  //       }

  //       setMessage([data.type || "error", data.message || "", data.timeLeft || 0])
  //     }).catch(err =>
  //     {
  //       console.error("Error accessing camera:", err)
  //       setIsTimedIn(false)
  //     }).finally(() => setBtnLoading(false))
  //   }
  // }

  return (
    <Card title={"Attendance | User: " + user?.first_name}>
      <Space direction="vertical" style={{ marginBottom: '24px' }}>
        <Meta
          title={
            user?.loginData?.time_in
              ? "Timed-In: " + dateConv(new Date(user?.loginData?.time_in).getTime())
              : "Timed-In: N/A"
          }
        />
        <Meta
          title={
            user?.loginData?.time_out
              ? "Timed-Out: " + dateConv(new Date(user?.loginData?.time_out).getTime())
              : "Timed-Out: N/A"
          }
        />
      </Space>

      <Row>
        <Col className="p-2" flex="1 1 80px">
            <ShiftHistoryTable data={cashierTimeInData} isLoading={btnLoading} />
        </Col>
        <Col className="p-2" flex="0 1 500px">
        <Card title={"Status: " + (!isTimedIn ? "To Time-In" : "To Time-Out")}>
          {/* <h1>Camera Capture</h1> */}
          <p>Take a selfie</p>

          <div className="camera" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <video ref={videoRef} width="auto" height="240">
              Video stream not available.
            </video>
            {!isTimedIn && !user?.loginData?.time_in ? 
              (<Button type="primary" onClick={handleTimeIn} loading={btnLoading} disabled={btnLoading}>
                Time-In
              </Button>
              ) :
              <Button type="primary" onClick={handleTimeOut} loading={btnLoading} disabled={btnLoading}>
                Time-Out
              </Button>
            }
            {/* { timeInStamp === 0 ? <Alert message={"Successfully timed-in at dateConv(millis) "} type="success" showIcon closable /> : "" } */}
            {message && 
              <Alert
                message={
                  <>
                    {message[1]} 
                    {parseInt(message[2]) > 0 && ` (Time Left: ${formatTimeLeft(Number(message[2]))})`}
                  </>
                }
                type={message[0] as "success" | "info" | "warning" | "error"}
                showIcon
                closable
              />
            }
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          <div className="output" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            {}
            <img ref={photoRef !== null ? photoRef : ""} />
          </div>
        </Card>

        </Col>
      </Row>
    </Card>
  )
}

export default CameraCapture