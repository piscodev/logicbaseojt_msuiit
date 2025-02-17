import React, { useEffect } from "react";
import { Card, Row, Col, Form, InputNumber, Select, Button } from "antd";
import {usePosStore} from "../../../test/mc/src/store/store";

const { Option } = Select

const PosForm = () =>
{
    const {
        shift,
        cash,
        bpiCreditCard,
        metroCreditCard,
        payMaya,
        gcash,
        foodPanda,
        grabFood,
        tradePos,
        zReadingPos,
        shortOverPos,
        setShift,
        setCash,
        setBpiCreditCard,
        setMetroCreditCard,
        setPayMaya,
        setGcash,
        setFoodPanda,
        setGrabFood,
        setZReadingPos,
        calculateTotals,
    } = usePosStore()

    useEffect(() =>
    {
       calculateTotals()
    }, [cash, bpiCreditCard, metroCreditCard, payMaya, gcash, foodPanda, grabFood, zReadingPos])

    const handleSubmit = () =>
    {
        console.log("Submitted Data:",
        {
            shift,
            cash,
            bpiCreditCard,
            metroCreditCard,
            payMaya,
            gcash,
            foodPanda,
            grabFood,
            tradePos,
            zReadingPos,
            shortOverPos,
        })
    }

    return (
        <Form onFinish={handleSubmit} layout="vertical">
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Card title="Transaction Details">
                    {/* Inputs for Transactions */}
                    <Form.Item label="Cash" required>
                        <InputNumber
                            value={cash}
                            onChange={setCash}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item label="BPI Credit Card">
                        <InputNumber value={bpiCreditCard} onChange={setBpiCreditCard} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Metro Credit Card">
                        <InputNumber value={metroCreditCard} onChange={setMetroCreditCard} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="PayMaya">
                        <InputNumber value={payMaya} onChange={setPayMaya} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="GCash">
                        <InputNumber value={gcash} onChange={setGcash} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="FoodPanda">
                        <InputNumber value={foodPanda} onChange={setFoodPanda} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="GrabFood">
                        <InputNumber value={grabFood} onChange={setGrabFood} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Computed Fields */}
                    <Form.Item label="SUB TOTAL TRADE POS">
                        <InputNumber value={tradePos} disabled style={{ width: "100%", fontWeight: "bold" }} />
                    </Form.Item>

                    <Form.Item label="Z READING POS">
                        <InputNumber value={zReadingPos} onChange={setZReadingPos} min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="SHORT/OVER POS">
                        <InputNumber value={shortOverPos} disabled style={{ width: "100%", fontWeight: "bold" }} />
                    </Form.Item>

                    {/* Submit Button */}
                   <Form.Item style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                </Card>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                 <Card title="Shift">
                   {/* Shift Dropdown */}
                        <Form.Item label="Shift" required>
                           <Select value={shift} onChange={setShift} style={{ width: "100%" }} >
                             <Option value="AM">AM</Option>
                             <Option value="MID">MID</Option>
                             <Option value="PM">PM</Option>
                           </Select>
                       </Form.Item>
                    </Card>
                </Col>
            </Row>
    </Form>
    )
}

export default PosForm