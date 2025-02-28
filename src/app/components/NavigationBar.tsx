import React from 'react';
import { Layout, Menu } from 'antd';
import LogoutButton from './LogoutButton';
const { Header }  = Layout

const items = [
    { key: "1", label: "Home" },
    { key: "2", label: "About" },
    { key: "3", label: "Contact" }
]

const Nav: React.FC = () => (
    <>
        <Header style={{ display: "flex", alignItems: "center", background: "#3FA3DA" }}>
            <div style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold", marginRight: 20 }}>
                MoneyCacheHub
            </div>
            <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={items}
                style={{ flex: 1, color: '#FFF', background: "#3FA3DA" }}
            />
        </Header>
        <LogoutButton />
    </>
)

export default Nav;