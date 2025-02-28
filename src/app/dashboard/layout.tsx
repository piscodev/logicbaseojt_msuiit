'use client'

import React, { useState, useEffect } from "react";
import { Layout, ConfigProvider, Spin, Breadcrumb, Flex } from "antd";
import Nav from "../components/NavigationBar";
import { Content } from "antd/es/layout/layout";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const { Footer } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const [, setUser] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        const storedUser = localStorage.getItem("user");
        if (storedUser)
            setUser(JSON.parse(storedUser))

        setLoading(false);
    }, []);

    return (
        <>
            <AntdRegistry>
                <ConfigProvider>
                    <Nav />
                    {/* <Suspense
                        fallback={
                            // <Layout className="flex gap-6 justify-center mt-32">
                            <Flex align="center" gap="middle" className="flex gap-6 justify-center mt-32">
                                <Spin className="flex gap-6 justify-center mt-32" indicator={<LoadingOutlined style={{ fontSize: 46, marginTop: 46 }} spin />} />
                            </Flex>
                        }
                    > */}
                        <Layout>
                            <Content style={{ padding: "0 48px", margin: "16px 0" }}>
                                <Breadcrumb
                                    style={{ margin: "16px 0" }}
                                    items={[
                                        { title: "Root" },
                                        { title: "Page" },
                                        { title: "Current Page" },
                                    ]}
                                />
                                    {loading ?
                                        <Flex align="center" gap="middle" className="flex gap-6 justify-center mt-32">
                                            <Spin tip="Loading" size="large" />
                                        </Flex>
                                    : children}
                            </Content>
                        </Layout>
                    {/* </Suspense> */}
                </ConfigProvider>
                <Footer style={{ textAlign: "center" }}>
                    Baked with ❤️ by Generalao, Cagadas, Valdepeñas, Piscos <br />© {new Date().getFullYear()}
                </Footer>
            </AntdRegistry>
        </>
    )
}
