'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, Row, Space } from 'antd';

// const data = [
//   { title: "Sub Total Trade Pos", amount: "$78,987.00" },
//   { title: "Sub Total Non-Trade Pos", amount: "$23,000.00" },
//   { title: "Grand Total Pos", amount: "$28,s70.00" },
// ]

interface Test
{
  date: string
  data: [
    {
      t1: {
        particular: "SUB TOTAL TRADE POS"
        am: number
        mid: number
        pm: number
        gross_total: string
        net_total: string
      },
      t2: number,
      t3: {
        am: number
        mid: number
        pm: number
        gross_total: string
        net_total: string
      }
    }
  ]
}

// export default function StatsCard ({ params }: { params: any })
const StatsCard: React.FC = () =>
{
  const [loading, setLoading] = useState<boolean>(true)
  // const [totalsData, setTotalsData] = useState<Test>({
  //   date: '',
  //   data: [{
  //       t1: {
  //         particular: "SUB TOTAL TRADE POS",
  //         am: 0,
  //         mid: 0,
  //         pm: 0,
  //         gross_total: '',
  //         net_total: ''
  //       },
  //       t2: 0,
  //       t3: {
  //         am: 0,
  //         mid: 0,
  //         pm: 0,
  //         gross_total: '',
  //         net_total: ''
  //       }
  //   }]
  // })

  const [data, setData] = useState<{ title: string, amount: string | number }[]>([])

  // let data: { title: string, amount: string | number }[] = []

  const fetchTotals = async ()  =>
  {
    const response = await fetch(`/api/transactions/getTransactionTotals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: new Date() })
    })

    if (response.ok)
    {
      const res: Test = await response.json() as Test
      if (!res)
        return

      // setTotalsData(res)

      console.log(res)

      setData([
        { title: "Sub Total Trade Pos", amount: res.data[0].t1.gross_total },
        { title: "Sub Total Non-Trade Pos", amount: String(res.data[0].t2.toPrecision(2)) },
        { title: "Grand Total Pos", amount: res.data[0].t3.gross_total },
      ])
    }
  }

  useEffect(() =>
  {
      fetchTotals()
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