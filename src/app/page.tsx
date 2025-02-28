"use client";

import React from "react";
import { Layout, Button, Typography } from "antd";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function LandingPage()
{
  const router = useRouter();

  const handleLogin = () => {
    // Redirect to your login page. Adjust the path as needed.
    router.push("/login");
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "50px", textAlign: "center", background: "#f0f2f5" }}>
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Title style={{ color: "#001529" }}>Welcome</Title>
              <Paragraph style={{ fontSize: "1.2rem", color: "#595959" }}>
                Experience a seamless and intuitive interface with our modern application.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<FaArrowRight />}
                onClick={handleLogin}
                style={{ marginTop: 20, borderRadius: 8 }}
              >
                Login
              </Button>
          </motion.div>
        </Content>
      </Layout>
    </>
  );
}
