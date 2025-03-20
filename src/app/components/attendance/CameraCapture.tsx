'use client'

import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Alert, Space } from "antd";
import { useUserStore } from "@/stores/userStore";
import Meta from "antd/es/card/Meta";
import ShiftHistoryTable from "./ShiftHistoryTable";
import { getCurrentTime } from "@/utils/CurrentTimeHelper";
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

function isNumeric(str: number)
{
  if (typeof str != "number")
    return false

  return !isNaN(str) && !isNaN(Number(str)) && isFinite(str)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dateConv(date: number) : string
{
  return isNumeric(date) ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "numeric", hour12: true }) : ""
}


// TODO (paklay): revise pa nako ang login kay murag lisod e scale pd. bale simpleon lang,
                  // input ang html form data: user | email, password
                  // tapos retrieve sa api ang result sa query pag login sa user, then e set sa login component then e store sa userStore()

const CameraCapture = () =>
{
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const photoRef = useRef<HTMLImageElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [streamSrc, setStreamSrc] = useState<MediaStream | null>(null)

  const [timeInStamp, setTimeInStamp] = useState<number>(0)
  const [timeOutStamp, setTimeOutStamp] = useState<number>(0)

  const [isTimedIn, setIsTimedIn] = useState<boolean>(false)
  const [message, setMessage] = useState<string[] | null>()

  // TO DO next
  const fetchTodayAttendance = async() => {
    if (!user)
      return

    const name = user?.name;
    const response = await fetch('/api/attendance/get', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name})
    })
    const data = await response.json()
    console.log("data attendance exist: ", data);
    // if(data.message === "Record for today doesn't exists"){
    if(data.success){
      startCamera()

      const videoElement = videoRef.current
      if (videoElement?.srcObject)
      {
          const stream = videoElement.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
      }
      // setIsTimedIn(false)
      // setIsTimedOut(false)
    } else if (data.message === "Record for time in already exists") {
      // setIsTimedIn(true)
      // setTimeInTimeStamp(DateTime.fromISO(data.data.time_in).toFormat("yyyy-LL-dd HH:mm:ss"))
      // setIsTimedOut(false)
    }
    else if (data.message === "Record for today already exists") {
      // setIsTimedIn(true)
      // setIsTimedOut(true)
      // setTimeInTimeStamp(DateTime.fromISO(data.data.time_in).toFormat("yyyy-LL-dd HH:mm:ss"))
      // setTimeOutTimeStamp(DateTime.fromISO(data.data.time_out).toFormat("yyyy-LL-dd HH:mm:ss"))
    }
  };

  const startCamera = async () =>
  {
    await navigator.mediaDevices.getUserMedia(
    {
      video: { width: 640, height: 640, facingMode: "user" },
      audio: false,
    }).then(stream =>
    {
      if (videoRef.current)
      {
        videoRef.current.srcObject = stream
        videoRef.current.style.transform = "scaleX(-1)"
        videoRef.current.play()
      }
    }).catch(err => {
        console.error("Error accessing camera:", err)
    })
  }

  useEffect(() =>
  {
      console.log("User:", user);
      // startCamera()

      // retrieveCashierAttendance()
      if (user?.name)
        fetchTodayAttendance()
  }, [isTimedIn, user])

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

  const takePhoto = async (typ: string) =>
  {
    if (!videoRef.current || !canvasRef.current || !photoRef.current)
        return

    setBtnLoading(true)

    const context = canvasRef.current.getContext("2d")
    if (!context)
        return

    const dateNow = new Date(getCurrentTime())

    const width = 320
    const height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width)

    canvasRef.current.width = width
    canvasRef.current.height = height
    context.drawImage(videoRef.current, 0, 0, width, height)

    const imageData = canvasRef.current.toDataURL("image/png")
    photoRef.current.src = imageData
    // console.log("Image data: ", imageData)
    // setImageSrc(() =>
    // {
    //   console.log("Setting ImageSrc:", imageData.substring(0, 50))
    //   return imageData
    // })

    if (typ === 'in')
    {
      await fetch('/api/attendance/get/logon',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.user_id, imageSrc: imageData, time: dateNow, hasTimedIn: isTimedIn })
      }).then(async response =>
      {
        // if (!response.ok)
        //   return console.error("Error: ", response.statusText)

        const data = await response.json()
        if (!data)
          return console.error("Error: No data received")

        if (data.timeIn)
        {
          if (user)
          {
            setUser({
              user_id: user.user_id,
              name: user.name,
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
        }
        setIsTimedIn(true)


        setMessage([data.type || "error", data.message || "", data.timeLeft || 0])
      }).catch(err => 
      {
        console.error("Error accessing camera:", err)
        setIsTimedIn(false)
      }).finally(() => setBtnLoading(false))
    } else {

      // time-out
      await fetch('/api/attendance/get/logon',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.user_id, imageSrc: imageData, time: dateNow, hasTimedIn: isTimedIn })
      }).then(async response =>
      {
        if (!response.ok)
          return console.error("Error: ", response.statusText)
  
        const data = await response.json()
        if (!data)
          return console.error("Error: No data received")
  
        if (data.type === "error")
        {
          setIsTimedIn(false)
        } else {

          if (data.timeOut)
            setTimeOutStamp(data.timeOut)

          if (user)
          {
            setUser({
              user_id: user.user_id,
              name: user.name,
              email: user.email,
              user_type: user.user_type,
              loginData: {
                time_in: user.loginData?.time_in ? user.loginData?.time_in : "",
                time_in_image: imageData,
                time_out: (timeOutStamp > 0) ? String(new Date(timeOutStamp)) : "",
                time_out_image: (timeOutStamp > 0) ? imageData : ""
              }
            })
          }
        }

        setIsTimedIn(true)

        setMessage([data.type || "error", data.message || "", data.timeLeft || 0])
      }).catch(err =>
      {
        console.error("Error accessing camera:", err)
        setIsTimedIn(false)
      }).finally(() => setBtnLoading(false))
    }
  }

  return (
    <Card title={"Attendance | User: " + user?.name}>
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
            {/* <CashiersDataTableList /> sampol ( logs sa individual cashier saiyang mga time-in ug out) */}
            <ShiftHistoryTable />
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