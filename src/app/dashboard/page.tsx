"use client";

import React from "react";
import { Breadcrumb, Layout, Menu, ConfigProvider, Col, Row, Card, Button, Tooltip } from "antd";
import { FaPowerOff } from "react-icons/fa";
import { useRouter } from "next/navigation";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";

const { Header, Content, Footer } = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));

export default function Home() {
  const router = useRouter();

  // Logout function
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "GET" });
      if (res.ok) {
        router.push("/login"); // Redirect to the login page (assumed at "/")
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ConfigProvider>
      <Layout>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
          {/* Enhanced Logout Power Button */}
          <Tooltip title="Logout">
            <Button
              type="primary"
              shape="circle"
              icon={<FaPowerOff />}
              onClick={handleLogout}
              style={{
                marginLeft: 16,
                backgroundColor: "#ff4d4f", // red for logout
                borderColor: "#ff4d4f",
              }}
            />
          </Tooltip>
        </Header>
        <Content style={{ padding: "0 48px", margin: "16px 0" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[
              { title: "Root" },
              { title: "Page" },
              { title: "Current Page" },
            ]}
          />
          <Row>
            <Col span={18} push={6} className="p-3">
              <Card title="Transactions Log">
                col-18 col-push-6
                <TransactionTable />
              </Card>
            </Col>
            <Col span={6} pull={18} className="p-3">
              <Card title="Transaction Form">
                col-6 col-pull-18
                <TransactionForm />
              </Card>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
