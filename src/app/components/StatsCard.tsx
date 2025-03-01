'use client'

import React from 'react';
import { Avatar, Card, Col, Row, Space, Statistic } from 'antd';
import type { StatisticProps } from 'antd';
import CountUp from 'react-countup';
import Icon from '@ant-design/icons';
import Peso from "./../../../public/phillippine-peso-svgrepo-com.svg"


interface StatsCardProps {
  tradeAmount: number;
  nonTradeAmount: number;
  grandTotal: number;
  loading: boolean
}

const formatter: StatisticProps['formatter'] = (value) => {
  return (
      <CountUp start={0} delay={1} end={value as number} separator="," decimals={2} />
  );
} 
// export default function StatsCard ({ params }: { params: any })
const StatsCard: React.FC<StatsCardProps> = ({tradeAmount, nonTradeAmount, grandTotal, loading}) =>
{
  return (
    <Space  direction="vertical" className="w-full mb-3">
        <Row gutter={16} justify="center">
          <Col key='trade' span={8}>
            <Card loading={loading}>
              
                <Card.Meta
                    avatar={
                      <Icon component={Peso} style={{ fontSize: '66px' }} />
                    }
                    title={<p className="text-black">TRADE POS NET TOTAL</p>}
                    description={
                        <>
                          <Statistic title="" value={Number(tradeAmount)} precision={2} formatter={formatter} />
                        </>
                    }
                />
            </Card>
          </Col>
          <Col key='NO-trade' span={8}>
            <Card loading={loading}>
                <Card.Meta
                    avatar={
                      <Icon component={Peso} style={{ fontSize: '66px' }} />
                    }
                    title={<p className="text-black">NON TRADE POS NET TOTAL</p>}
                    description={
                        <>
                          <Statistic title="" value={Number(nonTradeAmount)} precision={2} formatter={formatter} />
                        </>
                    }
                />
            </Card>
          </Col>
          <Col key='trade' span={8}>
            <Card loading={loading}>
                <Card.Meta
                    avatar={
                      <Icon component={Peso} style={{ fontSize: '66px' }} />
                    }
                    title={<p className="text-black">GRAND POS TOTAL</p>}
                    description={
                        <>
                          <Statistic title="" value={Number(grandTotal)} precision={2} formatter={formatter} />
                        </>
                    }
                />
            </Card>
          </Col>
        </Row>
    </Space>
  )
}

export default StatsCard