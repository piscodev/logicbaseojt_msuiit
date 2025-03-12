'use client'

import React from 'react';
import { Layout, Card, Space, Button } from 'antd';
import Icon from '@ant-design/icons'
import LogoutButton from './LogoutButton';
import MoneyCacheLogo from "./../../../public/file.svg"
import { useRouter } from 'next/navigation';

const { Header }  = Layout

const Nav: React.FC = () => {
    const router = useRouter();
    return (
    <>
        <Header style={{ display: "flex", alignItems: "center", justifyContent:'space-between', background: "#1669B2", height:'72px' }}>
            <Space>
            <Card
                hoverable
                onClick={()=>router.push("/")}
                style={{ width: 196, height: '3.5em', overflow: 'hidden', position: 'relative' }}
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
            <Button type='link' href='/dashboard/Cashiers'>Cashiers</Button>
            </Space>
            <LogoutButton />
        </Header>
    </>
)}

export default Nav;