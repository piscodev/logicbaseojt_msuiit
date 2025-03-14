'use client'

import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Alert, Space } from "antd";
import CashiersDataTableList from "./CashiersDataTableList";
import { useUserStore } from "@/stores/userStore";
import Meta from "antd/es/card/Meta";
// import CashiersTable from "../CashiersTable";

// computation: 8 * 60 * 60 * 1000
// para mas dali kay difference lang ang computon ayha sya maka time-out dadto sa api
// return lng dayn ug message na di pa kalogout chuchu
// const workHours = 28_800_000 // 8 hours in milliseconds // maybe kato 4hrs sguro


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dateConv(date: number) : string
{
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "numeric", hour12: true })  
}


// TODO (paklay): revise pa nako ang login kay murag lisod e scale pd. bale simpleon lang,
                  // input ang html form data: user | email, password
                  // tapos retrieve sa api ang result sa query pag login sa user, then e set sa login component then e store sa userStore()

const CameraCapture = () =>
{
  const user = useUserStore((state) => state.user)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)


  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const photoRef = useRef<HTMLImageElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streamSrc, setStreamSrc] = useState<MediaStream | null>(null)

  const [imageSrc, setImageSrc] = useState<string>('')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cashierData, setCashierData] = useState({})

  const [timeInStamp, setTimeInStamp] = useState<number>(0)
  const [timeOutStamp, setTimeOutStamp] = useState<number>(0)

  const [isTimedIn, setIsTimedIn] = useState<boolean>(false)
  // const [isTimedOut, setIsTimedOut] = useState<boolean>(false)
  // const [hasTimedOut, setHasTimedOut] = useState<boolean>(false) // base state kung naka time-out na sya para di na magbalik ang time-in button --- ugma npd

  const retrieveCashierAttendance = async () =>
  {
    const response = await fetch('api/testonggg')
    if (!response.ok)
      return console.error("Error: ", response.statusText)

    const data = await response.json()
    if (!data)
      return console.error("Error: No data received")

    // kung null kay wla pa naka time-in today, so need pa e trigger ang button Time-In
    setCashierData(data)

    setTimeInStamp(data.timeInStamp)
    setTimeOutStamp(data.timeOutStamp)
    setIsTimedIn(data.isTimedIn)
    // setIsTimedOut(data.isTimedOut)
  }

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
        videoRef.current.play()
        setStreamSrc(stream)
      }
    }).catch(err => {
        console.error("Error accessing camera:", err)
    })
  }

  useEffect(() =>
  {
      const videoElement = videoRef.current
      startCamera()

      if (videoElement?.srcObject)
      {
          const stream = videoElement.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
      }

      retrieveCashierAttendance()
  }, [])

  const handleTimeIn = async () =>
  {
    setBtnLoading(true)

    const timeStamp = new Date().getTime() // to millis

    const response = await fetch('/api/attendance/get/logon',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user?.name, timeStamp, imageSrc, hasTimedIn: isTimedIn })
    })

    if (!response.ok)
      return console.error("Error: ", response.statusText)

    const data = await response.json()
    if (!data)
      return console.error("Error: No data received")

    setCashierData(data)
    takePhoto()

    // setTimeInStamp(timeStamp) // to millis // data.timeStamp
    // setIsTimedIn(true) // data.timedIn
    // setIsTimedOut(false)
  }

  const handleTimeOut = async () =>
  {
    setBtnLoading(true)

    const timeStamp = new Date().getTime() // to millis

    const response = await fetch('/api/attendance/get/logon',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user?.name, timeStamp, imageSrc, hasTimedIn: isTimedIn })
    })

    if (!response.ok)
      return console.error("Error: ", response.statusText)

    const data = await response.json()
    if (!data)
      return console.error("Error: No data received")

    // setTimeOutStamp(timeStamp) // to millis // data.timeStamp
    // setIsTimedIn(false) // data.timedIn
    // setHasTimedOut(true)
    // setIsTimedOut(true)
    // setIsTimedOut(false)



    // retrieve nlng new kay maka himo napd ug useEffect if mag setData sa cashier
    // murag kato same nahitabo sa pag add sa tcmc nga datatable same ato nga e retrieve lang
    // kibale, dadto na sa api mag update sa data sa cashier before sya mag retrieve dria
    // retrieveCashierAttendance() // retrieve ang new user datas sa cashier

    takePhoto() // photo for time-out na dyn
  }

  const takePhoto = () =>
  {
    if (!videoRef.current || !canvasRef.current || !photoRef.current)
        return

    const context = canvasRef.current.getContext("2d")
    if (!context)
        return

    const dateMillisNow = new Date().getTime()

    const width = 320
    const height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width)

    canvasRef.current.width = width
    canvasRef.current.height = height
    context.drawImage(videoRef.current, 0, 0, width, height)

    const imageData = canvasRef.current.toDataURL("image/png")
    photoRef.current.src = imageData
    console.log("Image data: ", imageData)
    if (!imageSrc)
      setImageSrc(imageData)

    if (isTimedIn)
    {
        setTimeOutStamp(dateMillisNow)
        setIsTimedIn(false)
        // setIsTimedOut(true)
    } else {
        setTimeInStamp(dateMillisNow)
        setIsTimedIn(true)
        // setIsTimedOut(false)
    }

    if (timeInStamp !== 0 && timeOutStamp !== 0)
    {
        // const diff = timeOutStamp - timeInStamp
        // dria sguro e compute ang iya accumulation rate karon na day
        // to do pa
    }

    setBtnLoading(false)
  }

  return (
    <Card title={"Attendance | User: " + user?.name}>
      <Space direction="vertical" style={{marginBottom: '24px'}}>
        <Meta title={"Time in: "+ (timeInStamp === 0 ? "" : dateConv(timeInStamp))}></Meta>
        <Meta title={"Time out: " + (timeOutStamp === 0 ? "" : dateConv(timeOutStamp))}></Meta>
      </Space>

      <Row>
        <Col className="p-2" flex="1 1 80px">
            <CashiersDataTableList /> sampol ( logs sa individual cashier saiyang mga time-in ug out)
            {/* <CashiersTable/> */}
        </Col>
        <Col className="p-2" flex="0 1 500px">
        <Card title={"Status: " + (!isTimedIn ? "To Time-In" : "To Time-Out")}>
          {/* <h1>Camera Capture</h1> */}
          <p>Take a selfie</p>

          <div className="camera" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <video ref={videoRef} width="auto" height="240">
              Video stream not available.
            </video>
            <Button type="primary" onClick={!isTimedIn ? handleTimeIn : handleTimeOut} loading={btnLoading} disabled={btnLoading}>
              {isTimedIn ? "Time-Out" : "Time-In"}
            </Button>
            {/* { timeInStamp === 0 ? <Alert message={"Successfully timed-in at dateConv(millis) "} type="success" showIcon closable /> : "" } */}
            <Alert message={"Successfully timed-in at dateConv(millis) "} type="success" showIcon closable />
            <Alert message={"Server Error: Unable to chuchu "} type="error" showIcon closable />
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