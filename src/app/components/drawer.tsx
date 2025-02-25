import React, { useState } from 'react';
import { Button, Drawer, Space } from 'antd';
import TransactionForm from './TransactionForm';
const TransactionFormDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const showDefaultDrawer = () => {
    setOpen(true);
  };



  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDefaultDrawer}>
          Add Transaction
        </Button>
      </Space>
      <Drawer
        title='Transaction Form'
        placement="left"
        size='default'
        onClose={onClose}
        open={open}
        // extra={
        //   <Space>
        //     <Button onClick={onClose}>Cancel</Button>
        //     <Button type="primary" onClick={onClose}>
        //       OK
        //     </Button>
        //   </Space>
        // }
      >
        <TransactionForm/>
      </Drawer>
    </>
  );
};

export default TransactionFormDrawer;