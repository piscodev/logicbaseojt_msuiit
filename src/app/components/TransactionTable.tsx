import React from "react";
import { Table, Button } from "antd";
import { create } from "zustand";

// const { Option } = Select;

// Zustand store for managing POS data
// type POSStore = {
//   cashierData: {
//     name: string;
//     transactions: Transaction[];
//   };
// };

interface Transaction {
  particular: string;
  am: number;
  mid: number;
  pm: number;
}

interface Cashier {
  name: string;
  transactions: Transaction[];
}

interface POSStore {
  cashiers: Cashier[];
}

// const usePOSStore = create<POSStore>(() => ({
//   cashiers: [
//     {
//       name: "Cherry",
//       transactions: [
//         { particular: "CASH", am: 63608, mid: 0, pm: 0 },
//         { particular: "CHECK", am: 0, mid: 0, pm: 0 },
//         { particular: "BPI CREDIT CARD", am: 5022, mid: 0, pm: 0 },
//         { particular: "BPI DEBIT CARD", am: 0, mid: 0, pm: 0 },
//         { particular: "METRO CREDIT CARD", am: 0, mid: 0, pm: 0 },
//         { particular: "METRO DEBIT CARD", am: 0, mid: 0, pm: 0 },
//         { particular: "PAYMAYA", am: 15510.67, mid: 0, pm: 0 },
//         { particular: "AUB CREDIT CARD", am: 0, mid: 0, pm: 0 },
//         { particular: "GCASH", am: 3108, mid: 0, pm: 0 },
//         { particular: "FOOD PANDA", am: 0, mid: 0, pm: 0 },
//         { particular: "STREEBY", am: 0, mid: 0, pm: 0 },
//         { particular: "GRAB FOOD", am: 0, mid: 0, pm: 0 },
//         { particular: "SUB TOTAL TRADE POS", am: 88248.67, mid: 0, pm: 0 },
//         { particular: "GRAND TOTAL POS", am: 88248.67, mid: 0, pm: 0 },
//       ],
//     },
//     {
//       name: "Alex",
//       transactions: [
//         { particular: "CASH", am: 50000, mid: 0, pm: 10000 },
//         { particular: "CHECK", am: 2000, mid: 0, pm: 0 },
//         { particular: "BPI CREDIT CARD", am: 4000, mid: 0, pm: 5000 },
//         { particular: "PAYMAYA", am: 8000, mid: 0, pm: 2000 },
//         { particular: "GCASH", am: 5000, mid: 0, pm: 3000 },
//         { particular: "GRAND TOTAL POS", am: 69000, mid: 0, pm: 20000 },
//       ],
//     },
//   ],
// }));

// sampol data
const usePOSStore = create<POSStore>(() => ({
    cashiers: Array.from({ length: 100 }, (_, i) => ({
      name: `Cashier ${i + 1}`,
      transactions: [
        { particular: "CASH", am: Math.random() * 100000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "CHECK", am: Math.random() * 5000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "BPI CREDIT CARD", am: Math.random() * 10000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "BPI DEBIT CARD", am: Math.random() * 10000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "METRO CREDIT CARD", am: Math.random() * 10000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "METRO DEBIT CARD", am: Math.random() * 10000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "PAYMAYA", am: Math.random() * 15000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "AUB CREDIT CARD", am: Math.random() * 10000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "GCASH", am: Math.random() * 8000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "FOOD PANDA", am: Math.random() * 5000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "STREEBY", am: Math.random() * 5000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "GRAB FOOD", am: Math.random() * 5000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "SUB TOTAL TRADE POS", am: Math.random() * 100000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
        { particular: "GRAND TOTAL POS", am: Math.random() * 100000, mid: Math.random() * 100000, pm: Math.random() * 100000 },
      ],
    })),
  }))  


const App = () =>
{
    const { cashiers } = usePOSStore()
    // const [selectedShift, setSelectedShift] = useState("AM")

    const columns: Array<{ title: string; dataIndex?: string; key: string; render?: (text: string, record: Cashier) => React.ReactNode }> = [
    {
        title: "Cashier Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "AM",
        dataIndex: "am",
        key: "am",
        render: (_, record) => record.transactions.reduce((sum: number, t: Transaction) => sum + t.am, 0).toLocaleString(),
    },
    {
        title: "MID",
        dataIndex: "mid",
        key: "mid",
        render: (_, record) => record.transactions.reduce((sum: number, t: Transaction) => sum + t.mid, 0).toLocaleString(),
    },
    {
        title: "PM",
        dataIndex: "pm",
        key: "pm",
        render: (_, record) => record.transactions.reduce((sum: number, t: Transaction) => sum + t.pm, 0).toLocaleString(),
    },
    {
        title: "Action",
        key: "action",
        render: () => <Button type="link">View</Button>,
    },
]

// const dataSource = [
//     {
//         key: "1", // ID
//         name: cashierData.name,
//         transactions: cashierData.transactions,
//     },
// ]

  return (
    <Table
      columns={columns}
      expandable={{
        expandedRowRender: (record) => (
          <>
            {/* <Select
              defaultValue={selectedShift}
              onChange={(value: string) => setSelectedShift(value)}
              style={{ marginBottom: 10 }}
            >
              <Option value="AM">AM</Option>
              <Option value="MID">MID</Option>
              <Option value="PM">PM</Option>
            </Select> */}
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
      dataSource={cashiers.map((cashier, index) => ({ key: index, ...cashier }))}
      scroll={{ x: 1200 }}
    />
  );
};

export default App;
