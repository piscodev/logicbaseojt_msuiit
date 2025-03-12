'use client'

import React, { useState } from "react";
import { Button, Drawer, Flex, Form, Input } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useCashierStore } from "@/stores/cashierStore";
import CashiersTable from "@/app/components/CashiersTable";
interface NewCashier {
    name: string,
    email: string,
    password: string
    rate: number
}
export default function App()
{
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [form] = Form.useForm();
    const clearCashiers = useCashierStore((state)=>state.clearCashiers);
    
    const handleClose = () => {
        setIsAdding(false);
    };
    const handleAddCashier = async(values: NewCashier) => {
        console.log("Values: ", values)
        const response = await fetch(`/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        });
        if(!response.ok){
            const errorMessage = await response.json()
            throw new Error(errorMessage);
        }
        console.log('Cashier added succcessfully');
        clearCashiers();
            // Reset the form fields
        form.resetFields();
    }
  return (
    <>
     <Flex justify="flex-end"> <Button type="primary" onClick={() => setIsAdding(true)}>Add Cashier</Button> </Flex>
     {/* <Flex justify="flex-start"> */}
        <CashiersTable/>
     {/* </Flex> */}
     
    <Drawer
    // size="large"
    open={isAdding}
    onClose={handleClose}>
        <Form
        name="transaction_form"
        form={form}
        layout="vertical"
        onFinish={handleAddCashier}
        style={{ maxWidth: '100%' }} // optional styling
        autoComplete="off"
        >  
            <Form.Item
            label="Cashier Name"
            name="name"
            >
                <Input placeholder="Fullname"/>
            </Form.Item>
            <Form.Item
            label="Email"
            name="email"
            >
                <Input placeholder="Input email"/>
            </Form.Item>
            <Form.Item
            label="Password"
            name="password"
            >
                <Input.Password placeholder="Create strong password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
            </Form.Item>
            <Form.Item
            label="Hourly Rate"
            name="rate"
            >
                <Input placeholder="e.g. 250.00" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </Form.Item>
        </Form>
    </Drawer>
    </>
  )
}