"use client";

import React, { useState, useEffect } from "react";
import { Button, message, Space, Table, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomDatePicker from "./CustomDatePicker";
import { useStatsStore } from "@/stores/statsStore";
import PDFDocument from "./PDFConverter";
import { pdf } from "@react-pdf/renderer";
import { ExportOutlined, FilePdfOutlined } from "@ant-design/icons";
const { Text } = Typography;
// interface DataTableProps {
//   onUpdateAmounts: (trade: number, nonTrade: number, grand: number, loading: boolean) => void;
// }
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

const formatNumber = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) return "0"; // Handle undefined values
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"); // Adds commas
};


// Transform API response into an array of CashierShift
const transformAPIResponse = (apiData: ResponseData): CashierShift[] => {
  return apiData.cashiers?.flatMap(cashier =>
      cashier.shifts.map(shift => {
        // Clone transactions array for this shift
        const transactions: Transaction[] = [...shift.transactions];

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

const DataTable: React.FC = ({ 
  //onUpdateAmounts 
  }) => {
  const { setNetTotalTrade, setNetTotalNonTrade, setGrandTotalPos, setFetching } = useStatsStore();
  const [cashiers, setCashiers] = useState<CashierShift[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);


  // const [tradeAmount, setTradeAmount] = useState<number>(0);
  // const [nonTradeAmount, setNonTradeAmount] = useState<number>(0);
  // const [grandTotal, setGrandTotal] = useState<number>(0);
  // Use useEffect for initial load and date changes
  useEffect(() => {
    fetchData(selectedDate);
    useStatsStore.persist.rehydrate();
  }, []);

  // useEffect(() => {
  //   onUpdateAmounts(tradeAmount, nonTradeAmount, grandTotal, loading);
  // }, [onUpdateAmounts, tradeAmount, nonTradeAmount, grandTotal, loading]);
  useEffect(() => {
    if(selectedRowKeys.length === 0){
      setGrandTotalPos(0);
      setNetTotalTrade(0);
      setNetTotalNonTrade(0);
      setLoading(false)
    }
  }, [selectedRowKeys])
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
    { title: "PARTICULARS", dataIndex: "particular", key: "particular", 
      render: (_: unknown, record: Transaction) => (
        <>
          {(record.particular.startsWith("GRAND") ||
            record.particular.startsWith("SUB TOTAL")) ? (
            <Text strong>{record.particular}</Text>
          ) : (
             <Text>{record.particular}</Text>
          )}
        </>
      )
    },
    {
      title: "AM",
      dataIndex: "am",
      key: "am",
      render: (_: unknown, record: Transaction) => (
        <>
          {(record.particular.startsWith("GRAND") ||
            record.particular.startsWith("SUB TOTAL")) ? (
            <Text strong>{formatNumber(Number(record.am))}</Text>
          ) : (
            record.am > 0 && <Text>{formatNumber(Number(record.am))}</Text>
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
            <Text strong>{formatNumber(Number(record.mid))}</Text>
          ) : (
            record.mid > 0 && <Text>{formatNumber(Number(record.mid))}</Text>
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
            <Text strong>{formatNumber(Number(record.pm))}</Text>
          ) : (
            record.pm > 0 && <Text>{formatNumber(Number(record.pm))}</Text>
          )}
        </>
      )
    },
    {
      title: "GROSS TOTAL",
      dataIndex: "gross_total",
      key: "gross_total",
      render: (value: number) => <><Text strong>{formatNumber(Number(value))}</Text></>
    },
    {
      title: "NET TOTAL",
      dataIndex: "net_total",
      key: "net_total",
      render: (value: number) => <><Text strong>{formatNumber(Number(value))}</Text></>
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

  const table2Data = React.useMemo(() => {
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
  
    // Compute selectedRecords from cashiers and selectedRowKeys
    const selectedRecords = cashiers.filter(c =>
      selectedRowKeys.includes(`${c.cashier_id}-${c.shift.toLowerCase()}`)
    );
  
    selectedRecords.forEach(record => {
      record.transactions.forEach(t => {
        const key = t.particular;
        const existing = transactionMap.get(key) || {
          particular: key,
          am: 0,
          mid: 0,
          pm: 0,
          grossTotal: 0,
          totalFee: 0,
          netTotal: 0,
        };
  
        let shiftAmount = 0;
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
        existing.grossTotal += shiftAmount;
        const fee = shiftAmount * (Number(t.fee_percent) / 100);
        existing.totalFee += fee;
        existing.netTotal = existing.grossTotal - existing.totalFee;
  
        transactionMap.set(key, existing);
      });
    });
  
    return Array.from(transactionMap.values()).map(t => ({
      key: t.particular,
      particular: t.particular,
      am: t.am,
      mid: t.mid,
      pm: t.pm,
      gross_total: t.grossTotal,
      net_total: t.netTotal,
    }));
  }, [cashiers, selectedRowKeys]);
  
  useEffect(() => {
    setLoading(true)
    setFetching(true)
      // Find the GRAND TOTAL row and set the state
      const grandRow = table2Data.find((d) => d.particular.startsWith("GRAND"));
      const tradeRow = table2Data.find((d) => d.particular.startsWith("SUB TOTAL TRADE"));
      const nonTradeRow = table2Data.find((d) => d.particular.startsWith("SUB TOTAL NON"));
      if (grandRow) {
        setGrandTotalPos(Number(grandRow.net_total));
        // setGrandTotal(Number(grandRow.netTotal));
      }
      if (tradeRow) {
        setNetTotalTrade(Number(tradeRow.net_total));
        // setTradeAmount(Number(tradeRow.netTotal));
      }
      if (nonTradeRow) {
        setNetTotalNonTrade(Number(nonTradeRow.net_total));
        // setNonTradeAmount(Number(nonTradeRow.netTotal));
      }
      setLoading(false)
      setFetching(false);
    }, [table2Data]);

    const exportToCSV = () => {
      if (table2Data.length === 0) {
        message.error('No data to export')
        return;
      }
  
      const headers = ["Particulars", "AM", "MID", "PM", "Gross Total", "Net Total"];
      
      const csvRows = table2Data.map((row) => [
        row.particular,
        row.am,
        row.mid,
        row.pm,
        row.gross_total,
        row.net_total,
      ]);
  
      // Convert to CSV format
      const csvString = [headers, ...csvRows]
        .map((row) => row.map((cell) => `"${cell || 0}"`).join(","))
        .join("\n");
  
      const blob = new Blob(["\ufeff" + csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions_${selectedDate.format("YYYY_MM_DD")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const generatePDF = async () =>
      {
        if (table2Data.length === 0) {
          message.error('No data to export')
          return
        }
        
        const blob = await pdf(<PDFDocument data={table2Data} />).toBlob();
        const url = URL.createObjectURL(blob);

        // window.open(url, "blank"); // for debug purposes, opens in new tab instead of downloading

        const link = document.createElement("a");
        link.href = url;
        link.download = `transactions_${selectedDate.format("YYYY_MM_DD")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

  return (
    <div>
      <Table
        title={() =>
        {
          return (
            <Space style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <Space>
                <CustomDatePicker currentDate={selectedDate} onChangeDate={handleDateChange} />
              </Space>
              <Space>
                <Button type="primary" onClick={exportToCSV}>{<ExportOutlined />}Export as CSV</Button>
                <Button type="primary" onClick={generatePDF}>{<FilePdfOutlined />}Export as PDF</Button> 
              </Space>
            </Space>
          )
        }}
        columns={columnsT1}
        rowSelection={{ type: "checkbox", ...rowSelection }}
        dataSource={cashiers}
        rowKey={(record) => `${record.cashier_id}-${record.shift.toLowerCase()}`}
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
