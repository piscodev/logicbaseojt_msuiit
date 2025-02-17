 
import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import PosForm from './components/PosForm';

const { Header, Content, Footer } = Layout;
const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Content style={{ padding: '0 48px', margin: '16px 0',}}>
        <Breadcrumb style={{margin: '16px 0',}}>
          <Breadcrumb.Item>Root</Breadcrumb.Item>
          <Breadcrumb.Item>Page</Breadcrumb.Item>
          <Breadcrumb.Item>Current Page</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <PosForm />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center'}}>
        Ant Design ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;