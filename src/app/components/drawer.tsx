import React, { useState } from 'react';
import { Button, Drawer, Space } from 'antd';
import TransactionForm from './TransactionForm';
import { Dayjs } from 'dayjs';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface TransactionFormProps {
    onSubmit: (type: NotificationType, message: string) => void
    selectedDate: Dayjs
}
const TransactionFormDrawer: React.FC<TransactionFormProps> = ({onSubmit, selectedDate}) => {
  const [open, setOpen] = useState(false);
  const showDefaultDrawer = () => {
    setOpen(true);
  };
  const handleProcessStatus = (type: NotificationType, message: string, drawerBool:boolean) => {
    onSubmit(type, message)
    setOpen(drawerBool)
  }


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
        destroyOnClose={true}
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
        <TransactionForm onProcess={handleProcessStatus} selectedDate={selectedDate}/>
      </Drawer>
    </>
  );
};

export default TransactionFormDrawer;