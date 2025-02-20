import React, {useMemo, useRef, useState, useCallback} from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Form, Input, InputNumber, Button, Space, Select, Checkbox, Tooltip, Typography, Row, Col, Statistic, Spin } from 'antd';
import useTransactionStore from '../store/useTransactionStore';
import CountUp from 'react-countup';
import debounce from 'lodash/debounce';

const formatter = (value) => <CountUp end={value} separator="," decimals='2' />;
async function fetchUserList(username) {
    console.log('fetching user', username);
    /** 
     * TEMPORARY HARD CODED DETCH IMPLEMENTATION.
     * REPLACE WITH ACTUAL API FETCH TO DATABASE
     * **/
    const cashiers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe'  },
        { id: 3, name: 'Bob Smith'  },
        { id: 4, name: 'Alice Johnson' },
        { id: 5, name: 'Mike Williams' },
        { id: 6, name: 'Will Smith'  },
        { id: 7, name: 'Marie Curry' },
        { id: 8, name: 'Stephen Carlson' },
        // add more cashiers here...
    ];
    const data = {results: cashiers.slice(0, parseInt(5, 10))};
    return  data.results.map((cashier) => ({
              label: `${cashier.name}`,
              value: cashier.name,
            }));
    // return fetch('http://localhost:5173/api/getCashiers?results=5')//get cashiers then slice and return only 5
    //   .then((response) => {
    //     if(!response.ok){
    //         throw new Error(`HTTP error! status: ${response.status}`)
    //     }
    //     return response.json()})
    //   .then((body) =>
    //     body.results.map((cashier) => ({
    //       label: `${cashier.name}`,
    //       value: cashier.name,
    //     })),
    //   );
  }
function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
    );
  }

const SelectFetch = () => {
    const [value, setValue] = useState([]);
  return (
    <DebounceSelect
      mode="multiple"
      maxCount='1'
      value={value}
      placeholder="Select users"
      fetchOptions={fetchUserList}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      style={{
        width: '100%',
      }}
    />
  );
};

const onFinish = (values) => {
    console.log('Received values of form:', values);
};

const { Option } = Select;
const getAvailableOptions = (fields, currentName) => {
    const usedOptions = fields
      .filter((field) => field.name !== currentName)
      .map((field) => form.getFieldValue([field.name, 'payment']));
    const allOptions = [
      'CASH',
      'CHECK',
      'BPI CREDIT CARD',
      'BPI DEBIT CARD',
      'BDO DEBIT CARD',
      'METRO CREDIT CARD',
      'AUB CREDIT CARD',
      'PAY MAYA',
      'GCASH',
      'FOOD PANDA',
      'SHOPEE FOOD',
      'GRAB FOOD',
      'GC CLAIMED',
    ];
    return allOptions.filter((option) => !usedOptions.includes(option)).map((option) => (
      <Select.Option value={option}>{option}</Select.Option>
    ));
  };

