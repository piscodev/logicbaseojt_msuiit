'use client'

import React from 'react';
import { Layout, Card } from 'antd';
import Icon from '@ant-design/icons'
import LogoutButton from './LogoutButton';
import MoneyCacheLogo from "./../../../public/file.svg"
import { useRouter } from 'next/navigation';

const { Header }  = Layout

// const items = [
//     { key: "1", label: "Home" },
//     { key: "2", label: "About" },
//     { key: "3", label: "Contact" }
// ]

const Nav: React.FC = () => {
    const router = useRouter();
    return (
    <>
        <Header style={{ display: "flex", alignItems: "center", background: "#1669B2" }}>
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
            {/* <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={items}
                style={{ flex: 1, background: "#1669B2" }}
            /> */}
        </Header>
        <LogoutButton />
    </>
)}

export default Nav;