"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, Tabs, ConfigProvider, Card, Spin } from "antd";
import TestTable from "@/app/components/testTable";
import DataTable from "../components/DataTableTest";
import Nav from "../components/NavigationBar";
import LogoutButton from "../components/LogoutButton"; // Import LogoutButton

import StatsCard from "../components/StatsCard";
const { Content, Footer } = Layout;

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </Layout>
    );
  }

  return (
    <ConfigProvider>
      <Layout>
        <Nav />
        <Content style={{ padding: "0 48px", margin: "16px 0" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[
              { title: "Root" },
              { title: "Page" },
              { title: "Current Page" },
            ]}
          />
          <StatsCard />
          <Card title="Transactions Log">
            <Tabs defaultActiveKey="daily">
              <TabPane tab="Daily" key="daily">
                <TestTable />
              </TabPane>
              <TabPane tab="Per Cashier" key="cashier">
                <DataTable />
              </TabPane>
            </Tabs>
          </Card>
        </Content>

        {/* Logout Button */}
        <LogoutButton />

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
