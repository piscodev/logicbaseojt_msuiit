'use client'

import React from "react";
import Card from "antd/es/card/Card";
import StatsCard from "../components/StatsCard";
import { Tabs, TabsProps } from "antd";
import TestTable from "../components/testTable";
import DataTable from "../components/DataTableTest";

export default function App()
{
  const tabItems: TabsProps['items'] = [
    { key: 'daily', label: 'Daily', children:<TestTable />},
    { key: 'per_cashier', label: 'Per Cashier', children:<DataTable />},
  ];
  return (
    <>
      <StatsCard />
      <Card title="Transactions Log">
        <Tabs defaultActiveKey="daily" items={tabItems}/>
      </Card>
    </>
  )
}