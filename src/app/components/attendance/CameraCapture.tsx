'use client'

import { useEffect, useRef } from "react";
import { Card, Col, Row, Button } from "antd";
import CashiersDataTableList from "./CashiersDataTableList";
// import CashiersTable from "../CashiersTable";

const CameraCapture = () =>
{
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const photoRef = useRef<HTMLImageElement | null>(null)

    useEffect(() =>
    {
        const videoElement = videoRef.current
        const startCamera = async () =>
        {
            try
            {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240, facingMode: "user" },
                    audio: false,
                })

                if (videoRef.current)
                {
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                }
            } catch (err) {
                console.error("Error accessing camera:", err)
            }
        }

        startCamera()

        return () =>
        {
            if (videoElement?.srcObject)
            {
                const stream = videoElement.srcObject as MediaStream
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    const takePhoto = () =>
    {
        if (!videoRef.current || !canvasRef.current || !photoRef.current)
            return;

        const context = canvasRef.current.getContext("2d");
        if (!context)
            return;

        const width = 320;
        const height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width);

        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.drawImage(videoRef.current, 0, 0, width, height);

        const imageData = canvasRef.current.toDataURL("image/png");
        photoRef.current.src = imageData;
    };

  return (
    <Card title="Cashiers Attendance | CashierName">
      <Row>
        <Col className="p-2" flex="1 1 180px">
            <CashiersDataTableList /> sampol
            {/* <CashiersTable/> */}

        </Col>
        <Col className="p-2" flex="0 1 300px">
          <Card title="Attendance | Check-In">
            <h1>Camera Capture</h1>
            <p>Take a snapshot using your built-in webcam.</p>

            <div className="camera">
              <video ref={videoRef} width="320" height="240">
                Video stream not available.
              </video>
              <Button type="primary" onClick={takePhoto} style={{ marginTop: "10px" }}>
                Capture
              </Button>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            <div className="output">
              <img ref={photoRef} alt="Captured snapshot will appear here" />
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default CameraCapture;
