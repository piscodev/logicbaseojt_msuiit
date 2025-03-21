import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import {
    Button,
    Form,
    Input,
    Typography,
    Space,
} from 'antd';

const { Text } = Typography
type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface SignUpData {
    first_name?: string;
    last_name?: string;
    password: string;
    email: string;
}


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
interface FormProps {
    change: () => void
    responseMessage : (title:string, message:string, type:NotificationType) => void
}
const LoginForm: React.FC<FormProps> = ({change, responseMessage}) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();

  if(user)
    router.push("/dashboard");
  const [form] = Form.useForm();

  const handleLogin = async(values: SignUpData) => {
    try{
        setLoading(true);
        const response = await fetch('/api/auth/login',{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values)
        })
        const data = await response.json();
        if(!response.ok){
            responseMessage(data.title, data.error, 'error')
            throw new Error(data.error);
        }
        responseMessage(data.title, data.message, 'success')
        if(data)
        setUser({ user_id: data.user_id, first_name: data.first_name, last_name:data.last_name, contact_number: data.contact_number ,email: data.email, user_type: data.user_type, age: data.age })
        router.push("/dashboard");
        return
    } catch (error) {
       
      console.log(error)
    }
  };

  const onFinish = (values: SignUpData) => {
    console.log('Received values of form: ', values);
    handleLogin(values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="login"
      size='large'
      onFinish={onFinish}
      initialValues={{ 
        user_type:"admin" 
      }}
      style={{ maxWidth: 600, paddingTop:"36px" }}
      scrollToFirstError
    >

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder='Enter your email'/>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
          {
            min: 6,
            message: 'Password is at least 6 characters long!'
          }
        ]}
        hasFeedback
      >
        <Input.Password placeholder='Enter your password'/>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Space>
        <Button type="primary" htmlType="submit" loading={loading}>
          {loading?"Logging in":"Log in"}
        </Button>
        <Text>Don&apos;t have an account?
            <Button type='link' onClick={change} size="middle">
                Sign up
            </Button>
        </Text>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;