const TransactionForm = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(true);
  const [isFilled, setIsFilled] = useState(true);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const [grossAmount, setGrossAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [paymentField, setPaymentField] = useState(0);
  const [paymentFieldCount, setPaymentFieldCount] = useState(1);
//   const [paymentCategories, setPaymentCategories] = useState([]);
  const [isCashSelected, setCashSelected] = useState(true);
  const [isCheckSelected, setCheckSelected] = useState(false);
  const [isBPICCSelected, setBPICCSelected] = useState(false);
  const [isBPIDCSelected, setBPIDCSelected] = useState(false);
  const [isBDODCSelected, setBDODCSelected] = useState(false);
  const [isMetroCCSelected, setMetroCCSelected] = useState(false);
  const [isAUBCCSelected, setAUBCCSelected] = useState(false);
  const [isPayMayaSelected, setPayMayaSelected] = useState(false);
  const [isGCASHSelected, setGCASHSelected] = useState(false);
  const [isFoodPandaSelected, setFoodPandaSelected] = useState(false);
  const [isShopeeFoodSelected, setShopeeFoodSelected] = useState(false);
  const [isGrabFoodSelected, setGrabFoodSelected] = useState(false);
  const [isGCClaimedSelected, setGCClaimedSelected] = useState(false);

    const setAvailableOptions = useCallback((value, other_values, length) => {
        console.log('lenggthhhh: ', length);
        // setCashSelected(false); 
        setCheckSelected(false);
        setBPICCSelected(false);
        setBPIDCSelected(false);
        setBDODCSelected(false)
        setMetroCCSelected(false);
        setAUBCCSelected(false);
        setPayMayaSelected(false);
        setGCASHSelected(false);
        setFoodPandaSelected(false);
        setShopeeFoodSelected(false);
        setGrabFoodSelected(false);
        setGCClaimedSelected(false);
        if(length === 0){
            if(value === 'Cash') {
                setCashSelected(true); 
            } 
            if(value === 'Check'){
                setCheckSelected(true);
            } 
            if(value === 'BPI Credit Card'){
                setBPICCSelected(true);
            }
            if(value === 'BPI Debit Card'){
                setBPIDCSelected(true);
            }
            if(value === 'BDO Debit Card'){
                setBDODCSelected(true)
            }
            if(value === 'Metro Credit Card'){
                setMetroCCSelected(true);
            }
            if(value === 'AUB Credit Card'){
                setAUBCCSelected(true);
            }
            if(value === 'Pay Maya'){
                setPayMayaSelected(true);
            }
            if(value === 'GCASH'){
                setGCASHSelected(true);
            }
            if(value === 'Food Panda'){
                setFoodPandaSelected(true);
            }
            if(value === 'Shopee Food'){
                setShopeeFoodSelected(true);
            }
            if(value === 'Grab Food'){
                setGrabFoodSelected(true);
            }
            if(value === 'GC Claimed'){
                setGCClaimedSelected(true);
            }
        } else{
            for (let i=0; i<length; i++){
                const otherPayments = other_values.other_payments[i].payment;
                // const lastPaymentMethod = JSON.stringify(other_values);
                console.log('Other values: ', otherPayments);
                
                if(otherPayments === 'Cash') {
                    setCashSelected(true); 
                } 
                if(otherPayments === 'Check'){
                    setCheckSelected(true);
                } 
                if(otherPayments === 'BPI Credit Card'){
                    setBPICCSelected(true);
                }
                if(otherPayments === 'BPI Debit Card'){
                    setBPIDCSelected(true);
                }
                if(otherPayments === 'BDO Debit Card'){
                    setBDODCSelected(true)
                }
                if(otherPayments === 'Metro Credit Card'){
                    setMetroCCSelected(true);
                }
                if(otherPayments === 'AUB Credit Card'){
                    setAUBCCSelected(true);
                }
                if(otherPayments === 'Pay Maya'){
                    setPayMayaSelected(true);
                }
                if(otherPayments === 'GCASH'){
                    setGCASHSelected(true);
                }
                if(otherPayments === 'Food Panda'){
                    setFoodPandaSelected(true);
                }
                if(otherPayments === 'Shopee Food'){
                    setShopeeFoodSelected(true);
                }
                if(otherPayments === 'Grab Food'){
                    setGrabFoodSelected(true);
                }
                if(otherPayments === 'GC Claimed'){
                    setGCClaimedSelected(true);
                }
            }
        }
        // if(value === 'Cash') {
        //    setCashSelected(true); 
        // } 
        // // else if(value !== 'Cash' && otherPayments !== 'Cash') {
        // //     setCashSelected(false);
        // // }
        // if(value === 'Check'){
        //     setCheckSelected(true);
        // } 
        // // else if(value !== 'Check' && otherPayments !== 'Check'){
        // //     setCheckSelected(false);
        // // }
        // if(value === 'BPI CREDIT CARD'){

        // }
    }, [setCashSelected, setCheckSelected]);
  // This function is called when the form is successfully submitted
  const onFinish = (values) => {
    // values will be an object like:
    // { cashier_name: '...', category: 'CASH', am: 100, mid: 50, pm: 75 }
    addTransaction(values);

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
        '_payment': "Cash",
        '_expense': "Food Charges"
        // 'checkbox-group': ['A', 'B'],
        // rate: 3.5,
        // 'color-picker': null,
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
                <Input placeholder="e.g. Cherry" />
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
                style={{ width: '40%'}}
                >
                    <Select placeholder="Select Category" 
                        onChange={ (value) => {
                            const values = form.getFieldsValue();
                            // console.log('new value: ', form.getFieldValue().other_payments)
                            console.log('my value: ', value);
                            setAvailableOptions(value, values, paymentField)}}>
                        {!isCashSelected && (<Select.Option value="Cash">Cash</Select.Option>)}
                        {!isCheckSelected && (<Select.Option value="Check">Check</Select.Option>)}
                        {!isBPICCSelected && (<Select.Option value="BPI Credit Card">BPI Credit Card</Select.Option>)}
                        {!isBPIDCSelected && (<Select.Option value="BPI Debit Card">BPI Debit Card</Select.Option>)}
                        {!isBDODCSelected && (<Select.Option value="BDO Debit Card">BDO Debit Card</Select.Option>)}
                        {!isMetroCCSelected && (<Select.Option value="Metro Credit Card">Metro Credit Card</Select.Option>)}
                        {!isAUBCCSelected && (<Select.Option value="AUB Credit Card">AUB Credit Card</Select.Option>)}
                        {!isPayMayaSelected && (<Select.Option value="Pay Maya">Pay Maya</Select.Option>)}
                        {!isGCASHSelected && (<Select.Option value="GCASH">GCash</Select.Option>)}
                        {!isFoodPandaSelected && (<Select.Option value="Food Panda">Food Panda</Select.Option>)}
                        {!isShopeeFoodSelected && (<Select.Option value="Shopee Food">Shopee Food</Select.Option>)}
                        {!isGrabFoodSelected && (<Select.Option value="Grab Food">Grab Food</Select.Option>)}
                        {!isGCClaimedSelected && (<Select.Option value="GC Claimed">GC Claimed</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                name={'_payment_amount'}
                rules={[{ required: true, message: 'Missing payment amount' }]}
                style={{ width: '60%'}}
                >
                    <Input placeholder="Enter amount" />
                </Form.Item>
                
            </Space.Compact>
            <Form.List name="other_payments">
            {(fields, { add, remove }) => (
                <>
                
                {fields.map(({ key, name, ...restField }) => (
                    <Space.Compact key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                        {...restField}
                        name={[name, 'payment']}
                        rules={[{ required: true, message: 'Missing payment category' }]}
                        style={{ width: '40%'}}
                    >
                
                        <Select placeholder="Select Category"
                        onChange={ (value) => {
                            const values = form.getFieldsValue();
                            // console.log('new value: ', form.getFieldValue().other_payments)
                            console.log('my value: ', value);
                            setAvailableOptions(value, values, fields.length)}}>
                            {/* {getAvailableOptions(fields, name)} */}
                            {!isCashSelected && (<Select.Option value="Cash">Cash</Select.Option>)}
                            {!isCheckSelected && (<Select.Option value="Check">Check</Select.Option>)}
                            {!isBPICCSelected && (<Select.Option value="BPI Credit Card">BPI Credit Card</Select.Option>)}
                            {!isBPIDCSelected && (<Select.Option value="BPI Debit Card">BPI Debit Card</Select.Option>)}
                            {!isBDODCSelected && (<Select.Option value="BDO Debit Card">BDO Debit Card</Select.Option>)}
                            {!isMetroCCSelected && (<Select.Option value="Metro Credit Card">Metro Credit Card</Select.Option>)}
                            {!isAUBCCSelected && (<Select.Option value="AUB Credit Card">AUB Credit Card</Select.Option>)}
                            {!isPayMayaSelected && (<Select.Option value="Pay Maya">Pay Maya</Select.Option>)}
                            {!isGCASHSelected && (<Select.Option value="GCASH">GCash</Select.Option>)}
                            {!isFoodPandaSelected && (<Select.Option value="Food Panda">Food Panda</Select.Option>)}
                            {!isShopeeFoodSelected && (<Select.Option value="Shopee Food">Shopee Food</Select.Option>)}
                            {!isGrabFoodSelected && (<Select.Option value="Grab Food">Grab Food</Select.Option>)}
                            {!isGCClaimedSelected && (<Select.Option value="GC Claimed">GC Claimed</Select.Option>)}
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
                    <Button icon={<MinusCircleOutlined /> }  onClick={() => {
                        setPaymentFieldCount((count) => count-1);
                        // setAvailableOptions("", form.getFieldValue(), fields.length)
                        remove(name); console.log("removed: ", form.getFieldValue(['other_payments']))}} />
                    {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                    </Space.Compact>
                ))}
                {paymentFieldCount < 13 && (<Form.Item>
                    <Button style={{color:'GrayText'}} type="dashed" onClick={() => {
                        const lastField = fields[fields.length-1];
                        
                        console.log(`field length: ${fields.length}`)
                        const values = form.getFieldsValue();
                        if (fields.length === 0 ) {
                            console.log(`last field value: ${JSON.stringify(form.getFieldValue(['_payment']))}`)
                            console.log(`category value: ${JSON.stringify(values)}`)
                            // console.log(`amount value: ${form.getFieldValue([lastField.name, 'payment_amount'])}`)
                            if (fields.length == 0 && form.getFieldValue(['_payment']) !== undefined && form.getFieldValue(['_payment_amount']) !== undefined) {
                                setGrossAmount((prev) => prev + parseFloat(form.getFieldValue(['_payment_amount'])))//123
                                // grossAmount.current += form.getFieldValue(['_payment_amount']);
                                setIsFilled(true);
                                setPaymentFieldCount((count) => count+1);
                                add();
                            } else {
                                setIsFilled(false)
                                console.log('Please fill in the previous field');
                            }
                        } else if (fields.length > 0 ){
                            setPaymentField(fields.length)
                            console.log('name:', lastField.name);
                            console.log('fields.length: ', fields.length);
                            if(!values.other_payments[lastField.name]?.payment === undefined || values.other_payments[lastField.name]?.payment_amount === undefined){
                                setIsFilled(false)
                            } else {
                                
                                const lastPaymentMethod = JSON.stringify(values.other_payments[lastField.name].payment);
                                const lastPaymentAmount = JSON.stringify(values.other_payments[lastField.name].payment_amount);
                                console.log(`amount:`, form.getFieldsValue().other_payments[lastField.name].payment_amount)
                                console.log(`lastPayment Method: ${lastPaymentMethod}`)
                                console.log(`lastPayment Amount: ${lastPaymentAmount}`)
                                if(lastPaymentMethod !== undefined && lastPaymentAmount !== undefined && fields.length >= 1){
                                    setGrossAmount((prev) => prev + parseFloat(form.getFieldsValue().other_payments[lastField.name].payment_amount))//456
                                    setIsFilled(true);
                                    setPaymentFieldCount((count) => count+1);
                                    add();
                                } else {
                                    setIsFilled(false)
                                    console.log('Please fill in the previous field');
                                }
                            }
                            
                        }
                        

                        
                        
                    }
                    //add()
                    } block icon={<PlusOutlined />}>
                    Add Other Payment Category
                    </Button>
                    {!isFilled && (
                        <Alert message="Please fill in the previous field!" type="error" showIcon style={{marginTop:"16px"}}/>)}
                </Form.Item>)}
                </>
            )}
            </Form.List>
            {/* <Tooltip title="Useful information">
                <Typography.Link href="#API">Need Help?</Typography.Link>
            </Tooltip> */}
        </Form.Item>
      
        <Form.Item>
            <Checkbox 
            checked={componentDisabled}
            onChange={(e) => setComponentDisabled(e.target.checked)}
            >
            Internal Expenses
            </Checkbox>
            <Tooltip title={`MM-HEAD OFFICE refers to any sales or charges that go directly to a "head office account". MM-COMMISSARY refers to purchases or reimbursements from the company (central kitchen).`}>
                <Typography.Link href="#API">What is this?</Typography.Link>
            </Tooltip>
        </Form.Item>
        {/* <Space align='center' style={{display:'flex'}}>
        
            <Form
            layout="vertical"
            disabled={!componentDisabled}
            style={{width:"100%"}}
            >
            
            </Form>
            
            
        </Space> */}
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
                        <Select.Option value="MM-HEAD OFFICE" name="expense_category_MM-HEAD-OFFICE">MM-HEAD OFFICE</Select.Option>
                        <Select.Option value="MM-COMMISARY" name= "expense_category_MM-COMMISARY">MM-COMMISARY</Select.Option>
                        <Select.Option value="MM-RM" name= "expense_category_MM-RM">MM-RM</Select.Option>
                        <Select.Option value="MM-KO" name= "expense_category_MM-KO">MM-KO</Select.Option>
                        <Select.Option value="MM-HAQ" name= "expense_category_MM-HAQ">MM-HAQ</Select.Option>
                        <Select.Option value="Food Charges" name= "expense_categor_food_harges">Food Charges</Select.Option>
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
                    <Space.Compact key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                        {...restField}
                        name={[name, 'payment']}
                        rules={[{ required: true, message: 'Missing category' }]}
                        style={{ width: '40%'}}
                    >
                
                        <Select placeholder="Select Category">
                            {/* {getAvailableOptions(fields, name)} */}
                            <Select.Option value="MM-HEAD OFFICE" name="expense_category_MM-HEAD-OFFICE">MM-HEAD OFFICE</Select.Option>
                            <Select.Option value="MM-COMMISARY" name= "expense_category_MM-COMMISARY">MM-COMMISARY</Select.Option>
                            <Select.Option value="MM-RM" name= "expense_category_MM-RM">MM-RM</Select.Option>
                            <Select.Option value="MM-KO" name= "expense_category_MM-KO">MM-KO</Select.Option>
                            <Select.Option value="MM-HAQ" name= "expense_category_MM-HAQ">MM-HAQ</Select.Option>
                            <Select.Option value="Food Charges" name= "expense_categor_food_harges">Food Charges</Select.Option>
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
                <Form.Item>
                    <Button style={{color:'GrayText'}} type="dashed" onClick={() => {
                        // const lastField = fields[fields.length - 1];
                        // console.log(`field length: ${fields.length}`)
                        // if (fields.length == 0 || lastField && form.getFieldValue([lastField.name, 'payment']) && form.getFieldValue([lastField.name, 'payment_amount'])) {
                          add();
                        // } else {
                        //   console.log('Please fill in the previous field');
                        // }
                    }
                    //add()
                    } block icon={<PlusOutlined />}>
                    Add More
                    </Button>
                </Form.Item>
                </>
            )}
            </Form.List>
            {/* <Tooltip title="Useful information">
                <Typography.Link href="#API">Need Help?</Typography.Link>
            </Tooltip> */}
        </Form.Item>
            </>
        )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Transaction
        </Button>
      </Form.Item>
      <Row gutter={16}>
    <Col span={12}>
      <Statistic title="Gross Amount" value={grossAmount} precision={2} formatter={formatter}/>
    </Col>
    <Col span={12}>
      <Statistic title="Net Amount" value={netAmount} precision={2} formatter={formatter} />
    </Col>
  </Row>
    </Form>
    
  );
};

export default TransactionForm;
