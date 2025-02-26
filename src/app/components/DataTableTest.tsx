"use client";

import React, { useEffect } from "react";
import { DatePicker, Space, Table, TableProps } from "antd";
import { create } from "zustand";
import dayjs from "dayjs";

const CustomDatePicker = () => (
    <DatePicker
        presets={[
            { label: 'Yesterday', value: dayjs().add(-1, 'd') },
            { label: 'Last Week', value: dayjs().add(-7, 'd') },
            { label: 'Last Month', value: dayjs().add(-1, 'month') },
        ]}
    />
  );

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface Transaction {
  particular: string;
  am: number;
  mid: number;
  pm: number;
  grossTotal?: number;
  netTotal?: number;
}

interface Cashier {
  cashier_id: number;
  name: string;
  shift: string;
  transactions: Transaction[];
}

interface POSStore {
  cashiers: Cashier[];
  setCashiers: (cashiers: Cashier[]) => void;
}

const usePOSStore = create<POSStore>((set) => ({
  cashiers: [],
  setCashiers: (cashiers) => set({ cashiers }),
}));

interface CashierStore {
  selectedCashiers: Cashier[];
  setSelectedCashiers: (cashiers: Cashier[]) => void;
}

const useCashierStore = create<CashierStore>((set) => ({
  selectedCashiers: [],
  setSelectedCashiers: (cashiers) => set({ selectedCashiers: cashiers }),
}));

// Sample API Data
const apiResponse = {
  cashiers: [
    {
      cashier_id: 1,
      name: "Tinapa",
      shift: "am",
      transactions: [
        { particular: "CASH", am: 200, mid: 0, pm: 0 },
        { particular: "CHECK", am: 150, mid: 0, pm: 0 },
      ],
    },{
      cashier_id: 2,
      name: "2",
      shift: "am",
      transactions: [
        { particular: "CASH", am: 200, mid: 0, pm: 0 },
        { particular: "CHECK", am: 150, mid: 0, pm: 0 },
      ],
    },{
      cashier_id: 3,
      name: "3",
      shift: "am",
      transactions: [
        { particular: "CASH", am: 200, mid: 0, pm: 0 },
        { particular: "CHECK", am: 150, mid: 0, pm: 0 },
      ],
    },{
      cashier_id: 4,
      name: "4",
      shift: "am",
      transactions: [
        { particular: "CASH", am: 200, mid: 0, pm: 0 },
        { particular: "CHECK", am: 150, mid: 0, pm: 0 },
      ],
    },{
      cashier_id: 5,
      name: "5",
      shift: "pm",
      transactions: [
        { particular: "CASH", am: 200, mid: 0, pm: 0 },
        { particular: "CHECK", am: 150, mid: 0, pm: 0 },
      ],
    },{
      cashier_id: 6,
      name: "Tin6apa",
      shift: "mid",
      transactions: [
        { particular: "CASH", am: 200, mid: 0, pm: 0 },
        { particular: "CHECK", am: 150, mid: 0, pm: 0 },
      ],
    },
    {
      cashier_id: 7,
      name: "Paklay",
      shift: "mid",
      transactions: [
        { particular: "CASH", am: 0, mid: 100, pm: 0 },
        { particular: "CHECK", am: 0, mid: 50, pm: 0 },
      ],
    },
  ],
};

// Function to transform API response
const transformAPIResponse = (data: typeof apiResponse): Cashier[] => {
  return data.cashiers.map((cashier) => ({
    ...cashier,
    transactions: cashier.transactions.map((t) => ({
      ...t,
      grossTotal: t.am + t.mid + t.pm,
      netTotal: t.am + t.mid + t.pm,
    })),
  }));
};

// Function to generate table data based on selected cashiers
const generateTableData = (selectedCashiers: Cashier[]) => {
  if (selectedCashiers.length === 0) return [];

  const aggregatedData: { [key: string]: Transaction } = {};

  selectedCashiers.forEach((cashier) => {
    cashier.transactions.forEach((tx) => {
      if (!aggregatedData[tx.particular]) {
        aggregatedData[tx.particular] = { ...tx };
      } else {
        aggregatedData[tx.particular].am += tx.am;
        aggregatedData[tx.particular].mid += tx.mid;
        aggregatedData[tx.particular].pm += tx.pm;
        aggregatedData[tx.particular].grossTotal =
          (aggregatedData[tx.particular].am || 0) +
          (aggregatedData[tx.particular].mid || 0) +
          (aggregatedData[tx.particular].pm || 0);
        aggregatedData[tx.particular].netTotal = aggregatedData[tx.particular].grossTotal;
      }
    });
  });

  return [
    {
      key: "cashier-row",
      particular: "CASHIER",
      am: selectedCashiers.find((c) => c.shift === "am")?.name || "",
      mid: selectedCashiers.find((c) => c.shift === "mid")?.name || "",
      pm: selectedCashiers.find((c) => c.shift === "pm")?.name || "",
      grossTotal: "",
      netTotal: "",
    },
    ...Object.values(aggregatedData),
    {
      key: "total-row",
      particular: "TOTAL",
      am: Object.values(aggregatedData).reduce((sum, row) => sum + row.am, 0),
      mid: Object.values(aggregatedData).reduce((sum, row) => sum + row.mid, 0),
      pm: Object.values(aggregatedData).reduce((sum, row) => sum + row.pm, 0),
      grossTotal: Object.values(aggregatedData).reduce((sum, row) => sum + (row.grossTotal || 0), 0),
      netTotal: Object.values(aggregatedData).reduce((sum, row) => sum + (row.netTotal || 0), 0),
    },
  ];
};

const DataTable = () =>
{
  const { cashiers, setCashiers } = usePOSStore()
  const { selectedCashiers, setSelectedCashiers } = useCashierStore()

  useEffect(() =>
  {
    setCashiers(transformAPIResponse(apiResponse));
  }, [setCashiers])

  const rowSelection: TableRowSelection<Cashier> = {
    onChange: (_, selectedRows) => {
      setSelectedCashiers(selectedRows);
    },
  }

  const tableData = generateTableData(selectedCashiers)

  const columnsT1 = [
    { title: "Cashier Name", dataIndex: "name", key: "name" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
  ]

  const columnsT2 = [
    { title: "PARTICULARS", dataIndex: "particular", key: "particular" },
    { title: "AM", dataIndex: "am", key: "am" },
    { title: "MID", dataIndex: "mid", key: "mid" },
    { title: "PM", dataIndex: "pm", key: "pm" },
    { title: "GROSS TOTAL", dataIndex: "grossTotal", key: "grossTotal" },
    { title: "NET TOTAL", dataIndex: "netTotal", key: "netTotal" },
  ]

  return (
    <>
      <Table
        columns={columnsT1}
        rowSelection={{ ...rowSelection }}
        dataSource={cashiers}
        rowKey="cashier_id"
        pagination={false}
      />
      <Table title={() => 
            <Space>
                <CustomDatePicker/>
            </Space>}
            columns={columnsT2} dataSource={tableData} pagination={false} />
    </>
  )
}

export default DataTable;
