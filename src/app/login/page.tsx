"use client";

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { Typography, Card } from "antd"
const { Title } = Typography
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const handleToggle = () => {
    setIsLogin((prev)=>!prev)
  }

  return (
    <>
      <Title level={2}>{isLogin?"Welcome Back!":"Create Your Account"}</Title>
      <Card
      variant="borderless"
      >
          {isLogin?<LoginForm change={handleToggle}/>:<SignUpForm change={handleToggle}/>}
      </Card>
    </>
    
    
  );
}
