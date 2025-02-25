import React, { useRef, useState, useEffect } from 'react';
import type { AutoCompleteProps, StatisticProps, InputNumberProps } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, AutoComplete, Divider, Form, Input, Button, Space, Select, Checkbox, Tooltip, Typography, Row, Col, Statistic, InputNumber } from 'antd';
import useTransactionStore from '@/stores/useTransactionStore';
import CountUp from 'react-countup';
import { TransactionValuesState } from '../lib/Interface/route';
export const dynamic = 'force-dynamic';
interface Cashier{
    value: string
}
const TransactionForm = () => {
    const [form] = Form.useForm();
    const [isMounted, setIsMounted] = useState(false);
    const [cashiers, setCashiers] = useState<AutoCompleteProps['options']>([]);
    const fetchCashiers = async() => {
        try{
            const response = await fetch(`/api/getCashiers`, {
                method:"GET"
            });
            if(!response.ok) throw new Error('Failed to fetch cashiers');
            const data = await response.json();
            const cashierNames = data.cashiers.map((cashier:Cashier) => ({
                ...cashier,
                value: cashier.value
            }))
            
            setCashiers(cashierNames)
        }catch(error){
            console.error('Error fetching users: ', error);
        }
    };
    useEffect(() => {
        if (!isMounted) {
          setIsMounted(true);
          fetchCashiers();
          return;
        }
      }, [isMounted]);
    
    
    const prevValueSubTotalTradePosRef = useRef<number | 0>(0)
    const prevValueSubTotalNonTradePosRef = useRef<number | 0>(0)
    const formatter_subTotalTradePos: StatisticProps['formatter'] = (value) => {
        const startValue = prevValueSubTotalTradePosRef.current;

        
        return (
        
            <CountUp start={startValue as number} delay={1} end={value as number} separator="," decimals={2}
            onEnd={ () => {prevValueSubTotalTradePosRef.current = value as number;}}
            />
        );
    } 
    const formatter_subTotalNonTradePos: StatisticProps['formatter'] = (value) => {
        const startValue = prevValueSubTotalNonTradePosRef.current;
        
        return(
        <CountUp start={startValue as number} delay={1} end={value as number} separator="," decimals={2} onEnd={ () => {
            prevValueSubTotalTradePosRef.current = value as number; }}/>
    );}
      const onChange: InputNumberProps['onChange'] = (value) => {
        console.log('changed', value);
    };
    const watchResult = Form.useWatch((values) => {
    let subTotalTrade : number = prevValueSubTotalTradePosRef.current;
    let subTotalNonTrade : number = prevValueSubTotalNonTradePosRef.current;
    let isCash : boolean = false;
    let isCheck: boolean = false;
    let isBpi_cc: boolean = false;
    let isBpi_dc: boolean = false;
    let isMetro_cc: boolean = false;
    let isMetro_dc: boolean = false;
    let isPaymaya: boolean = false;
    let isAub_cc: boolean = false;
    let isGcash: boolean = false;
    let isFoodpanda: boolean = false;
    let isStreetby: boolean = false;
    let isGrabfood: boolean = false;
    let isMMHO : boolean = false;
    let isMMCom : boolean = false;
    let isMMRM : boolean = false;
    let isMMDM : boolean = false;
    let isMMKM : boolean = false;
    let isMM__ : boolean = false;
    let isFoodCharges : boolean = false;
    // let gc_claimed_oth: boolean
    // let gc_claimed_own: boolean
    // console.log('cashier_name: ',values.cashier_name)
    // console.log('shift: ',values.shift)
    // console.log('payment: ',values._payment)
    if(values?._payment === 'CASH') isCash = true
    else if(values?._payment === 'CHECK') isCheck = true
    else if(values?._payment === 'BPI CREDIT CARD') isBpi_cc = true
    else if(values?._payment === 'BPI DEBIT CARD') isBpi_dc = true
    else if(values?._payment === 'METRO CREDIT CARD') isMetro_cc = true
    else if(values?._payment === 'METRO DEBIT CARD') isMetro_dc = true
    else if(values?._payment === 'PAY MAYA') isPaymaya = true
    else if(values?._payment === 'AUB CREDIT CARD') isAub_cc = true
    else if(values?._payment === 'GCASH') isGcash = true
    else if(values?._payment === 'FOOD PANDA') isFoodpanda = true
    else if(values?._payment === 'STREETBY') isStreetby = true
    else if(values?._payment === 'GRAB FOOD') isGrabfood = true

    if(values?._expense === 'MM-HEAD OFFICE') isMMHO = true
    else if(values?._expense === 'MM-COMMISARY') isMMCom = true
    else if(values?._expense === 'MM-RM') isMMRM = true
    else if(values?._expense === 'MM-DM') isMMDM = true
    else if(values?._expense === 'MM-KM') isMMKM = true
    else if(values?._expense === 'MM-___') isMM__ = true
    else if(values?._expense === 'FOOD CHARGES') isFoodCharges = true
    // console.log('payment_amount: ',values._payment_amount)
    if(values?._payment_amount !== undefined)
        subTotalTrade += parseFloat(values._payment_amount)
    if(values.other_payments !== undefined)
        for(let i=0; i<values.other_payments.length; i++){
            // console.log('payment: ',values.other_payments[i]?.payment)
            if(values.other_payments[i]?.payment === 'CASH') isCash = true
            else if(values.other_payments[i]?.payment === 'CHECK') isCheck = true
            else if(values.other_payments[i]?.payment === 'BPI CREDIT CARD') isBpi_cc = true
            else if(values.other_payments[i]?.payment === 'BPI DEBIT CARD') isBpi_dc = true
            else if(values.other_payments[i]?.payment === 'METRO CREDIT CARD') isMetro_cc = true
            else if(values.other_payments[i]?.payment === 'METRO DEBIT CARD') isMetro_dc = true
            else if(values.other_payments[i]?.payment === 'PAY MAYA') isPaymaya = true
            else if(values.other_payments[i]?.payment === 'AUB CREDIT CARD') isAub_cc = true
            else if(values.other_payments[i]?.payment === 'GCASH') isGcash = true
            else if(values.other_payments[i]?.payment === 'FOOD PANDA') isFoodpanda = true
            else if(values.other_payments[i]?.payment === 'STREETBY') isStreetby = true
            else if(values.other_payments[i]?.payment === 'GRAB FOOD') isGrabfood = true

            if(values.other_payments[i]?.payment_amount !== undefined)
            subTotalTrade += parseFloat(values.other_payments[i]?.payment_amount)
        }
    if(values.other_expenses !== undefined)
        for(let i = 0; i<values.other_expenses.length; i++){
            if(values.other_expenses[i]?.payment === 'MM-HEAD OFFICE') isMMHO = true
            else if(values.other_expenses[i]?.payment === 'MM-COMMISARY') isMMCom = true
            else if(values.other_expenses[i]?.payment === 'MM-RM') isMMRM = true
            else if(values.other_expenses[i]?.payment === 'MM-DM') isMMDM = true
            else if(values.other_expenses[i]?.payment === 'MM-KM') isMMKM = true
            else if(values.other_expenses[i]?.payment === 'MM-___') isMM__ = true
            else if(values.other_expenses[i]?.payment === 'FOOD CHARGES') isFoodCharges = true
            if(values.other_expenses[i]?.payment_amount !== undefined)
                subTotalNonTrade += parseFloat(values.other_expenses[i]?.payment_amount)

        }
    if(values?._expense !== undefined)
        subTotalNonTrade += parseFloat(values._expense_amount)
    return { isMMHO, isMMCom, isMMRM, isMMDM, isMMKM, isMM__, isFoodCharges,
        isCash, isCheck, isBpi_cc, isBpi_dc, isMetro_cc, isMetro_dc, isPaymaya, isAub_cc, isGcash, isFoodpanda, isStreetby, isGrabfood, subTotalTrade, subTotalNonTrade };

  }, form);
    const { 
        isMMHO = false, isMMCom = false, isMMRM = false, isMMDM = false, isMMKM = false, isMM__ = false, isFoodCharges = false,
        isCash = false, isCheck = false, isBpi_cc = false, isBpi_dc = false, isMetro_cc = false, isMetro_dc = false, isPaymaya = false, isAub_cc = false, isGcash = false, isFoodpanda = false, isStreetby = false, isGrabfood = false, subTotalTrade = 0, subTotalNonTrade = 0} = watchResult || {}
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [isFilled, setIsFilled] = useState(true);
    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const finalValues = useTransactionStore((state) => state.finalValues);
    // const [paymentFieldCount, setPaymentFieldCount] = useState(1);
    interface TransactionFormValues {
        cashier_name: string;
        shift: string;
        _payment: string;
        _payment_amount: number;
        other_payments?: { payment: string; payment_amount: string }[];
        _expense?: string;
        _expense_amount?: number;
        other_expenses?: { payment: string; payment_amount: string }[];
    }

    const onFinish = async(values: TransactionFormValues) => {
        addTransaction(values);
        
        const data : TransactionValuesState = finalValues() as TransactionValuesState;
        try{
            const response = await fetch(`/api/addTransaction`, {
               method: 'POST',
               headers: {
                'Content-Type': 'application/json',
               },
               body: JSON.stringify(data)
            });
            if(!response.ok){
                throw new Error('Failed to add transaction');
            }
            console.log('Transaction added succcessfully');
        } catch (error){
            console.error('Error adding transaction: ', error);
        }
        // Reset the form fields
        form.resetFields();
    };

    return (
        <Form
        name="transaction_form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
            '_payment': "CASH",
            '_expense': "FOOD CHARGES"
        }}
        style={{ maxWidth: 400 }} // optional styling
        autoComplete="off"
        >   
            <Space  size={50} style={{ display: 'flex', marginBottom: 8 }} align='baseline' >
                <Form.Item
                label="Cashier Name"
                name="cashier_name"
                rules={[{ required: true, message: 'Please input the cashier name!' }]}
                >
                    {/* <Input placeholder="e.g. Cherry" /> */}
                    <AutoComplete
                        options={cashiers}
                        // style={{ width: 200 }}
                        // onSelect={onSelect}
                        // onSearch={(text) => setOptions(getPanelValue(text))}
                        placeholder="e.g. Cherry"
                    />
                    {/* <SelectFetch/> */}
                </Form.Item>
                <Form.Item
                label="Shift"
                name="shift"
                rules={[{ required: true, message: 'Please select a shift time!' }]}
                >
                    <Select placeholder="Select Shift">
                        <Select.Option value="AM">AM</Select.Option>
                        <Select.Option value="MID">MID</Select.Option>
                        <Select.Option value="PM">PM</Select.Option>
                    </Select>
                    
                </Form.Item>
            </Space>
            <Form.Item
            label="Payments"
            rules={[{ required: true, message: 'Please select a payment category!' }]}
            >
                <Space.Compact style={{ display: 'flex'}} >
                    <Form.Item
                    name={'_payment'}
                    rules={[{ required: true, message: 'Missing payment category' }]}
                    style={{ width: '80%'}}
                    >
                        <Select placeholder="Select Category" >
                            {!isCash && (<Select.Option value="CASH">CASH</Select.Option>)}
                            {!isCheck && (<Select.Option value="CHECK">CHECK</Select.Option>)}
                            {!isBpi_cc && (<Select.Option value="BPI CREDIT CARD">BPI CREDIT CARD</Select.Option>)}
                            {!isBpi_dc && (<Select.Option value="BPI DEBIT CARD">BPI DEBIT CARD</Select.Option>)}
                            {!isMetro_cc && (<Select.Option value="METRO CREDIT CARD">METRO CREDIT CARD</Select.Option>)}
                            {!isMetro_dc && (<Select.Option value="METRO DEBIT CARD">METRO DEBIT CARD</Select.Option>)}
                            {!isAub_cc && (<Select.Option value="AUB CREDIT CARD">AUB CREDIT CARD</Select.Option>)}
                            {!isPaymaya && (<Select.Option value="PAY MAYA">PAY MAYA</Select.Option>)}
                            {!isGcash && (<Select.Option value="GCASH">GCASH</Select.Option>)}
                            {!isFoodpanda && (<Select.Option value="FOOD PANDA">FOOD PANDA</Select.Option>)}
                            {!isStreetby && (<Select.Option value="STREETBY">STREETBY</Select.Option>)}
                            {!isGrabfood && (<Select.Option value="GRAB FOOD">GRAB FOOD</Select.Option>)}
                            {/* {!isGCClaimedSelected && (<Select.Option value="GC Claimed">GC Claimed</Select.Option>)} */}
                        </Select>
                    </Form.Item>
                    <Form.Item
                    name={'_payment_amount'}
                    rules={[{ required: true, message: 'Missing payment amount' }]}
                    >   
                        <InputNumber style={{ width: 'auto'}}placeholder="Enter amount" min={0} max={1000000000} onChange={onChange} changeOnWheel />
                        {/* <Input placeholder="Enter amount" /> */}
                    </Form.Item>
                    
                </Space.Compact>
                <Form.List name="other_payments">
                {(fields, { add, remove }) => (
                    <>    
                    {fields.map(({ key, name, ...restField }) => (
                        <Space.Compact key={key} style={{ display: 'flex', marginBottom: 8 }}>
                        <Form.Item
                            {...restField}
                            name={[name, 'payment']}
                            rules={[{ required: true, message: 'Missing payment category' }]}
                            style={{ width: '40%'}}
                        >
                    
                            <Select placeholder="Select Category">
                                {!isCash && (<Select.Option value="CASH">CASH</Select.Option>)}
                                {!isCheck && (<Select.Option value="CHECK">CHECK</Select.Option>)}
                                {!isBpi_cc && (<Select.Option value="BPI CREDIT CARD">BPI CREDIT CARD</Select.Option>)}
                                {!isBpi_dc && (<Select.Option value="BPI DEBIT CARD">BPI DEBIT CARD</Select.Option>)}
                                {!isMetro_cc && (<Select.Option value="METRO CREDIT CARD">METRO CREDIT CARD</Select.Option>)}
                                {!isMetro_dc && (<Select.Option value="METRO DEBIT CARD">METRO DEBIT CARD</Select.Option>)}
                                {!isAub_cc && (<Select.Option value="AUB CREDIT CARD">AUB CREDIT CARD</Select.Option>)}
                                {!isPaymaya && (<Select.Option value="PAY MAYA">PAY MAYA</Select.Option>)}
                                {!isGcash && (<Select.Option value="GCASH">GCASH</Select.Option>)}
                                {!isFoodpanda && (<Select.Option value="FOOD PANDA">FOOD PANDA</Select.Option>)}
                                {!isStreetby && (<Select.Option value="STREETBY">STREETBY</Select.Option>)}
                                {!isGrabfood && (<Select.Option value="GRAB FOOD">GRAB FOOD</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'payment_amount']}
                            rules={[{ required: true, message: 'Missing payment amount' }]}
                            style={{ width: '55%'}}
                        >
                            <InputNumber style={{ width: 'auto'}}placeholder="Enter amount" min={0} max={1000000000} onChange={onChange} changeOnWheel />
                        </Form.Item>
                        <Button icon={<MinusCircleOutlined /> }  onClick={() => {
                            // setPaymentFieldCount((count) => count-1);
                            // setAvailableOptions("", form.getFieldValue(), fields.length)
                            remove(name); }} />
                        {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                        </Space.Compact>
                    ))}
                    {(!isCash || !isCheck || !isBpi_cc || !isBpi_dc || !isMetro_cc || !isAub_cc || !isAub_cc || !isPaymaya || !isGcash || !isFoodpanda || !isStreetby || !isGrabfood ) && (<Form.Item>
                        <Button style={{color:'GrayText'}} type="dashed" onClick={() => {
                            const lastField = fields[fields.length-1];
                            
                            // console.log(`field length: ${fields.length}`)
                            const values = form.getFieldsValue();
                            if (fields.length === 0 ) {
                                if (fields.length == 0 && form.getFieldValue(['_payment']) !== undefined && form.getFieldValue(['_payment_amount']) !== undefined) {
                                    setIsFilled(true);
                                    // setPaymentFieldCount((count) => count+1);
                                    add();
                                } else {
                                    setIsFilled(false)
                                }
                            } else if (fields.length > 0 ){
                                if(!values.other_payments[lastField.name]?.payment === undefined || values.other_payments[lastField.name]?.payment_amount === undefined){
                                    setIsFilled(false)
                                } else {
                                    
                                    const lastPaymentMethod = JSON.stringify(values.other_payments[lastField.name].payment);
                                    const lastPaymentAmount = JSON.stringify(values.other_payments[lastField.name].payment_amount);
                                    if(lastPaymentMethod !== undefined && lastPaymentAmount !== undefined && fields.length >= 1){
                                        setIsFilled(true);
                                        // setPaymentFieldCount((count) => count+1);
                                        add();
                                    } else {
                                        setIsFilled(false)
                                    }
                                }
                                
                            }
                        }
                    } block icon={<PlusOutlined />}>
                    Add Other Payment Category
                    </Button>
                    {!isFilled && (
                        <Alert message="Please fill in the previous field!" type="error" showIcon style={{marginTop:"16px"}}/>)}
                </Form.Item>)}
                </>
            )}
            </Form.List>
            <Row gutter={16}>
                <Col span={16}>
                    <Statistic title="SUB TOTAL TRADE POS" value={subTotalTrade} precision={2} formatter={formatter_subTotalTradePos} />
                </Col>
            </Row>
        </Form.Item>
        
      
        <Form.Item>
            <Checkbox 
            checked={componentDisabled}
            onChange={(e) => setComponentDisabled(e.target.checked)}
            >
            Internal Expenses (Non-Trade POS)
            </Checkbox>
            <Tooltip title={`MM-HEAD OFFICE refers to any sales or charges that go directly to a "head office account". MM-COMMISSARY refers to purchases or reimbursements from the company (central kitchen).`}>
                <Typography.Link href="#API">What is this?</Typography.Link>
            </Tooltip>
        </Form.Item>
        { componentDisabled && (
            <>
            <Form.Item
            label="Internal Expenses"
            rules={[{ required: true, message: 'Please select a payment category!' }]}
            >
                <Space.Compact style={{ display: 'flex'}} >   
                    <Form.Item
                    name={'_expense'}
                    rules={[{ required: true, message: 'Missing category' }]}
                    style={{ width: '40%'}}
                    >
                        <Select placeholder="Select Category">
                            {!isMMHO && (<Select.Option value="MM-HEAD OFFICE" name="expense_category_MM-HEAD-OFFICE">MM-HEAD OFFICE</Select.Option>)}
                            {!isMMCom &&(<Select.Option value="MM-COMMISARY" name= "expense_category_MM-COMMISARY">MM-COMMISARY</Select.Option>)}
                            {!isMMRM &&(<Select.Option value="MM-RM" name= "expense_category_MM-RM">MM-RM</Select.Option>)}
                            {!isMMDM &&(<Select.Option value="MM-DM" name= "expense_category_MM-DM">MM-DM</Select.Option>)}
                            {!isMMKM &&(<Select.Option value="MM-KM" name= "expense_category_MM-KM">MM-KM</Select.Option>)}
                            {!isMM__ &&(<Select.Option value="MM-___" name= "expense_category_MM-___">MM-___</Select.Option>)}
                            {!isFoodCharges &&(<Select.Option value="FOOD CHARGES" name= "expense_categor_food_charges">FOOD CHARGES</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                    name={'_expense_amount'}
                    rules={[{ required: true, message: 'Missing expense amount' }]}
                    style={{ width: '60%'}}
                    >
                        <Input placeholder="Enter amount" />
                    </Form.Item>    
                </Space.Compact>
                <Form.List name="other_expenses">
                {(fields, { add, remove }) => (
                    <>    
                    {fields.map(({ key, name, ...restField }) => (
                        <Space.Compact key={key} style={{ display: 'flex', marginBottom: 8 }}>
                        <Form.Item
                            {...restField}
                            name={[name, 'payment']}
                            rules={[{ required: true, message: 'Missing category' }]}
                            style={{ width: '40%'}}
                        >
                    
                            <Select placeholder="Select Category">
                                {!isMMHO && (<Select.Option value="MM-HEAD OFFICE" name="expense_category_MM-HEAD-OFFICE">MM-HEAD OFFICE</Select.Option>)}
                                {!isMMCom &&(<Select.Option value="MM-COMMISARY" name= "expense_category_MM-COMMISARY">MM-COMMISARY</Select.Option>)}
                                {!isMMRM &&(<Select.Option value="MM-RM" name= "expense_category_MM-RM">MM-RM</Select.Option>)}
                                {!isMMDM &&(<Select.Option value="MM-DM" name= "expense_category_MM-DM">MM-DM</Select.Option>)}
                                {!isMMKM &&(<Select.Option value="MM-KM" name= "expense_category_MM-KM">MM-KM</Select.Option>)}
                                {!isMM__ &&(<Select.Option value="MM-___" name= "expense_category_MM-___">MM-___</Select.Option>)}
                                {!isFoodCharges &&(<Select.Option value="FOOD CHARGES" name= "expense_categor_food_charges">FOOD CHARGES</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'payment_amount']}
                            rules={[{ required: true, message: 'Missing payment amount' }]}
                            style={{ width: '55%'}}
                        >
                            <Input placeholder="Enter amount" />
                        </Form.Item>
                        <Button icon={<MinusCircleOutlined /> }  onClick={() => remove(name)} />
                        {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                        </Space.Compact>
                    ))}
                    {(!isMMHO || !isMMCom || !isMMRM || !isMMDM || !isMMKM || !isMM__ || !isFoodCharges) &&(<Form.Item>
                        <Button style={{color:'GrayText'}} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add More
                        </Button>
                    </Form.Item>)}
                    <Row gutter={16}>
                        <Col span={16}>
                            <Statistic title="SUB TOTAL NON-TRADE POS" value={subTotalNonTrade} precision={2} formatter={formatter_subTotalNonTradePos} />
                        </Col>
                    </Row>
                    </>
                )}
                </Form.List>
                
            </Form.Item>
            </>
        )}

        <Form.Item>
            <Button type="primary" htmlType="submit">
            Add Transaction
            </Button>
        </Form.Item>
        <Divider orientationMargin={'48'}>Summary</Divider>
        <Row gutter={16}>
            <Col span={12}>
                <Statistic title="GROSS TOTAL" value={subTotalNonTrade} precision={2} formatter={formatter_subTotalNonTradePos} />
            </Col>
            <Col span={12}>
                <Statistic title="NET TOTAL POS" value={subTotalNonTrade} precision={2} formatter={formatter_subTotalNonTradePos} />
            </Col>
            
        </Row>
        <Row>
            <Col span={16}>
                <Statistic title="GRAND TOTAL POS" value={subTotalNonTrade} precision={2} formatter={formatter_subTotalNonTradePos} />
            </Col>
        </Row>
        </Form>
    
    );
};

export default TransactionForm;