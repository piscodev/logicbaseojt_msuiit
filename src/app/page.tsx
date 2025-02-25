"use client";

import React from "react";
import { Breadcrumb, Layout, Menu, ConfigProvider,// Col, Row,
   Card } from "antd";
// import TransactionForm from "./components/TransactionForm";
// import TransactionTable from "./components/TransactionTable";
import TestTable from "@/app/components/testTable"
const { Header, Content, Footer } = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));

export default function Home() {
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();

  return (
    <ConfigProvider>
      <Layout>
        <Header>
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
          {/* <Row>
            <Col span={30} push={6} className="p-3"> */}
              <Card title="Transactions Log">
                <TestTable />
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
  );
}
