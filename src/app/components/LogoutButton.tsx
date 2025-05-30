"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dropdown, Button, Typography, Space, MenuProps, Badge } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useUserStore } from "@/stores/userStore";
import { useCashierStore } from "@/stores/cashierStore";
import PushNotifications from "./notification/PushNotifications";
const { Text } = Typography;

export default function LogoutButton() {
  const router = useRouter();
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  const clearCashiers = useCashierStore((state)=>state.clearCashiers);
  const handleLogout = async () => {
    try {
      router.replace("/login"); // Redirect to login page

      const res = await fetch('/api/auth/logout', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user?.email),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearUser();
      clearCashiers();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  if(user===null){return null}
  
  // Display actual name and email
  const userName = user?.first_name + " " + user?.last_name|| "";
  const userEmail = user?.email || "";

  // Define dropdown menu items
  const menuItems: MenuProps["items"] = [
    {
      key: "info",
      label: (
        <Space direction="vertical" size={2}>
          <Text strong>{userName}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>{userEmail}</Text>
        </Space>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    user && (
      <div>
        <span className="p-3">
          <PushNotifications />
        </span>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          {/* <Button shape='circle' size='large' icon={<UserOutlined />} /> */}
          <Badge dot status={"success"} offset={[-3, 42]}>
            <Button shape='circle' size='large' icon={<UserOutlined />} />
            {/* <Avatar shape="circle" size="large" icon={<UserOutlined />}/> */}
          </Badge>
        </Dropdown>
      </div>
    )
  );
}
