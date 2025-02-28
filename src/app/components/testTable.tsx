import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { DatePicker, Form, Input, InputNumber, message, Space, Button, Table, Typography, notification } from 'antd';
import { FilePdfOutlined, ExportOutlined } from '@ant-design/icons'
const { Text } = Typography;
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import TransactionFormDrawer from './drawer';
import PDFDocument from './PDFConverter';
import { pdf } from '@react-pdf/renderer';


export const dynamic = 'force-dynamic';


interface DataType {
  key: string;
  particular: string;
  am: number | string;
  mid: number | string;
  pm: number | string;
  gross_total: number;
  net_total:number;
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

const TestTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
// const [editingKey,] = useState('');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi,] = message.useMessage();
  const [api, ] = notification.useNotification();

  const openNotification = (pauseOnHover: boolean) => () => {
    api.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      showProgress: true,
      pauseOnHover,
    });
  };


// Use useEffect for initial load and date changes
  useEffect(() => {
    fetchData(currentDate);
  }, [currentDate]);

  const fetchData = async (dateInput=dayjs()) => {
    try{
        setLoading(true);
        const response = await fetch('/api/transactions/getTransactionByDay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateInput })
        })
        if(!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        console.log('Transaction Data Retrieved: ', data);
        setData(data.data);
    } catch (error) {
        console.error('Fetch error:', error);
        console.error(loading);
    } finally {
        setLoading(false);
    }
    
  };
 
  const onChangeDate = (date: Dayjs) => {
    if (date) {
        setCurrentDate(date)
        fetchData(date);
    } else {
        console.log('Clear');
    }
  };
  const CustomDatePicker = () => (
    <DatePicker
        onChange={onChangeDate}
        defaultValue={currentDate}
        presets={[
            { label: 'Yesterday', value: dayjs().add(-1, 'd') },
            { label: 'Last Week', value: dayjs().add(-7, 'd') },
            { label: 'Last Month', value: dayjs().add(-1, 'month') },
        ]}
    />
  );
  type NotificationType = 'success' | 'info' | 'warning' | 'error';
  const handleTransactionProcess = async(type: NotificationType, message:string) => {
    messageApi.open({
        type:type,
        content: message
    });
    console.log("TYPE:", type);
    if(type==='success'){
        console.log("SUCCESS")
        fetchData(currentDate);
    }
  };

  const columns = [
    {
      title: 'PARTICULARS',
      dataIndex: 'particular',
      width: '25%',
      editable: true,
    },
    {
      title: 'AM',
      dataIndex: 'am',
      width: '15%',
      editable: true,
      render:(_: unknown, record: DataType)=>(
        <>
          {(record.particular.startsWith('GRAND') || record.particular.startsWith('SUB TOTAL') /*|| record.particular.startsWith('CASHIER')*/) ? (<Text strong>{record.am}</Text>) : (<Text>{record.am}</Text>)}
        </>
      )
    },
    {
      title: 'MID',
      dataIndex: 'mid',
      width: '15%',
      editable: true,
      render:(_: unknown, record: DataType)=>(
        <>
          {(record.particular.startsWith('GRAND') || record.particular.startsWith('SUB TOTAL') /*|| record.particular.startsWith('CASHIER')*/) ? (<Text strong>{record.mid}</Text>) : (<Text>{record.mid}</Text>)}
        </>
      ),
      
    },
    {
        title: 'PM',
        dataIndex: 'pm',
        width: '15%',
        editable: true,
        render:(_: unknown, record: DataType)=>(
            <>
              {(record.particular.startsWith('GRAND') || record.particular.startsWith('SUB TOTAL') /*|| record.particular.startsWith('CASHIER')*/) ? (<Text strong>{record.pm}</Text>) : (<Text>{record.pm}</Text>)}
            </>
          )
    },
    {
        title: 'GROSS TOTAL',
        dataIndex: 'gross_total',
        width: '18%',
        editable: false,
        render:(_: unknown, record: DataType)=>(
            <>
                {(<Text strong>{record.gross_total}</Text>)}
            </>
        )
    },
    {
        title: 'NET TOTAL',
        dataIndex: 'net_total',
        width: '18%',
        editable: false,
        render:(_: unknown, record: DataType)=>(
            <>
              {(<Text strong>{record.net_total}</Text>)}
            </>
        )
    },
  ];


  const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === 'am' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  const exportToCSV = () => {
    if (data.length === 0) {
      message.warning("No data to export.");
      return;
    }

    const headers = ["Particulars", "AM", "MID", "PM", "Gross Total", "Net Total"];
    
    const csvRows = data.map((row) => [
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
    link.setAttribute("download", `transactions_${currentDate.format("YYYY_MM_DD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // to pdf
  const generatePDF = async () =>
  {
    if (data.length === 0) {
      openNotification(true)
      return
    }
    
    const blob = await pdf(<PDFDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    // window.open(url, "blank"); // for debug purposes, opens in new tab instead of downloading

    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${currentDate.format("YYYY_MM_DD")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  

  return (
    <Form form={form} component={false}>
      <Table<DataType>
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={data}
        loading={loading}
        title={() => 
          <Space style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          {/* Left Section */}
          <Space>
            <CustomDatePicker />
            <Button onClick={() => fetchData(currentDate)}>Refresh Data</Button>
            <TransactionFormDrawer onSubmit={handleTransactionProcess} selectedDate={currentDate} />
          </Space>
        
          {/* Right Section */}
          {/* <PDFDownloadLink
              document={<PDFDocument data={data} />}
              fileName={`transactions_${dayjs().format("YYYY-MM-DD")}.pdf`}
            >
              {({ loading }) =>
              {
                return (
                  <> */}
                    <Space>
                      <Button type="primary" onClick={exportToCSV}>{<ExportOutlined />}Export as CSV</Button>
                      <Button type="primary" onClick={generatePDF}>{<FilePdfOutlined />}Export as PDF</Button> 
                  
                    </Space>
                    {/* </>
                )
              }}
            </PDFDownloadLink> */}
        </Space>}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        size="middle"
        scroll={{ y: 105 * 5 }}
      />
    </Form>
  );
};


export default TestTable;