'use client'

import React from 'react';
import { Button, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
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
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Shift',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Rate',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
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
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

const App: React.FC = () =>
{
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
          <Space style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          
            <Space>
              {/* <CustomDatePicker /> */}
              <Button onClick={() => console.log()}>Refresh Data</Button>
              {/* <TransactionFormDrawer onSubmit={handleTransactionProcess} selectedDate={currentDate} /> */}
            </Space>
          
            {/* <Space>
              <Button type="primary" onClick={exportToCSV}>{<ExportOutlined />}Export as CSV</Button>
              <Button type="primary" onClick={generatePDF}>{<FilePdfOutlined />}Export as PDF</Button> 
            </Space> */}
          </Space>
        }
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
        size="middle"
        scroll={{ y: 105 * 5 }}
      />
    </>
  )
}

export default App;