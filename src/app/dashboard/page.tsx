"use client";

import React from "react";
import { Breadcrumb, Layout, Tabs, ConfigProvider, Card } from "antd";
import type  { TabsProps } from 'antd'; 
// import TransactionForm from "./components/TransactionForm";
// import TransactionTable from "./components/TransactionTable";
import TestTable from "@/app/components/testTable"
import DataTable from "../components/DataTableTest";
import Nav from "../components/NavigationBar";
import StatsCard from "../components/StatsCard";
const { Content, Footer } = Layout;
const tabItems: TabsProps['items'] = [
  { key: 'daily', label: 'Daily', children:<TestTable/>},
  { key: 'per_cashier', label: 'Per Cashier', children:<DataTable/>},
]

export default function Home() {
  return (
    <ConfigProvider>
      <Layout>
        <Nav/>
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
            <Tabs defaultActiveKey="daily" items={tabItems}/>;
          </Card>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}