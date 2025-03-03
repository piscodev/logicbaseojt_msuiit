'use client'

import React from 'react';
import { Card, Col, Row, Space, Statistic } from 'antd';
import type { StatisticProps } from 'antd';
import CountUp from 'react-countup';
import Icon from '@ant-design/icons';
import Peso from "./../../../public/phillippine-peso-svgrepo-com.svg"
import { useStatsStore } from '@/stores/statsStore';

// interface StatsCardProps {
//   tradeAmount: number;
//   nonTradeAmount: number;
//   grandTotal: number;
//   loading: boolean
// }

const formatter: StatisticProps['formatter'] = (value) => {
  return (
      <CountUp start={0} delay={1} end={value as number} separator="," decimals={2} />
  );
} 
// export default function StatsCard ({ params }: { params: any })
const StatsCard: React.FC = () =>
{
  const { net_total_trade,net_total_non_trade, grand_total_pos, fetching } = useStatsStore();
  return (
    <Space  direction="vertical" className="w-full mb-3">
        <Row gutter={16} justify="center">
          <Col key='trade' span={8}>
            <Card loading={fetching}>
              
                <Card.Meta
                    avatar={
                      <Icon component={Peso as React.FC<React.SVGProps<SVGSVGElement>>} style={{ fontSize: '66px' }} />
                    }
                    title={<p className="text-black">TRADE POS NET TOTAL</p>}
                    description={
                        <>
                          <Statistic title="" value={Number(net_total_trade)} precision={2} formatter={formatter} />
                        </>
                    }
                />
            </Card>
          </Col>
          <Col key='NO-trade' span={8}>
            <Card loading={fetching}>
                <Card.Meta
                    avatar={
                      <Icon component={Peso as React.FC<React.SVGProps<SVGSVGElement>>} style={{ fontSize: '66px' }} />
                    }
                    title={<p className="text-black">NON TRADE POS NET TOTAL</p>}
                    description={
                        <>
                          <Statistic title="" value={Number(net_total_non_trade)} precision={2} formatter={formatter} />
                        </>
                    }
                />
            </Card>
          </Col>
          <Col key='trade' span={8}>
            <Card loading={fetching}>
                <Card.Meta
                    avatar={
                      <Icon component={Peso as React.FC<React.SVGProps<SVGSVGElement>>} style={{ fontSize: '66px' }} />
                    }
                    title={<p className="text-black">GRAND POS TOTAL</p>}
                    description={
                        <>
                          <Statistic title="" value={Number(grand_total_pos)} precision={2} formatter={formatter} />
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