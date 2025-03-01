"use client";

import React, { useState } from "react";
import { Space, Table, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomDatePicker from "./CustomDatePicker";

const { Text } = Typography;

interface Transaction {
  particular: string;
  particular_id?: number;
  am: number ;
  mid: number ;
  pm: number ;
  total_trade_am?: number ;
  total_trade_mid?: number ;
  total_trade_pm?: number ;
  total_non_trade_am?: number ;
  total_non_trade_mid?: number ;
  total_non_trade_pm?: number ;
  grand_total_am?: number ;
  grand_total_mid?: number ;
  grand_total_pm?: number ;
  grossTotal?: number;
  netTotal?: number;
  fee_percent?: number ;
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

// Transform API response into an array of CashierShift
const transformAPIResponse = (apiData: ResponseData): CashierShift[] => {
  return apiData.cashiers?.flatMap(cashier =>
      cashier.shifts.map(shift => {
        // Clone transactions array for this shift
        let transactions: Transaction[] = [...shift.transactions];

        // Compute SUB TOTAL TRADE POS using only transactions with particular_id <= 12
        const tradeTotal: Transaction = {
          particular: "SUB TOTAL TRADE POS",
          particular_id: -1,
          am: transactions.reduce(
            (sum, t) =>
              t.particular_id && t.particular_id <= 12 ? sum + Number(t.total_trade_am) : sum,
            0
          ),
          mid: transactions.reduce(
            (sum, t) =>
              t.particular_id && t.particular_id <= 12 ? sum + Number(t.total_trade_mid) : sum,
            0
          ),
          pm: transactions.reduce(
            (sum, t) =>
              t.particular_id && t.particular_id <= 12 ? sum + Number(t.total_trade_pm) : sum,
            0
          ),
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
            // Calculate gross total for trade transactions
            const grossTotal = transactions.reduce((sum, t) => {
              if (t.particular_id && t.particular_id <= 12) {
                if (Number(t.total_trade_am) > 0) {
                  sum += Number(t.total_trade_am);
                }
                if (Number(t.total_trade_mid) > 0) {
                  sum += Number(t.total_trade_mid);
                }
                if (Number(t.total_trade_pm) > 0) {
                  sum += Number(t.total_trade_pm);
                }
              }
              return sum;
            }, 0);

            // Calculate the total fee amount using a weighted sum per transaction
            const weightedFee = transactions.reduce((sum, t) => {
              if (t.particular_id && t.particular_id <= 12) {
                let subTotal = 0;
                if (Number(t.total_trade_am) > 0) {
                  subTotal += Number(t.total_trade_am);
                }
                if (Number(t.total_trade_mid) > 0) {
                  subTotal += Number(t.total_trade_mid);
                }
                if (Number(t.total_trade_pm) > 0) {
                  subTotal += Number(t.total_trade_pm);
                }
                sum += subTotal * (Number(t.fee_percent) / 100);
              }
              return sum;
            }, 0);

            return grossTotal > 0 ? (weightedFee / grossTotal) * 100 : 0;
          })()
        };

        // (Similar totals for non-trade and grand total are computed as needed.)
        const nonTradeTotal: Transaction = {
          particular: "SUB TOTAL NON TRADE POS",
          particular_id: -2,
          am: transactions.reduce(
            (sum, t) =>
              t.particular_id && t.particular_id >= 13 ? sum + Number(t.total_non_trade_am) : sum,
            0
          ),
          mid: transactions.reduce(
            (sum, t) =>
              t.particular_id && t.particular_id >= 13 ? sum + Number(t.total_non_trade_mid) : sum,
            0
          ),
          pm: transactions.reduce(
            (sum, t) =>
              t.particular_id && t.particular_id >= 13 ? sum + Number(t.total_non_trade_pm) : sum,
            0
          ),
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

        const grandTotal: Transaction = {
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
          fee_percent: (() => {
            // Calculate gross total for trade transactions
            const grossTotal = transactions.reduce((sum, t) => {
              if (t.particular_id && t.particular_id <= 20) {
                if (Number(t.total_trade_am) > 0) {
                  sum += Number(t.total_trade_am);
                } else if (Number(t.total_non_trade_am) > 0) {
                  sum += Number(t.total_non_trade_am);
                }
                if (Number(t.total_trade_mid) > 0) {
                  sum += Number(t.total_trade_mid);
                } else if (Number(t.total_non_trade_mid) > 0) {
                  sum += Number(t.total_non_trade_mid);
                }
                if (Number(t.total_trade_pm) > 0) {
                  sum += Number(t.total_trade_pm);
                } else if (Number(t.total_non_trade_pm) > 0) {
                  sum += Number(t.total_non_trade_pm);
                }
              }
              return sum;
            }, 0);

            // Calculate the total fee amount using a weighted sum per transaction
            const weightedFee = transactions.reduce((sum, t) => {
              if (t.particular_id && t.particular_id <= 20) {
                let subTotal = 0;
                if (Number(t.total_trade_am) > 0) {
                  subTotal += Number(t.total_trade_am);
                }
                if (Number(t.total_trade_mid) > 0) {
                  subTotal += Number(t.total_trade_mid);
                }
                if (Number(t.total_trade_pm) > 0) {
                  subTotal += Number(t.total_trade_pm);
                }
                sum += subTotal * (Number(t.fee_percent) / 100);
              }
              return sum;
            }, 0);

            return grossTotal > 0 ? (weightedFee / grossTotal) * 100 : 0;
          })()
        };

        
        // Insert "TRADE TOTAL" after "Grab Food" (id: 12)
        const grabFoodIndex = transactions.findIndex(t => t.particular_id === 12);
        if (grabFoodIndex !== -1) {
          transactions.splice(grabFoodIndex + 1, 0, tradeTotal);
        }
        const mmDmIndex = transactions.findIndex(t => t.particular_id === 18);
        if (mmDmIndex !== -1) {
          transactions.splice(mmDmIndex + 1, 0, nonTradeTotal);
        }
        const nonTradeTotalIndex = transactions.findIndex(t => t.particular_id === -2);
        if (nonTradeTotalIndex !== -1) {
          transactions.splice(nonTradeTotalIndex + 1, 0, grandTotal);
        }
        console.log("Transformed data: ", {
          cashier_id: cashier.cashier_id,
          name: cashier.name,
          shift: shift.shift,
          transactions
        })
        return {
          cashier_id: cashier.cashier_id,
          name: cashier.name,
          shift: shift.shift,
          transactions
        };
      })
    ) || [];
};

const DataTable = () => {
  const [cashiers, setCashiers] = useState<CashierShift[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (dateInput = dayjs()) => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions/getAllCashierTransactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateInput })
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setCashiers(transformAPIResponse(data));
    } catch (error) {
      console.error("Fetch error:", error);
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
      render: (text: string) => <div style={{ fontWeight: 600 }}>{text}</div>
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
    {
      title: "AM",
      dataIndex: "am",
      key: "am",
      render: (_: unknown, record: Transaction) => (
        <>
          {(record.particular.startsWith("GRAND") ||
            record.particular.startsWith("SUB TOTAL")) ? (
            <Text strong>{record.am}</Text>
          ) : (
            record.am > 0 && <Text>{record.am}</Text>
          )}
        </>
      )
    },
    {
      title: "MID",
      dataIndex: "mid",
      key: "mid",
      render: (_: unknown, record: Transaction) => (
        <>
          {(record.particular.startsWith("GRAND") ||
            record.particular.startsWith("SUB TOTAL")) ? (
            <Text strong>{record.mid}</Text>
          ) : (
            record.mid > 0 && <Text>{record.mid}</Text>
          )}
        </>
      )
    },
    {
      title: "PM",
      dataIndex: "pm",
      key: "pm",
      render: (_: unknown, record: Transaction) => (
        <>
          {(record.particular.startsWith("GRAND") ||
            record.particular.startsWith("SUB TOTAL")) ? (
            <Text strong>{record.pm}</Text>
          ) : (
            record.pm > 0 && <Text>{record.pm}</Text>
          )}
        </>
      )
    },
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
    }
  ];

  // Filter selected cashier shifts (if only one is selected, only its transactions are used)
  const selectedRecords = cashiers.filter(c =>
    selectedRowKeys.includes(`${c.cashier_id}-${c.shift.toLowerCase()}`)
  );

  // Aggregate transactions from the selected records.
  // This means that if you select 1 cashier, you'll only see that cashier's transactions;
  // if 2 are selected, you'll see their combined data; and so on.
  const transactionMap = new Map<
    string,
    {
      particular: string;
      am: number;
      mid: number;
      pm: number;
      grossTotal: number;
      totalFee: number;
      netTotal: number;
    }
  >();

  selectedRecords.forEach(record => {
    record.transactions.forEach(t => {
      // Only include trade transactions (particular_id <= 12)
      // if (t.particular_id && t.particular_id <= 12) {
        const key = t.particular;
        const existing = transactionMap.get(key) || {
          particular: key,
          am: 0,
          mid: 0,
          pm: 0,
          grossTotal: 0,
          totalFee: 0,
          netTotal: 0
        };

        let shiftAmount = 0;
        // Use the appropriate shift column based on the record's shift
        switch (record.shift.toLowerCase()) {
          case "am":
            shiftAmount = Number(t.am) || 0;
            existing.am += shiftAmount;
            break;
          case "mid":
            shiftAmount = Number(t.mid) || 0;
            existing.mid += shiftAmount;
            break;
          case "pm":
            shiftAmount = Number(t.pm) || 0;
            existing.pm += shiftAmount;
            break;
          default:
            break;
        }
        // Update gross total for this particular
        existing.grossTotal += shiftAmount;
        // Calculate fee for this transaction and accumulate
        const fee = shiftAmount * (Number(t.fee_percent) / 100);
        existing.totalFee += fee;
        // Compute net total as gross minus fee
        existing.netTotal = existing.grossTotal - existing.totalFee;

        transactionMap.set(key, existing);
      // }
    });
  });

  const table2Data = Array.from(transactionMap.values()).map(t => ({
    key: t.particular,
    particular: t.particular,
    am: t.am,
    mid: t.mid,
    pm: t.pm,
    grossTotal: t.grossTotal,
    netTotal: t.netTotal
  }));

  return (
    <div>
      <Table
        title={() => (
          <Space>
            <CustomDatePicker currentDate={selectedDate} onChangeDate={handleDateChange} />
          </Space>
        )}
        columns={columnsT1}
        rowSelection={{ type: "checkbox", ...rowSelection }}
        dataSource={cashiers}
        rowKey={(record) => `${record.cashier_id}-${record.shift.toLowerCase()}`}
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
            ? "No transactions for selected shift"
            : "Select a cashier and shift to view transactions"
        }}
      />
    </div>
  );
};

export default DataTable;
