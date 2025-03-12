'use client'

import React from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Content style={{ padding: "0 48px", margin: "16px 0" }}>
        {children}
      </Content>
    </Layout>
  );
}