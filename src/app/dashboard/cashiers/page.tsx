'use client'

import React, { useState } from "react";
import { Button, Drawer, Flex, notification} from 'antd'
import CashiersTable from "@/app/components/CashiersTable";
import SignUpForm from "@/app/components/SignUpForm";
type NotificationType = 'success' | 'info' | 'warning' | 'error';
export default function App()
{
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    
    const handleClose = () => {
        setIsAdding(false);
    };
    const responseHandler = (title:string, message:string, type:NotificationType) => {
        api[type]({
          message: title,
          description:
            message,
        });
        if(type==='success'){
            handleClose()
        }
      }
  return (
    <>
        {contextHolder}
        <Flex justify="flex-end"> <Button type="primary" onClick={() => setIsAdding(true)}>Add Cashier</Button> </Flex>
        
            <CashiersTable/>
        
        <Drawer
        title="Add Cashier"
        size="large"
        open={isAdding}
        onClose={handleClose}>
            <SignUpForm user_type="cashier" responseMessage={responseHandler}/>
        </Drawer>
    </>
  )
}