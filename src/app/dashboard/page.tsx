'use client'

import Card from "antd/es/card/Card";
import StatsCard from "../components/StatsCard";
import { Tabs, TabsProps } from "antd";
import TestTable from "../components/testTable";
import DataTable from "../components/DataTableTest";

const tabItems: TabsProps['items'] = [
  { key: 'daily', label: 'Daily', children:<TestTable/>},
  { key: 'per_cashier', label: 'Per Cashier', children:<DataTable/>},
]

export default function App()
{
  return (
    <>
      <StatsCard />
      <Card title="Transactions Log">
        <Tabs defaultActiveKey="daily" items={tabItems}/>
      </Card>
    </>
  )
}