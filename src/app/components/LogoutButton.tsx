"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dropdown, Button, Typography, Space, MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useUserStore } from "@/stores/userStore";

const { Text } = Typography;

export default function LogoutButton() {
  const router = useRouter();
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  // const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Retrieve user details from sessionStorage or localStorage
  //   const storedUser = sessionStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   } else {
  //     const name = localStorage.getItem("name");
  //     const email = localStorage.getItem("email");
  //     if (name && email) {
  //       setUser({ name, email });
  //     }
  //   }
  //   // setLoading(false);
  // }, []);

  const handleLogout = async () => {
    try {
      clearUser();

      router.replace("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // if(!user){
  //   router.push('/')
  // }

  // Display actual name and email
  const userName = user?.name || "Guest";
  const userEmail = user?.email || "No Email";

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
      <>
      <div //style={{ position: "absolute", top: 20, right: 20 }}
      >
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Button shape='circle' size='large' icon={<UserOutlined />} />
        </Dropdown>
      </div>
      </>
    )
  );
}
