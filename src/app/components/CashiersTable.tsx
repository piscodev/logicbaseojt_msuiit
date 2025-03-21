import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Badge, Typography } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { Dayjs } from 'dayjs';
import { DateTime } from 'luxon';
const { RangePicker } = DatePicker;
const { Text } = Typography;
export type NoUndefinedRangeValueType<DateType> = [start: DateType | null, end: DateType | null];
interface DataType {
  key: React.Key
  id: number
  name: string
  rate: number
  total_hours_worked: number
  earnings: number
  total_earnings ?: number
  active: number
  last_login: string
  address: string
  age: number
  gender: string
  email: string
  lane_name: string | null
}

const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    //   showSorterTooltip: { target: 'full-header' },
    //   filters: [
    //     {
    //       text: 'Joe',
    //       value: 'Joe',
    //     },
    //     {
    //       text: 'Jim',
    //       value: 'Jim',
    //     },
    //     {
    //       text: 'Submenu',
    //       value: 'Submenu',
    //       children: [
    //         {
    //           text: 'Green',
    //           value: 'Green',
    //         },
    //         {
    //           text: 'Black',
    //           value: 'Black',
    //         },
    //       ],
    //     },
    //   ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      // onFilter: (value, record) => record.name.indexOf(value as string) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
    {
      title: 'Status',
      dataIndex: 'last_login',
      render:(_: unknown, record: DataType)=>(
        <>
          {(record.active === 1) ? (<Badge status="success" text="Active" />) : (<Text>Last Online: {(DateTime.fromISO(record.last_login).toFormat('yyyy-MM-dd HH:mm:ss'))==="Invalid DateTime"?"Never":DateTime.fromISO(record.last_login).toFormat('yyyy-MM-dd HH:mm:ss')}</Text>)}
        </>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Cashier Lane',
      dataIndex: 'cl_name',
      render:(_: unknown, record: DataType)=>(
        <>
          {(record.lane_name !== null) ? (record.lane_name) : "Not yet Assigned"}
        </>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.rate - b.rate,
    },
    {
        title: 'Total Hours',
        dataIndex: 'total_hours_worked',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.total_hours_worked - b.total_hours_worked,
      },
      {
        title: 'Total Earnings',
        dataIndex: 'earnings',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.earnings - b.earnings,
      },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   filters: [
    //     {
    //       text: 'London',
    //       value: 'London',
    //     },
    //     {
    //       text: 'New York',
    //       value: 'New York',
    //     },
    //   ],
    //   onFilter: (value, record) => record.address.indexOf(value as string) === 0,
    // },
  ];
  
//   const data = [
//     {
//       key: '1',
//       name: 'John Brown',
//       age: 32,
//       address: 'New York No. 1 Lake Park',
//     },
//     {
//       key: '2',
//       name: 'Jim Green',
//       age: 42,
//       address: 'London No. 1 Lake Park',
//     },
//     {
//       key: '3',
//       name: 'Joe Black',
//       age: 32,
//       address: 'Sydney No. 1 Lake Park',
//     },
//     {
//       key: '4',
//       name: 'Jim Red',
//       age: 32,
//       address: 'London No. 2 Lake Park',
//     },
//   ];
  

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

const CashiersTable:React.FC = () => {
    const [ cashiers, setCashiers ] = useState <DataType[]>()
    const fetchData = async(startDate?: string, endDate?: string) => {
        const response = await fetch('/api/getCashierData',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate })
        })
        if(!response.ok){
            console.error("Error getting Cashier data");
        }
        const parsedData = await response.json()
        setCashiers(parsedData.cashiers)
    }
    useEffect(()=>{
        // Initial fetch (default day is current date)
        fetchData();
    }, []);

    const setDates = (dates: NoUndefinedRangeValueType<Dayjs> | null, dateStrings: [string, string]) => {
        console.log("Dates: ", dateStrings)
        fetchData(dateStrings[0], dateStrings[1]);
    }
 return (
    <Table<DataType>
    title={() => <RangePicker onChange={setDates}/>}
    columns={columns}
    dataSource={cashiers}
    onChange={onChange}
    showSorterTooltip={{ target: 'sorter-icon' }}
    pagination={{ pageSize: 10 }}
    scroll={{ x: '100vw' }}
  />
 )
};
export default CashiersTable;