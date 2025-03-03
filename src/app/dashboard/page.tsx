'use client'

import React from "react";
import Card from "antd/es/card/Card";
import StatsCard from "../components/StatsCard";
import { Tabs, TabsProps } from "antd";
import TestTable from "../components/testTable";
import DataTable from "../components/DataTableTest";
// import { useStatsStore } from "@/stores/statsStore";
  

export default function App()
{
  // const { net_total_trade, net_total_non_trade, grand_total_pos, fetching } = useStatsStore();
  // const [tradeAmount, setTradeAmount] = useState<number>(0);
  // const [nonTradeAmount, setNonTradeAmount] = useState<number>(0);
  // const [grandTotal, setGrandTotal] = useState<number>(0);
  // const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  // const updateAmounts = (trade: number, nonTrade: number, grand: number, loading: boolean) => {
  //   setTradeAmount(trade);
  //   setNonTradeAmount(nonTrade);
  //   setGrandTotal(grand);
  //   setLoadingStatus(loading)
  // };
  const tabItems: TabsProps['items'] = [
    { key: 'daily', label: 'Daily', children:<TestTable 
      //onUpdateAmounts={updateAmounts} 
      />},
    { key: 'per_cashier', label: 'Per Cashier', children:<DataTable 
      //onUpdateAmounts={updateAmounts} 
      />},
  ];
  return (
    <>
      <StatsCard 
      // tradeAmount={net_total_trade}
      // nonTradeAmount={net_total_non_trade}
      // grandTotal={grand_total_pos}
      // loading={fetching}
      />
      <Card title="Transactions Log">
        <Tabs defaultActiveKey="daily" items={tabItems}/>
      </Card>
    </>
  )
}