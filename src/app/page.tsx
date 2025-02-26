"use client";

import React from "react";
import { Layout, Menu, Button, Typography, ConfigProvider, Card, Breadcrumb } from "antd";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import DataTableTest from "./components/DataTableTest";

const { Header, Content, Footer } = Layout;
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
      <ConfigProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center", background: "#001529" }}>
            <div style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold", marginRight: 20 }}>
              Something App
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              items={[
                { key: "1", label: "Home" },
                { key: "2", label: "About" },
                { key: "3", label: "Contact" }
              ]}
              style={{ flex: 1 }}
            />
          </Header>
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
          <Content style={{ padding: "0 48px", margin: "16px 0" }}>
            <Breadcrumb
              style={{ margin: "16px 0" }}
              items={[
                { title: "Root" },
                { title: "Page" },
                { title: "Current Page" },
              ]}
            />
            {/* <Row>
              <Col span={30} push={6} className="p-3"> */}
                <Card title="Transactions Log">
                  {/* <TransactionTable /> */}
                  {/* <TestTable /> */}
                  <DataTableTest />
                </Card>
              {/* </Col> */}
              {/* <Col span={6} pull={18} className="p-3">
                <Card title="Transaction Form">
                  <TransactionForm />
                </Card>
              </Col> */}
            {/* </Row> */}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </ConfigProvider>
    </>
  );
}
