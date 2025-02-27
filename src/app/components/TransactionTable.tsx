import React, { useEffect } from "react";
import { Table, Button } from "antd";
import { create } from "zustand";
import type { TableProps } from 'antd';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

// interface DataType {
//   key: React.ReactNode;
//   name: string;
//   age: number;
//   address: string;
//   children?: DataType[];
// }

interface Transaction {
  particular: string;
  am: number;
  mid: number;
  pm: number;
}

interface Cashier {
  cashier_id: number;
  name: string;
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


const apiResponse = {
  "cashiers": [
    {
      "name": "Tinapa",
      "transactions": [
        {
          "id": 10,
          "cashier_id": 1,
          "shift_id": 1,
          "shift": "am",
          "date": "2025-02-24T16:00:00.000Z",
          "transaction_id": 1,
          "particular_id": 3,
          "testong": {
            "amount": 1,
            "cash": 2,
            "check_": 20,
            "bpi_cc": 1,
            "bpi_dc": 1,
            "metro_cc": 1,
            "metro_dc": 1,
            "pay_maya": 1,
            "aub_cc": 1,
            "gcash": 1,
            "foodpanda": 1,
            "streetby": 1,
            "grabfood": 1,
            "mm_head": 0,
            "mm_commisary": 0,
            "mm_": 0,
            "mm_rm": 0,
            "mm_dm": 0,
            "mm_km": 0,
            "food_charge": 0
          }
        }
      ]
    },
    {
      "name": "Choki",
      "transactions": [
        {
          "id": 10,
          "cashier_id": 1,
          "shift_id": 1,
          "shift": "am",
          "date": "2025-02-24T16:00:00.000Z",
          "transaction_id": 1,
          "particular_id": 3,
          "testong": {
            "amount": 1,
            "cash": 2,
            "check_": 20,
            "bpi_cc": 1,
            "bpi_dc": 1,
            "metro_cc": 1,
            "metro_dc": 1,
            "pay_maya": 1,
            "aub_cc": 1,
            "gcash": 1,
            "foodpanda": 1,
            "streetby": 1,
            "grabfood": 1,
            "mm_head": 0,
            "mm_commisary": 0,
            "mm_": 0,
            "mm_rm": 0,
            "mm_dm": 0,
            "mm_km": 0,
            "food_charge": 0
          }
        }
      ]
    }
  ]
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function transformAPIResponse(apiResponse: any) {
  const particularsMap: Record<string, string> = {
    "CASH": "cash",
    "CHECK": "check_",
    "BPI CREDIT CARD": "bpi_cc",
    "BPI DEBIT CARD": "bpi_dc",
    "METRO CREDIT CARD": "metro_cc",
    "METRO DEBIT CARD": "metro_dc",
    "PAY MAYA": "pay_maya",
    "AUB CREDIT CARD": "aub_cc",
    "GCASH": "gcash",
    "FOOD PANDA": "foodpanda",
    "STREETBY": "streetby",
    "GRAB FOOD": "grabfood"
  }

  const particulars = Object.keys(particularsMap).concat([
    "MM_HEAD", "MM_COMMISARY", "MM_", "MM_RM", "MM_DM", "MM_KM", "FOOD_CHARGE"
  ]);

  return {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    cashiers: apiResponse.cashiers.map((cashier: any, i: number) => {
      console.log("Cashier:", cashier.name, "Transactions:", cashier.transactions);

      return {
        key: cashier.transactions[i].cashier_id,
        name: cashier.name,
        transactions: particulars.map((particular) => {
          const lowerKey = particularsMap[particular] || particular.toLowerCase().replace(/ /g, "_");

          return {
            particular: particular, // Now using CAPSLOCK names
            am: cashier.transactions
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              .filter((tx: any) => tx.shift === "am")
              .reduce((sum: number) => sum + (apiResponse.cashiers[i].transactions[i].testong[lowerKey] || 0), 0),
            mid: cashier.transactions
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              .filter((tx: any) => tx.shift === "mid")
              .reduce((sum: number) => sum + (apiResponse.cashiers[i].transactions[i].testong[lowerKey] || 0), 0),
            pm: cashier.transactions
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              .filter((tx: any) => tx.shift === "pm")
              .reduce((sum: number) => sum + (apiResponse.cashiers[i].transactions[i].testong[lowerKey] || 0), 0),
          };
        }).filter(a => a.particular !== 'AMOUNT'),
      };
    }),
  };
}

const rowSelection: TableRowSelection<Cashier> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
}

const App = () =>
{
    const { cashiers, setCashiers } = usePOSStore()

    useEffect(() => {
      const transformedData = transformAPIResponse(apiResponse);
      setCashiers(transformedData.cashiers);
    }, [setCashiers]);

    const columns: Array<{ title: string; dataIndex?: string; key: string; render?: (text: string, record: Cashier) => React.ReactNode }> = [
      {
          title: "Cashier Name",
          dataIndex: "name",
          key: "name",
      },
      // {
      //     title: "AM",
      //     dataIndex: "am",
      //     key: "am",
      //     render: (_, record) => record.transactions.reduce((sum: number, t: Transaction) => sum + t.am, 0).toLocaleString(),
      // },
      // {
      //     title: "MID",
      //     dataIndex: "mid",
      //     key: "mid",
      //     render: (_, record) => record.transactions.reduce((sum: number, t: Transaction) => sum + t.mid, 0).toLocaleString(),
      // },
      // {
      //     title: "PM",
      //     dataIndex: "pm",
      //     key: "pm",
      //     render: (_, record) => record.transactions.reduce((sum: number, t: Transaction) => sum + t.pm, 0).toLocaleString(),
      // },
      {
          title: "Action",
          key: "action",
          render: () => <Button type="link">View</Button>,
      },
    ]

  return (
    <Table
      columns={columns}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <Table
              columns={[
                {
                  title: "Particular",
                  dataIndex: "particular",
                  key: "particular",
                  width: 'auto',
                  ellipsis: true,
                  onHeaderCell: (column) => ({
                      style: { whiteSpace: "nowrap", minWidth: column.title ? String(column.title).length : 0 },
                  })
                },
                { // am
                  title: 'AM',
                  dataIndex: 'am',
                  key: 'am',
                  width: 'auto',
                  ellipsis: true,
                  onHeaderCell: (column) => ({
                    style: { whiteSpace: "nowrap", minWidth: column.title ? String(column.title).length : 0 },
                  }),
                  render: (text: string, record: Transaction) => record.am.toLocaleString(),
                },
                { //mid
                  title: 'MID',
                  dataIndex: 'mid',
                  key: 'mid',
                  width: 'auto',
                  ellipsis: true,
                  onHeaderCell: (column) => ({
                    style: { whiteSpace: "nowrap", minWidth: column.title ? String(column.title).length : 0 },
                  }),
                  render: (text: string, record: Transaction) => record.mid.toLocaleString(),
                },
                { //pm
                  title: 'PM',
                  dataIndex: 'pm',
                  key: 'pm',
                  width: 'auto',
                  ellipsis: true,
                  onHeaderCell: (column) => ({
                    style: { whiteSpace: "nowrap", minWidth: column.title ? String(column.title).length : 0 },
                  }),
                  render: (text: string, record: Transaction) => record.pm.toLocaleString(),
                },
              ]}
              size="small"
              dataSource={record.transactions.map((t: Transaction, index: number) => ({
                key: index,
                ...t,
              }))}
              pagination={false}
            />
          </>
        ),
      }}
      rowSelection={{ ...rowSelection }}
      dataSource={cashiers.map((cashier, index) => ({ key: index, ...cashier }))}
      scroll={{ x: 1200 }}
    />
  );
};

export default App;
