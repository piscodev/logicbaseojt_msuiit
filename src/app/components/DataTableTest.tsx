"use client";

import React, { useState } from "react";
import { Space, Table } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomDatePicker from "./CustomDatePicker";

interface Transaction {
  particular: string;
  particular_id:number;
  am: number;
  mid: number;
  pm: number;
  total_trade_am: number;
  total_trade_mid: number;
  total_trade_pm: number;
  total_non_trade_am: number;
  total_non_trade_mid: number;
  total_non_trade_pm: number;
  grand_total_am: number;
  grand_total_mid: number;
  grand_total_pm: number;
  grossTotal?: number;
  netTotal?: number;
  fee_percent:number;
}

interface CashierShift {
  cashier_id: number;
  name: string;
  shift: string;
  transactions: Transaction[];
}

interface ApiCashier {
  cashier_id: number;
  name: string;
  shifts: {
    shift: string;
    transactions: Transaction[];
  }[];
}

interface ResponseData {
  cashiers?: ApiCashier[];
}
const transformAPIResponse = (apiData: ResponseData): CashierShift[] => {
  return apiData.cashiers?.flatMap(cashier =>
    cashier.shifts.map(shift => {
      const transactions: Transaction[] = [...shift.transactions];

      // Compute totals
      const tradeTotal = {
        particular: "TRADE TOTAL",
        particular_id: -1,
        am: transactions.reduce((sum, t) => (t.particular_id <= 12 ? Number(sum) + Number(t.total_trade_am) : sum), 0),
        mid: transactions.reduce((sum, t) => (t.particular_id <= 12 ? Number(sum) + Number(t.total_trade_mid) : sum), 0),
        pm: transactions.reduce((sum, t) => (t.particular_id <= 12 ? Number(sum) + Number(t.total_trade_pm) : sum), 0),
        total_trade_am: 0,
        total_trade_mid: 0,
        total_trade_pm: 0,
        total_non_trade_am: 0,
        total_non_trade_mid: 0,
        total_non_trade_pm: 0,
        grand_total_am: 0,
        grand_total_mid: 0,
        grand_total_pm: 0,
        fee_percent: (() => {
          const totalAmount = transactions.reduce((sum, t) => (t.particular_id <= 12 ? sum + Number(t.am) + Number(t.mid) + Number(t.pm) : sum), 0);
          const weightedFee = transactions.reduce(
            (sum, t) => (t.particular_id <= 12? Number(sum) + (Number(t.fee_percent)) : sum),
            0
          );
          return totalAmount > 0 ? weightedFee / totalAmount : 0;
        })()
      };

      const nonTradeTotal = {
        particular: "NON-TRADE TOTAL",
        particular_id: -2,
        am: transactions.reduce((sum, t) => (t.particular_id >= 13 ? sum + Number(t.total_non_trade_am) : sum), 0),
        mid: transactions.reduce((sum, t) => (t.particular_id >= 13 ? sum + Number(t.total_non_trade_mid) : sum), 0),
        pm: transactions.reduce((sum, t) => (t.particular_id >= 13 ? sum + Number(t.total_non_trade_pm) : sum), 0),
        total_trade_am: 0,
        total_trade_mid: 0,
        total_trade_pm: 0,
        total_non_trade_am: 0,
        total_non_trade_mid: 0,
        total_non_trade_pm: 0,
        grand_total_am: 0,
        grand_total_mid: 0,
        grand_total_pm: 0,
        fee_percent: 0
      };

      const grandTotal = {
        particular: "GRAND TOTAL",
        particular_id: -3,
        am: transactions.reduce((sum, t) => Number(sum) + Number(t.grand_total_am), 0),
        mid: transactions.reduce((sum, t) => Number(sum) + Number(t.grand_total_mid), 0),
        pm: transactions.reduce((sum, t) => Number(sum) + Number(t.grand_total_pm), 0),
        total_trade_am: 0,
        total_trade_mid: 0,
        total_trade_pm: 0,
        total_non_trade_am: 0,
        total_non_trade_mid: 0,
        total_non_trade_pm: 0,
        grand_total_am: 0,
        grand_total_mid: 0,
        grand_total_pm: 0,
        fee_percent: 0
      };

      // Insert "TRADE TOTAL" after "Grab Food" (id: 12)
      const grabFoodIndex = transactions.findIndex(t => t.particular_id === 12);
      if (grabFoodIndex !== -1) {
        transactions.splice(grabFoodIndex + 1, 0, tradeTotal);
      }

      // Insert "NON-TRADE TOTAL" after "MM-DM" (id: 18)
      const mmDmIndex = transactions.findIndex(t => t.particular_id === 18);
      if (mmDmIndex !== -1) {
        transactions.splice(mmDmIndex + 1, 0, nonTradeTotal);
      }

      // Insert "GRAND TOTAL" after "NON-TRADE TOTAL"
      const nonTradeTotalIndex = transactions.findIndex(t => t.particular_id === -2);
      if (nonTradeTotalIndex !== -1) {
        transactions.splice(nonTradeTotalIndex + 1, 0, grandTotal);
      }
      const resultData = {
        cashier_id: cashier.cashier_id,
        name: cashier.name,
        shift: shift.shift,
        transactions
      }
      console.log("Result Data Transformed: ", resultData);
      return resultData;
    })
  ) || [];
};

