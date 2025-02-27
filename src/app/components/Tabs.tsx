import React from 'react';
import { Button, Divider, Tabs } from 'antd';
import TestTable from './testTable';
import DataTableTest from './DataTableTest';

const items = Array.from({ length: 2 }).map((_, i) =>
{
    const id = String(i + 1)
    return {
        label: `Tab ${id}`,
        key: id,
        children: i === 0 ? <TestTable /> : <DataTableTest />,
    }
})

const App: React.FC = () =>
{
  return (
    <>
      <Tabs items={items} />
      <Divider />
    </>
  )
}

export default App