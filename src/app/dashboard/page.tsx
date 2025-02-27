"use client";

import React, {useState} from "react";
import { Breadcrumb, Layout, Tabs, ConfigProvider,// Col, Row,
   Card } from "antd";
// import TransactionForm from "./components/TransactionForm";
// import TransactionTable from "./components/TransactionTable";
import TestTable from "@/app/components/testTable"
import DataTable from "../components/DataTableTest";
import Nav from "../components/NavigationBar";
const { Content, Footer } = Layout;
const { TabPane } = Tabs;
const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));

export default function Home() {
  const [tableMode, setTableMode] = useState<string | number>('Map');
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
            {/* <Segmented options={['Daily', 'Per Cashier']} value={tableMode} onChange={setTableMode} />
            {tableMode==='Daily'?(<TestTable />):(<DataTable/>)} */}
            <Tabs defaultActiveKey="daily">
              <TabPane tab="Daily" key="daily">
                <TestTable />
              </TabPane>
              <TabPane tab="Per Cashier" key="cashier">
                <DataTable />
              </TabPane>
            </Tabs>;
          </Card>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}