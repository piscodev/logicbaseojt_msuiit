"use client";

import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomDatePicker from "./CustomDatePicker";

interface Transaction {
  particular: string;
  am: number;
  mid: number;
  pm: number;
  grossTotal?: number;
  netTotal?: number;
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
    cashier.shifts.map(shift => ({
      cashier_id: cashier.cashier_id,
      name: cashier.name,
      shift: shift.shift.toUpperCase(),
      transactions: shift.transactions
    }))) || [];
};

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
      render: (value: number) => value?.toFixed(2)
    },
    { 
      title: "NET TOTAL", 
      dataIndex: "netTotal", 
      key: "netTotal",
      render: (value: number) => value?.toFixed(2)
    },
  ];

  const selectedRecord = cashiers.find(c => 
    selectedRowKeys.includes(`${c.cashier_id}-${c.shift.toLowerCase()}`)
  );

  const table2Data = selectedRecord?.transactions.map(t => ({
    key: t.particular,
    particular: t.particular,
    am: t.am || 0,
    mid: t.mid || 0,
    pm: t.pm || 0,
    grossTotal: (t.am + t.mid + t.pm),
    netTotal: (t.am + t.mid + t.pm) * 0.97 // Example 3% fee
  })) || [];

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
          type: 'radio',
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
  );
};

export default DataTable;