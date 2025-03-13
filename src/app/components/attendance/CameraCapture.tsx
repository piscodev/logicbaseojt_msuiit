'use client'

import { useEffect, useRef, useState } from "react";
import { Card, Button, Space } from "antd";
import { useUserStore } from "@/stores/userStore";
import { DateTime } from "luxon";
const { Meta } = Card;
// import CashiersDataTableList from "./CashiersDataTableList";
// import CashiersTable from "../CashiersTable";

const CameraCapture = () =>
{
    const user = useUserStore((state) => state.user)
    const [ isTimedIn, setIsTimedIn ] = useState<boolean>(true);
    const [ isTimedOut, setIsTimedOut ] = useState<boolean>(true);
    const [ isCaptured, setIsCaptured ] = useState<boolean>(false);
    const [ isTimeOutAllowed, setIsTimeoutAllowed ] = useState<boolean>(false);
    const [ imageSrc, setImageSrc ] = useState<string>('')
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [streamSrc, setStreamSrc] = useState<MediaStream|null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const photoRef = useRef<HTMLImageElement | null>(null)
    const [ cardTitle, setCardTitle ] = useState<string>('')
    const [ timeInTimestamp, setTimeInTimeStamp ] = useState<string>('');
    const [ timeOutTimestamp, setTimeOutTimeStamp ] = useState<string>('');
    
    // Function to compare if the timeInTimestamp is more than 1 minute ago from now
    const compareTime = (current: string, marked: string) => {
      if(marked){
        const currentTime = DateTime.fromFormat(current, "yyyy-LL-dd HH:mm:ss");
        const markedTime = DateTime.fromFormat(marked, "yyyy-LL-dd HH:mm:ss");
        console.log("Current:", currentTime.toFormat("yyyy-LL-dd HH:mm:ss"))
        console.log("Marked:", markedTime.toFormat("yyyy-LL-dd HH:mm:ss"))
        const diff = currentTime.diff(markedTime, "minutes").minutes;
        console.log("diff: ", diff)
        return diff >= 1;
      }
      return false; // Check if the difference is greater than or equal to 1 minute
    };
    const fetchTodayAttendance = async() => {
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
      if(data.message === "Record for today doesn't exists"){
        startCamera()
        setIsTimedIn(false)
        setIsTimedOut(false)
      } else {
        setTimeInTimeStamp(DateTime.fromISO(data.data.time_in).toFormat("yyyy-LL-dd HH:mm:ss"))
        setTimeOutTimeStamp(DateTime.fromISO(data.data.time_out).toFormat("yyyy-LL-dd HH:mm:ss"))
      }
    };
    const setAttendance = async(time:string) => {
      const name = user?.name;
      const response = await fetch('/api/attendance/set', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({time, name, imageSrc})
      })
      const data = await response.json()
      console.log("data: ", data);
    }
    useEffect(() => {
      let mark:string;
      if (timeInTimestamp) {
        mark = DateTime.fromFormat(timeInTimestamp, "yyyy-LL-dd HH:mm:ss")
          .toFormat("yyyy-LL-dd HH:mm:ss");
      }
      const interval = setInterval(() => {

        const currentTime = DateTime.now().setZone('Asia/Manila').toFormat("yyyy-LL-dd HH:mm:ss");
        if (isTimedIn) {
          setIsTimeoutAllowed(compareTime(currentTime, mark));
        } else {
          console.log("Not Timed in yet");
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [isTimedIn]);
    
    const startCamera = async () =>{
      try
      {
        await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 640, facingMode: "user" },
            audio: false,
        }).then(stream => {
          if (videoRef.current){
            videoRef.current.srcObject = stream
            videoRef.current.play()
            setStreamSrc(stream);
          }
        })
      } catch (err) {
          console.error("Error accessing camera:", err)
      }
    }
    useEffect(() => {
      console.log("Is time out allowed: ", isTimeOutAllowed);
      if(isTimeOutAllowed){
        startCamera()
        setIsCaptured(false)
      }
    }, [isTimeOutAllowed]);
    useEffect(() =>
    {
      

        
        if(user){
          setCardTitle("Cashiers Attendance | " + user.name)
          fetchTodayAttendance()
        }
    }, [])

    const getCurrentTime = () => {
      return DateTime.now().setZone('Asia/Manila').toFormat('yyyy-LL-dd HH:mm:ss')
    };

    const takePhoto = () =>
    {
      console.log("Take photo")
        if (!videoRef.current || !canvasRef.current || !photoRef.current){
          console.log("No refs found");
          // return;
        }
        console.log("Refs found");

        const context = canvasRef.current!.getContext("2d");
        if (!context){
          console.log("No context found");
          return;
        }
        if(!isTimedIn) {
          setTimeInTimeStamp(getCurrentTime())
          setIsTimedIn((prev) => !prev); 
          setAttendance(getCurrentTime())
        }
        else {
          setTimeOutTimeStamp(getCurrentTime())
          setIsTimedOut((prev) => !prev);
          setAttendance(getCurrentTime())
        }
        
        setIsCaptured((prev) => !prev);
        const width = 640;
        const height = videoRef.current!.videoHeight / (videoRef.current!.videoWidth / width);

        canvasRef.current!.width = width;
        canvasRef.current!.height = height;
        context.drawImage(videoRef.current!, 0, 0, width, height);

        const imageData = canvasRef.current!.toDataURL("image/png");
        setImageSrc(imageData)
    };
  useEffect(() => {
    console.log("isCaptured state: ", isCaptured);
    if(isCaptured&&streamSrc){
      streamSrc.getTracks().forEach(track => track.stop());
    }
  }, [isCaptured]);

  return (
    <Card title={cardTitle}>
      
          <Space direction="vertical" style={{marginBottom: '24px'}}>
          <Meta
            title={"Time in: "+timeInTimestamp}></Meta>
            <Meta
            title={"Time out: "+timeOutTimestamp}></Meta>
          </Space>
          <Card title="Attendance">

            <div className="camera">
              {!isCaptured||(isTimeOutAllowed&&!isTimedOut)?(
                <><video ref={videoRef} width="640px" height="640px">
                Video stream not available.
                </video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              </>
              ):(
                <div className="output">
                  <img src={imageSrc} alt="Captured snapshot will appear here" />
                </div>
              )}
                <Button type="primary" onClick={takePhoto} disabled={(isTimedIn&&!isTimeOutAllowed)||isTimedOut} style={{ marginTop: "10px" }}>
                {isTimedIn ?isTimedOut?('Attendance Closed'):("Time out"):("Time in")}
                </Button>
            </div>
            
          </Card>
    </Card>
  );
};

export default CameraCapture;
