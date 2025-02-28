'use client'

import React, { useState, useEffect } from "react";
import { Layout, Spin, Breadcrumb, Flex } from "antd";
import { Content } from "antd/es/layout/layout";
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
        </>
    )
}
