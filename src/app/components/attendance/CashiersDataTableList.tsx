'use client'

import React, { useState } from 'react';
import { Button, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import CustomDatePicker from '../CustomDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ExportOutlined, FilePdfOutlined } from '@ant-design/icons';

interface DataType {
  key: string;
  name: string;
  shift: string;
  rate: number | string;
}


// kani kay ang columns 
// TableProps<DataType>  // nag call sya sa function nga Props sa table, tapos nag interface sya sa DataType which is naay objects
// ang purpose sa interface kay bale, murag naa na kay concrete idea nga mao ni sila dapat, tapos mao dayun ang interface gamiton na basehan
// pag retrieve sa mga data. Kibali mura na syag list pero ika isa ra ma trigger per use.

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Shift',
    key: 'shift',
    dataIndex: 'shift',
  },
  {
    title: 'Rate',
    key: 'rate',
    dataIndex: 'rate',
  },
  {
    title: 'Action',
    key: 'action',
    render: () =>
    {
      return (
        <>
          { /* userStore user.type === "admin" && */ }
          <Space size="middle">
            <a>Edit</a>
            <a>Delete</a>
          </Space>
        </>
      )
    },
  },
];


// mao ni mga data sa mga cashier for example
// const data: DataType[] = [...];

// Purpose (GPT):
// Immutable Reference (const):

// The const keyword ensures that the variable data cannot be reassigned to a new array. However, the contents of the array can still be modified (e.g., adding/removing elements).
// Type Annotation (DataType[]):

// The colon (:) specifies the type of data.
// DataType[] means that data is an array of DataType elements.
// This helps with type checking and autocompletion in TypeScript. // para mao ra gyd iyang data na handlan kay para proper ang data na iyang ma handle

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    shift: 'MID',
    rate: 250,
  },
  {
    key: '2',
    name: 'Jim Green',
    shift: 'AM',
    rate: 250,
  },
  {
    key: '3',
    name: 'Joe Black',
    shift: 'PM',
    rate: 250,
  },
]

const App: React.FC = () =>
{
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())

  const handleDateChange = (date: Dayjs) => {
    if (date) {
      setSelectedDate(date);
      // fetchData(date);
    }
  };

  return (
    <>
      <Table<DataType>
        components={{
          // body: { cell: EditableCell },
        }}
        bordered
        dataSource={data}
        // loading={loading}
        title={() => 
          <Space style={{ width: 'auto', display: "flex", justifyContent: "space-between" }}>
            <Space>
              <Tooltip placement="bottom" title="Select Date">
                <CustomDatePicker currentDate={selectedDate} onChangeDate={handleDateChange} />
                <Button icon={<CustomDatePicker currentDate={selectedDate} onChangeDate={handleDateChange} />}></Button>
              </Tooltip>
              <Button onClick={() => console.log()}>Refresh Data</Button>
            </Space>
            <Space>
              <Button type="primary">{<ExportOutlined />}To CSV</Button>
              <Button type="primary">{<FilePdfOutlined />}To PDF</Button> 
            </Space>
          </Space>
        }
        columns={columns}
        rowClassName="editable-row"
        size="middle"
        scroll={{ y: 105 * 5 }}
      />
    </>
  )
}

export default App;