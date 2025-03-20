'use client'

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import type { MenuProps } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import Nav from "../components/NavigationBar";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useCashierStore } from "@/stores/cashierStore";
import FooterComp from "../components/Footer";
import usePushNotification from "@/hooks/usePushNotification";
import { ToastContainer } from "react-toastify";
const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  disabled:boolean,
  icon?: React.ReactNode,
  children?: MenuItem[],
  
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled
  } as MenuItem;
}



export default function RootLayout({ children }: { children: React.ReactNode })
{
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const user = useUserStore((state)=>state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  const [items, setItems]= useState<MenuItem[]>([])

  usePushNotification()

  useEffect(() => {
    if(user)
      if(user.user_type === 'admin'){
        setItems([
          getItem('Dashboard', '/dashboard', false, <PieChartOutlined />),
          getItem('My Profile', '1', true),
          getItem('Employee Management', 'sub1', false, <UserOutlined />, [
            getItem('Assign Cashiers', '/dashboard/employeeManagement/assignCashiers', false),
            getItem('View Cashiers', '/dashboard/cashiers', false)
          ]),
          getItem('Sales Management', 'sub2', false, <DesktopOutlined />, [
            getItem('View Sales', '2', true),
          ]),
          
          getItem('Product Management', 'sub3', false, <DesktopOutlined />, [
            getItem('View Products', '3', true), // All Products (filter by out of stock, top-selling products, lowest-selling products), Add Product, Import Products (Bulk Upload), Modify Product (Edit product details, change pricing), Delete Product (Remove product) 
            getItem('Product Categories', '4', true), // Add categories, manage categories (assign products to categories)
          ]),
          getItem('Inventory Management', 'sub4', false, <DesktopOutlined />, [
            getItem('Stock Overview', '5', true), // Current Inventory levels, Low stock alerts, Add stock to product
            getItem('Inventory Adjustments', '6', true), // Manual Adjustments, Stock Reconciliation
            getItem('Stock Audits', '7', true), // Scheduled Audits, Past Audits
          ]),
          getItem('Reports & Analytics', 'sub5', false, <UserOutlined />, [
            getItem('Sales Reports', '8', true), // Daily Sales, Monthly Sales, Sales by Product
            getItem('Inventory Reports', '9', true), // Stock Management Report, Stock Value Report
            getItem('Employee Reports', '10', true), // Employee Sales Performance, Shift reports
            getItem('Audit Logs', '11', true) // Audit History
          ]),
          
          getItem('Settings', 'sub6', false,<TeamOutlined />, [
            getItem('System', '12', true), 
            getItem('POS Settings', '13', true),
            getItem('Security', '14', true), 
            getItem('Backup & Restore', '15', true),
          ]),
          getItem('Logout', '/logout', false, <FileOutlined />),
        ])
      } else {
        setItems([
          getItem('Dashboard', '/dashboard', false, <PieChartOutlined />),
          getItem('POS', 'sub1', false, <DesktopOutlined />, [
            getItem('New Sale', '1', true),
            getItem('Process Refund', '2', true),
          ]),
          getItem('Attendance', 'sub2', false, <CalendarOutlined />, [
            getItem('Clock In/Out', '/dashboard/attendance', false),
            getItem('Shift History', '/dashboard/shiftHistory', false),
          ]),
          getItem('Reports', 'sub3', false, <TeamOutlined />, [
            getItem('Daily Sales Report', '3', true), 
            getItem('My Performance', '4', true)]),
          getItem('Logout', '/logout', false, <FileOutlined />),
        ])
      }
  }, [user])
  

  const router = useRouter();
  const pathname = usePathname();
  const clearCashiers = useCashierStore((state)=>state.clearCashiers);
  return (
    <Layout>
      <Sider theme="dark" trigger={null} collapsible collapsed={collapsed}>
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color:'white'
            }}
          />
        <Menu theme="dark" defaultSelectedKeys={['/dashboard']} mode="inline" items={items}
        selectedKeys={[pathname]}
        onSelect={async(e) => {
          if(e.key==="/logout"){
            const res = await fetch('/api/auth/logout', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user?.email),
            });
      
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            clearUser();
            clearCashiers();
            router.replace("/login"); // Redirect to login page
            return
          }
          router.push(e.key)
          }} />
      </Sider>
      <Layout>
        <Nav/>
        <Content style={{ padding: "0 48px", margin: "16px 0" , minHeight: '80vh'}}>
          {children}
        </Content>
        <FooterComp/>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}