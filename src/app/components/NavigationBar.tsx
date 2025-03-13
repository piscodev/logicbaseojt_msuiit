'use client'

import React from 'react';
import { Layout, Card, Space, Menu } from 'antd';
import Icon from '@ant-design/icons'
import LogoutButton from './LogoutButton';
import MoneyCacheLogo from "./../../../public/file.svg"
import { usePathname, useRouter } from 'next/navigation';

const { Header }  = Layout

const Nav: React.FC = () =>
{
    const router = useRouter()
    const pathname = usePathname()

    return (
    <>
        <Header style={{ display: "flex", alignItems: "center", justifyContent:'space-between', background: "#1669B2", height:'72px' }}>
            <Space>
                <Card
                    hoverable
                    onClick={()=>router.push("/")}
                    style={{ width: 196, color: 'white', height: '3.5em', overflow: 'hidden', position: 'relative', marginRight: '12px' }}
                >
                    <Icon
                        component={MoneyCacheLogo as React.FC<React.SVGProps<SVGSVGElement>> } 
                        style={{
                            fontSize: '10rem',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </Card>
            </Space>

            {/* Navigation Menu */}
            <Menu 
                mode="horizontal" 
                selectedKeys={[pathname]}
                style={{ flex: 1, minWidth: 0, background: 'transparent', color: 'white', borderBottom: "none" }}
                onClick={(e) => router.push(e.key)}
            >
                <Menu.Item key="/dashboard/attendance">Attendance</Menu.Item>
                <Menu.Item key="/dashboard/cashiers">Cashiers</Menu.Item>
            </Menu>
            <LogoutButton />
        </Header>
    </>
)}

export default Nav