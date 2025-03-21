"use client";

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { User, useUserStore } from "@/stores/userStore";
import { Typography, notification, Card } from "antd"
import { useRouter } from "next/navigation";
const { Title } = Typography
type NotificationType = 'success' | 'info' | 'warning' | 'error';
export default function AuthPage() {
  const setUser = useUserStore((state) => state.setUser)
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const handleToggle = () => {
    setIsLogin((prev)=>!prev)
  }
  const responseHandler = (title:string, message:string, type:NotificationType) => {
    api[type]({
      message: title,
      description:
        message,
    });
  }
  const setData = (data: User) => {
    setUser(data)
    router.push("/dashboard");
  }

  return (
    <>
      {contextHolder}
      <Title level={2}>{isLogin?"Welcome Back!":"Create Your Account"}</Title>
      <Card
      variant="borderless"
      >
          {isLogin?<LoginForm change={handleToggle} responseMessage={responseHandler}/>:<SignUpForm change={handleToggle} responseMessage={responseHandler} setAdminData={setData}/>}
      </Card>
    </>
    
    
  );
}
