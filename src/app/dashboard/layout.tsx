'use client'

import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import type { MenuProps } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import Nav from "../components/NavigationBar";
import { usePathname, useRouter } from "next/navigation";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/dashboard', <PieChartOutlined />),
  getItem('Attendance', '/dashboard/attendance', <DesktopOutlined />),
  getItem('Profiles', 'sub1', <UserOutlined />, [
    getItem('My Profile', '3'),
    getItem('Cashiers', '/dashboard/cashiers')
  ]),
  getItem('Records', 'sub2', <TeamOutlined />, [getItem('Transactions', '6'), getItem('Cashier', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
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
        onSelect={(e) => router.push(e.key)} />
      </Sider>
      <Layout>
        <Nav/>
        <Content style={{ padding: "0 48px", margin: "16px 0" }}>
        {children}
      </Content>
    </Layout>
    </Layout>
  );
}