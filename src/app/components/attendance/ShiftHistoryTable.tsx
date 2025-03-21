import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useUserStore } from '@/stores/userStore';
import { DateTime } from 'luxon';
export type NoUndefinedRangeValueType<DateType> = [start: DateType | null, end: DateType | null];

interface DataType {
    time_in: string,
    time_out: string,
    total_hours_worked: number,
    shift_date: string,
    shift: string,
    name: string
}
const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    
      onFilter: (value, record) => record.name.indexOf(value as string) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
        title: 'Shift',
        dataIndex: 'shift',
        // render: (text: string) => text?.length > 0 && DateTime.fromISO(text).toFormat('yyyy-MM-dd'),
      },
    {
      title: 'Shift Date',
      dataIndex: 'shift_date',
      render: (text: string) => text?.length > 0 && DateTime.fromISO(text).toFormat('yyyy-MM-dd'),
    },
    {
        title: 'Time In',
        dataIndex: 'time_in',
        render: (text: string) => text?.length > 0 && DateTime.fromISO(text).toFormat('yyyy-MM-dd HH:mm:ss'),
    },
    {
        title: 'Time Out',
        dataIndex: 'time_out',
        render: (text: string) => text?.length > 0 && DateTime.fromISO(text).toFormat('yyyy-MM-dd HH:mm:ss'),
    },
    {
        title: 'Total Hours',
        dataIndex: 'total_hours_worked',
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
  

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const ShiftHistoryTable:React.FC = () => {
    const user = useUserStore((state) => state.user);
    const [ data, setData ] = useState <DataType[]>()
    const fetchData = async() => {
        if(user){
            const name = user.first_name + " " + user.last_name;
            const response = await fetch('/api/attendance/shiftHistory',{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            if(!response.ok){
                console.error("Error getting Cashier data");
            }
            const parsedData = await response.json()

            setData(parsedData.data)
        }
        
        
    }
    useEffect(()=>{
        fetchData();
    }, []);
 return (
    <Table<DataType>
    columns={columns}
    dataSource={data}
    onChange={onChange}
    showSorterTooltip={{ target: 'sorter-icon' }}
    pagination={{ pageSize: 10 }}
  />
 )
};
export default ShiftHistoryTable;