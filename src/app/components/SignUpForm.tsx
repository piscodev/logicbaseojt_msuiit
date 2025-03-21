import React from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography
} from 'antd';

const { Option } = Select;
const { Text } = Typography;
interface SignUpData {
    first_name: string;
    last_name: string;
    password: string;
    confirm_password: string;
    email: string;
    address: string;
    age: number;
    contact_number: number;
    gender: 'Male' | 'Female' | 'Not specified';
    position: string;
    user_type: string;
    rate?: number
}


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
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
interface SignUpProps {
  user_type?: string,
  title?: string,
  change?: () => void
}
const SignUpForm: React.FC<SignUpProps> = ({user_type, change}) => {
  const [form] = Form.useForm();

  const handleSignUp = async(values: SignUpData) => {
    try{
      const response = await fetch('/api/auth/signup',{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values)
      })
      if(!response.ok){
        throw new Error("Error signing up");
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onFinish = (values: SignUpData) => {
    console.log('Received values of form: ', values);
    handleSignUp(values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      size='large'
      initialValues={{  
        user_type: user_type || "admin" 
      }}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Form.Item
        name="user_type"
        label="Role"
        
        noStyle
        rules={[{ required: true, message: 'Please select user type!' }]}
        >
          <Select 
          placeholder="Select user type"
          style={{visibility:'hidden'}}>
            <Option value="admin">Admin</Option>
            <Option value="cashier">Cashier</Option>
          </Select>
      </Form.Item>
      
      <Form.Item
      label="Name"
      >
        <Space.Compact>
          <Form.Item
          name="first_name"
          rules={[{
              required: true,
              message: 'Please input first name!',
            },
          ]}
          noStyle
          >
            <Input placeholder='First Name'/>
          </Form.Item>
          <Form.Item
          name="last_name"
          rules={[{
              required: true,
              message: 'Please input last name!',
            },
          ]}
          noStyle
          >
            <Input placeholder='Last Name'/>
          </Form.Item>
        </Space.Compact>
      </Form.Item>
      
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
        <Input />
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
            message: 'Password must be at least 6 characters long!'
          }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[
          { required: true, message: 'Please input your habitual residence!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="contact_number"
        label="Contact Number"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder='09' maxLength={11} minLength={10}/>
      </Form.Item>

      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: 'Please input your age!' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: 'Please select gender!' }]}
      >
        <Select placeholder="Not specified">
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>
      </Form.Item>

      {user_type==='cashier' && (<Form.Item
        name="rate"
        label="Rate"
        rules={[
          { required: true, message: 'Please input a rate per hour' },
        ]}
      >
        <InputNumber placeholder='e.g. 250' min={1} max={1000}/>
      </Form.Item>)}
      <Form.Item {...tailFormItemLayout}>
        <Space>
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
        {!user_type&&(<><Text>Already have an account?</Text>
        <Button type="link" size="middle" onClick={change}>
          Login
        </Button></>)}
        </Space>
      </Form.Item>
    </Form>
    // </Card>
  );
};

export default SignUpForm;