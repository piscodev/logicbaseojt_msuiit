"use client";

import React from "react";
import { Breadcrumb, Layout, Menu, ConfigProvider,// Col, Row,
   Card } from "antd";
// import TransactionForm from "./components/TransactionForm";
// import TransactionTable from "./components/TransactionTable";
import TestTable from "@/app/components/testTable"
import Nav from "../components/NavigationBar";
const { Header, Content, Footer } = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));

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
          <Card title="Transactions Log">
            <TestTable />
          </Card>
            
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}