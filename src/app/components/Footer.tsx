'use client'

import React from 'react'
import { Layout } from 'antd'
const FooterComp = () =>
{
    return (
        <Layout.Footer style={{ textAlign: "center" }}>
            Baked with ❤️ by Generalao, Cagadas, Valdepeñas, Piscos <br />© {new Date().getFullYear()}
        </Layout.Footer>
    )
}

export default FooterComp
