'use client'

import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col, Typography, Skeleton } from "antd";
import Nav from "../components/NavigationBar";
import FooterComp from "../components/Footer";
// import usePushNotification from "@/hooks/usePushNotification";
// import { ToastContainer } from "react-toastify";
const { Content } = Layout;
const { Title, Text } = Typography;
import quotes from "../../data/qoutes.json";

export default function RootLayout({ children }: { children: React.ReactNode })
{
  
const [randomQuote, setRandomQuote] = useState<{ quote: string; author: string } | null>(null);

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  };

  // Generate a new quote on page load
  useEffect(() => {
    getRandomQuote();
  }, []);
  return (
      <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav/>
        <Content style={{ flex: 1, padding: "64px", display: "flex", flexDirection: "column" }}>
        <Row gutter={[32, 32]} style={{  flex: 1, height: "100%" }}>
          {/* Left side for main content */}
          <Col xs={24} md={12} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
            <div style={{ width: "100%", height:"100%", display: "flex", flexDirection: "column" }}>{
            <>
            {children}
            </>}
            </div>
          </Col>

          {/* Right side for random quote */}
          <Col
            xs={24}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f2f5",
              borderRadius: "8px",
            }}
          >
            <Card
              variant='borderless'
              style={{
                width: "80%",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                backgroundColor: "#fff",
                minHeight:"50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: "24px",
              }}
            >
              {randomQuote ? (
                <>
                  <Title level={3} style={{ marginBottom: "16px", fontStyle: "italic", color: "#595959" }}>
                    &quot;{randomQuote.quote}&quot;
                  </Title>
                  <Text strong style={{ color: "#1890ff" }}>
                    - {randomQuote.author}
                  </Text>
                </>
              ) : (
                <Skeleton active={!randomQuote} />
              )}
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Footer Section */}
      <FooterComp />
      </Layout>
  );
}