// const transformAPIResponse = (apiData: ResponseData): CashierShift[] => {
//   return apiData.cashiers?.flatMap(cashier => 
//     cashier.shifts.map(shift => {
//       // Calculate trade_total and non_trade_total for the shift
//       const tradeTotalAM = shift.transactions
//         .filter(t => t.particular_id && t.particular_id < 12)
//         .reduce((sum, t) => sum + t.total_trade_am, 0);
//       const tradeTotalMID = shift.transactions
//         .filter(t => t.particular_id && t.particular_id < 12)
//         .reduce((sum, t) => sum + t.total_trade_mid, 0);
//       const tradeTotalPM = shift.transactions
//         .filter(t => t.particular_id && t.particular_id < 12)
//         .reduce((sum, t) => sum + t.total_trade_m, 0);

//       const nonTradeTotalAM = shift.transactions
//         .filter(t => t.particular_id && t.particular_id >= 12)
//         .reduce((sum, t) => sum + t.total_trade_am, 0);
//       const nonTradeTotalMID = shift.transactions
//         .filter(t => t.particular_id && t.particular_id >= 12)
//         .reduce((sum, t) => sum + t.total_trade_am, 0);
//       const nonTradeTotalPM = shift.transactions
//         .filter(t => t.particular_id && t.particular_id >= 12)
//         .reduce((sum, t) => sum + t.total_trade_am, 0);

//       // Add trade_total and non_trade_total as rows
//       const transactions: Transaction[] = [
//         ...shift.transactions,
//         {
//           particular: 'TRADE TOTAL',
//           am: shift.shift === 'AM' ? tradeTotalAM : 0,
//           mid: shift.shift === 'MID' ? tradeTotalMID : 0,
//           pm: shift.shift === 'PM' ? tradeTotalPM : 0,
//         },
//         {
//           particular: 'NON-TRADE TOTAL',
//           am: shift.shift === 'AM' ? nonTradeTotal : 0,
//           mid: shift.shift === 'MID' ? nonTradeTotal : 0,
//           pm: shift.shift === 'PM' ? nonTradeTotal : 0
          
//         },
//         {
//           particular: 'GRAND TOTAL POS',
//           am: shift.shift === 'AM' ? tradeTotal + nonTradeTotal : 0,
//           mid: shift.shift === 'MID' ? tradeTotal + nonTradeTotal : 0,
//           pm: shift.shift === 'PM' ? tradeTotal + nonTradeTotal : 0,
          
//         }
//       ];

//       return {
//         cashier_id: cashier.cashier_id,
//         name: cashier.name,
//         shift: shift.shift.toUpperCase(),
//         transactions
//       };



