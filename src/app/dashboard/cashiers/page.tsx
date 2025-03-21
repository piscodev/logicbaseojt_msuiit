'use client'

import React, { useState } from "react";
import { Button, Drawer, Flex} from 'antd'
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import { useCashierStore } from "@/stores/cashierStore";
import CashiersTable from "@/app/components/CashiersTable";
import SignUpForm from "@/app/components/SignUpForm";
// interface NewCashier {
//     first_name: string,
//     last_name: string,
//     email: string,
//     password: string
//     rate: number
// }
export default function App()
{
    const [isAdding, setIsAdding] = useState<boolean>(false);
    // const [form] = Form.useForm();
    // const clearCashiers = useCashierStore((state)=>state.clearCashiers);
    
    const handleClose = () => {
        setIsAdding(false);
    };
    // const handleAddCashier = async(values: NewCashier) => {
    //     console.log("Values: ", values)
    //     const response = await fetch(`/api/auth/signup`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(values)
    //     });
    //     if(!response.ok){
    //         const errorMessage = await response.json()
    //         throw new Error(errorMessage);
    //     }
    //     console.log('Cashier added succcessfully');
    //     clearCashiers();
    //         // Reset the form fields
    //     form.resetFields();
    // }
  return (
    <>
     <Flex justify="flex-end"> <Button type="primary" onClick={() => setIsAdding(true)}>Add Cashier</Button> </Flex>
     {/* <Flex justify="flex-start"> */}
        <CashiersTable/>
     {/* </Flex> */}
     
    <Drawer
    title="Add Cashier"
    size="large"
    open={isAdding}
    onClose={handleClose}>
        <SignUpForm user_type="cashier"/>
    </Drawer>
    </>
  )
}


//Layout:
// 'use client'

// import React from "react";
// import { Layout } from "antd";
// import { Content } from "antd/es/layout/layout";
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <Layout>
//       <Content style={{ padding: "0 48px", margin: "16px 0" , height: '75vh'}}>
//         {children}
//       </Content>
//     </Layout>
//   );
// }