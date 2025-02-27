'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, Row, Space } from 'antd';

const data = [
  { title: "Sub Total Trade Pos", amount: "$78,987.00" },
  { title: "Sub Total Non-Trade Pos", amount: "$23,000.00" },
  { title: "Grand Total Pos", amount: "$28,s70.00" },
]

const StatsCard: React.FC = () =>
{
  const [loading, setLoading] = useState<boolean>(true);

    useEffect(() =>
    {
        setLoading(false)
    }, [])

  return (
    <Space  direction="vertical" className="w-full mb-3">
        <Row gutter={16} justify="center">
            {data.map((item, index) => (
                <Col key={index} span={8}>
                    <Card loading={loading}>
                      {/* <div className="icon-container">
                        <DollarCircleOutlined className="icon" />
                      </div> */}
                        <Card.Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" size={75}/>}
                            title={<p className="text-black">{item.title}</p>}
                            description={
                                <>
                                  <p className="text-black font-bold">{item.amount}</p>
                                </>
                            }
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    </Space>
  )
}

export default StatsCard