//       // cashier_id: cashier.cashier_id,
//       // name: cashier.name,
//       // shift: shift.shift.toUpperCase(),
//       // transactions: shift.transactions
//     })) || [];
// };

const DataTable = () => {
  const [cashiers, setCashiers] = useState<CashierShift[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (dateInput = dayjs()) => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions/getAllCashierTransactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateInput })
      });
      
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      console.log('Data: ', data);
      setCashiers(transformAPIResponse(data));
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Dayjs) => {
    if (date) {
      setSelectedDate(date);
      fetchData(date);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const columnsT1 = [
    { 
      title: "Cashier Name", 
      dataIndex: "name", 
      key: "name",
      render: (text: string) => (
        <div style={{ fontWeight: 600 }}>{text}</div>
      )
    },
    { 
      title: "Shift", 
      dataIndex: "shift", 
      key: "shift",
      render: (text: string) => text.toUpperCase()
    }
  ];

  const columnsT2 = [
    { title: "PARTICULARS", dataIndex: "particular", key: "particular" },
    { title: "AM", dataIndex: "am", key: "am" },
    { title: "MID", dataIndex: "mid", key: "mid" },
    { title: "PM", dataIndex: "pm", key: "pm" },
    { 
      title: "GROSS TOTAL", 
      dataIndex: "grossTotal", 
      key: "grossTotal",
      render: (value: number) => Number(value).toFixed(2)
    },
    { 
      title: "NET TOTAL", 
      dataIndex: "netTotal", 
      key: "netTotal",
      render: (value: number) => Number(value).toFixed(2)
    },
  ];

  // Get selected cashier shifts
  const selectedRecords = cashiers.filter(c => 
    selectedRowKeys.includes(`${c.cashier_id}-${c.shift.toLowerCase()}`)
  );
  // Aggregate transactions for selected cashiers
  const transactionMap = new Map<string, {
    particular: string;
    am: number;
    mid: number;
    pm: number;
    grossTotal: number;
    netTotal: number;
    fee_percent: number;
  }>();

  selectedRecords.forEach(record => {
    record.transactions.forEach(t => {
      const key = t.particular;
      const existing = transactionMap.get(key) || {
        particular: key,
        am: 0,
        mid: 0,
        pm: 0,
        grossTotal: 0,
        netTotal: 0,
        fee_percent: t.fee_percent || 0
      }

      // Add amounts based on shift
      switch (record.shift.toLowerCase()) {
        case 'am':
          existing.am += Number(t.am) || 0;
          break;
        case 'mid':
          existing.mid += Number(t.mid) || 0;
          break;
        case 'pm':
          existing.pm += Number(t.pm) || 0;
          break;
      }
      // Calculate totals
      existing.grossTotal = existing.am + existing.mid + existing.pm
      existing.netTotal = existing.grossTotal * (1 - (existing.fee_percent / 100))

      transactionMap.set(key, existing)
    })
  })
  const table2Data = Array.from(transactionMap.values()).map(t => ({
    key: t.particular,
    particular: t.particular,
    am: t.am,
    mid: t.mid,
    pm: t.pm,
    grossTotal: t.grossTotal,
    netTotal: t.netTotal
  }))

  return (
    <div>
      <Table
        title={() => (
          <Space>
            <CustomDatePicker 
              currentDate={selectedDate} 
              onChangeDate={handleDateChange}
            />
          </Space>
        )}
        columns={columnsT1}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        dataSource={cashiers}
        rowKey={record => `${record.cashier_id}-${record.shift.toLowerCase()}`}
        pagination={false}
        loading={loading}
      />
      
      <Table
        columns={columnsT2}
        dataSource={table2Data}
        pagination={false}
        style={{ marginTop: 24 }}
        locale={{
          emptyText: selectedRowKeys.length 
            ? 'No transactions for selected shift' 
            : 'Select a cashier and shift to view transactions'
        }}
      />
    </div>
  )
};

export default DataTable;