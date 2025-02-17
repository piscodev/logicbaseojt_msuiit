import React, { useEffect } from "react";
import { Flex, Card, Row, Col, Form, Input, InputNumber, Select, Button, Typography } from "antd";
import {usePOSStore } from '../store/usePosStore'

const { Option } = Select;
const { Text } = Typography;

const PosForm = () =>
{
  const {
    shift,
    cname,
    cash,
    check,
    bpi_cCard,
    bpi_dCard,
    metro_cCard,
    metro_dCard,
    paymaya,
    aub_cCard,
    gcash,
    foodpanda,
    streetby,
    grabfood,
    gc_claimedOth,
    gc_claimedOwn,

    subTotalTradePOS,

    mm_head,
    mm_commi,
    mm_,
    mm_rm,
    mm_dm,
    mm_km,
    food_charge,
    grandTotalPOS,

    updateField,
    calculateTotals
  } = usePOSStore()

  const initValues =  [
    shift,
    cname,
    cash,
    check,
    bpi_cCard,
    bpi_dCard,
    metro_cCard,
    metro_dCard,
    paymaya,
    aub_cCard,
    gcash,
    foodpanda,
    streetby,
    grabfood,
    gc_claimedOth,
    gc_claimedOwn,

    subTotalTradePOS,

    mm_head,
    mm_commi,
    mm_,
    mm_rm,
    mm_dm,
    mm_km,
    food_charge,
  ]

  const AM =
  {
    cname: "Cherry",
    cash: 63608,
    check: 0,
    bpi_cCard: 5022,
    bpi_dCard: 0,
    metro_cCard: 0,
    metro_dCard: 0,
    paymaya: 16510.67,
    aub_cCard: 0,
    gcash: 3108,
    foodpanda: 0,
    streetby: 0,
    grabfood: 2759,
    gc_claimedOth: false,
    gc_claimedOwn: false,

    subTotalTradePOS: 88248.67,

    mm_head: 0,
    mm_commi: 0,
    mm_: 0,
    mm_rm: 0,
    mm_dm: 0,
    mm_km: 0,
    food_charge: 0
  }

  const MID =
  {
    cname: "",
    cash: 0,
    check: 0,
    bpi_cCard: 0,
    bpi_dCard: 0,
    metro_cCard: 0,
    metro_dCard: 0,
    paymaya: 0,
    aub_cCard: 0,
    gcash: 3108,
    foodpanda: 1520,
    streetby: 0,
    grabfood: 2759,
    gc_claimedOth: false,
    gc_claimedOwn: false,

    subTotalTradePOS: 4279,

    mm_head: 0,
    mm_commi: 0,
    mm_: 0,
    mm_rm: 0,
    mm_dm: 60,
    mm_km: 0,
    food_charge: 0
  }

  const PM =
  {
    cname: "Cherry",
    cash: 63608,
    check: 0,
    bpi_cCard: 5022,
    bpi_dCard: 0,
    metro_cCard: 0,
    metro_dCard: 0,
    paymaya: 16510.67,
    aub_cCard: 0,
    gcash: 3108,
    foodpanda: 0,
    streetby: 0,
    grabfood: 0,
    gc_claimedOth: false,
    gc_claimedOwn: false,
  }

  const particularsInName = [
    "shift", // 0
    "cname", // 1
    "cash", // 2
    "check", // 3
    "bpi_cCard",//  4
    "bpi_dCard",  // 5
    "metro_cCard", // 6
    "metro_dCard", // 7
    "paymaya", //  8
    "aub_cCard", // 9
    "gcash", // 10
    "foodpanda", // 11
    "streetby", // 12
    "grabfood", // 13
    "gc_claimedOth", // 14
    "gc_claimedOwn", // 15
    "ar1", // 16
    "ar2", // 17
  ]

  const particularsTitle = [
    "Cashier Name", // 1
    "CASH", // 2
    "CHECK", // 3
    "BPI CREDIT CARD",//  4
    "BPI DEBIT CARD",  // 5
    "METRO CREDIT CARD", // 6
    "METRO DEBIT CARD", // 7
    "PAY MAYA", //  8
    "AUB CREDIT CARD", // 9
    "GCASH", // 10
    "FOOD PANDA", // 11
    "STREETBY", // 12
    "GRAB FOOD", // 13
    "GC CLAIMED (OTHERS)", // 14
    "GC CLAIMED (OWN)", // 15
    "A/R_____", // 16
    "A/R_____", // 17
  ]

  const nonTradeItems = [
    "MM-HEAD OFFICE",
    "MM-COMMISSARY",
    "MM-RM",
    "MM-DM",
    "MM-KM",
    "FOOD CHARGE"
  ]

  const [form] = Form.useForm()

  const handleSubmit = () =>
  {
    const values = form.getFieldsValue()
    console.log("Submitted Data:", values)
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <Card title="Transaction Details">
            <Row>
              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[0]}>
                    <Input
                      disabled
                      maxLength={50}
                      value={cname}
                      onChange={(value) => updateField(particularsInName[1], value || "")}
                      rules={[{required:true}]}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[1]} name = {particularsTitle[1]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={cash}
                      onChange={(value) => updateField(particularsInName[2], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[2]} name = {particularsTitle[2]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={check}
                      onChange={(value) => updateField(particularsInName[3], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[3]} name = {particularsTitle[3]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={bpi_cCard}
                      onChange={(value) => updateField(particularsInName[4], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[4]} name = {particularsTitle[4]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={bpi_dCard}
                      onChange={(value) => updateField(particularsInName[5], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[5]} name = {particularsTitle[5]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={metro_cCard}
                      onChange={(value) => updateField(particularsInName[6], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[6]} name = {particularsTitle[6]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={metro_dCard}
                      onChange={(value) => updateField(particularsInName[7], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[7]} name = {particularsTitle[7]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={paymaya}
                      onChange={(value) => updateField(particularsInName[8], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[8]} name = {particularsTitle[8]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={aub_cCard}
                      onChange={(value) => updateField(particularsInName[9], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[9]} name = {particularsTitle[9]} rules={[{required:true}]}>
                    <InputNumber
                      
                      min={0}
                      maxLength={9}
                      value={gcash}
                      onChange={(value) => updateField(particularsInName[10], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[10]} name = {particularsTitle[10]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={foodpanda}
                      onChange={(value) => updateField(particularsInName[11], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[11]} name = {particularsTitle[11]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={streetby}
                      onChange={(value) => updateField(particularsInName[12], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[12]} name = {particularsInName[12]} rules={[{required:true}]}>
                    <InputNumber
                      min={0}
                      maxLength={9}
                      value={grabfood}
                      onChange={(value) => updateField(particularsInName[13], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[13]} name = {particularsTitle[13]}>
                    <Input
                      min={0}
                      maxLength={9}
                      value={gc_claimedOth}
                      onChange={(value) => updateField(particularsInName[14], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

              <Col span={8} style={{ padding: 5 }}>
                <Form.Item label={particularsTitle[14]} name = {particularsTitle[14]}>
                    <Input
                      min={0}
                      maxLength={12}
                      value={gc_claimedOwn}
                      onChange={(value) => updateField(particularsInName[15], value || 0)}
                      style={{ width: "100%" }}
                    />
                </Form.Item>
              </Col>

            </Row>
          </Card>
          {/* Submit Button */}
           <Form.Item style={{ textAlign: "right", marginTop: 10 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
           </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Card title="Shift Time">
                <Form.Item label="Shift" name="Shift" rules={[{required:true}]}>
                    <Select placeholder="Select Shift">
                      <Option value="AM">AM</Option>
                      <Option value="MID">MID</Option>
                      <Option value="PM">PM</Option>
                    </Select>
                </Form.Item>
              </Card>
              <Card title="Summary" style={{ marginTop: 16 }}>
                SUB TOTAL TRADE POS:
                <div style={{ marginBottom: 10 }}> ₱ <Text strong>{parseFloat(subTotalTradePOS).toLocaleString()}</Text> </div>
                GRAND TOTAL POS:
                <div style={{ marginTop: 10 }}> ₱ <Text strong>{parseFloat(grandTotalPOS).toLocaleString()}</Text> </div>
              </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default PosForm;