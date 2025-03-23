import React, { useEffect, useState } from 'react';
import { Flex, Table, Transfer, Card, Button, Drawer, notification, Form, Input } from 'antd';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

import { useUserStore } from '@/stores/userStore';
// import { DateTime } from 'luxon';
// import { User } from '@/app/lib/Interface/interface';
type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];
const MAX_CASHIERS_PER_LANE = 3;
interface DataType {
  key: string;
  id: number
  name: string
  email: string
  user_type: string
  last_login?: string
  address?:string
  active?:number
  gender?:string
  contact_number?:string
  total_hours_worked?: number
  total_earnings ?: number
  lane_id: number | null
}
interface CashierLane {
  lane_id: number;
  lane_name: string;
  assignedCashiers: DataType[];
  initialCashiers: DataType[]; // Holds the original data for comparison
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props;
    return (
      <Transfer style={{ width: '100%' }} {...restProps}>
        {({
          direction,
          filteredItems,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection: TableRowSelection<TransferItem> = {
            getCheckboxProps: () => ({ 
              disabled: listDisabled 
            }),
            onChange(selectedRowKeys) {
              onItemSelectAll(selectedRowKeys, 'replace');
            },
            selectedRowKeys: listSelectedKeys,
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          };
  
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : undefined }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) {
                    return;
                  }
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    );
  };
  const transferColumns: TableColumnsType<DataType> = [
    {
      dataIndex: 'name',
      title: 'Name',
    }
  ];
  
  const columns: TableColumnsType<DataType> = [
    {
      dataIndex: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'last_login',
      title: 'Last Login',
      // render: (last_login: string) => (
      //   <Tag style={{ marginInlineEnd: 0 }} color="cyan">
      //     {last_login.toUpperCase()}
      //   </Tag>
      // ),
    },
    {
      dataIndex: 'total_hours_worked',
      title: 'Total Hours Worked',
    },
    {
      dataIndex: 'total_earnings',
      title: 'Total Earnings',
    },
  ];
  
  // Helper function to compare two arrays of assigned cashiers
const areCashiersEqual = (arr1: DataType[], arr2: DataType[]) => {
  if (arr1.length !== arr2.length) return false;
  const ids1 = arr1.map((cashier) => cashier.id).sort();
  const ids2 = arr2.map((cashier) => cashier.id).sort();
  return JSON.stringify(ids1) === JSON.stringify(ids2);
};

  // const filterOption = (input: string, item: User) =>
  //   item.name?.includes(input) || item.address?.includes(input);
  
  const TransferComponent: React.FC = () => {
    const [form] = Form.useForm();
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
    const user = useUserStore((state) => state.user);
    // const [disabled, setDisabled] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [tableData, setTableData] = useState<DataType[]>([]);
    const [cashierLanes, setCashierLanes] = useState<CashierLane[]>([]);// WILL UPDATE THIS TO FETCH ACTUAL LANES FROM API
    const [api, contextHolder] = notification.useNotification();
    let user_admin_id:number
    if(user){
      console.log("User: ", user);
      user_admin_id = user.user_admin_id as number
    }
    const openNotificationWithIcon = (type: NotificationType, message:string, description:string) => {
      api[type]({
        message: message,
        description: description});
    };
    const [activeLane, setActiveLane] = useState<number | null>(0);
    const handleAddCashierLane = () => {
      setIsDrawerOpen(true)
    };
    const handleDrawerClose = () => {
      setIsDrawerOpen(false)
    }
    const fetchAllData = async () => {
      try {
        const laneResponse = await fetch('/api/getCashierLanes',
          {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user_admin_id})
          }
        );
        const lanesData = await laneResponse.json();
        if (!laneResponse.ok) {
          throw new Error('Failed to fetch cashier lanes');
        } 
        console.log('Fetched cashier lanes:', lanesData.data);
        const tableResponse = await fetch(`/api/getAllCashierData`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({user_admin_id})
        });
        const tableDataResult = await tableResponse.json()
        if(!tableResponse.ok){
            throw new Error("Failed to fetch cashier data.");
        }
        console.log('Cashier data fetched succcessfully: ', tableDataResult.data);
        // Sync the cashier lanes with the correct assigned cashiers from the tableData
        const updatedLanes = lanesData.data.map((lane:CashierLane) => ({
          ...lane,
          assignedCashiers: tableDataResult.data.filter((user:DataType) =>
            lane.assignedCashiers.some((cashier) => String(cashier.key) === String(user.key))
          ),
          initialCashiers: tableDataResult.data.filter((user:DataType) =>
            lane.assignedCashiers.some((cashier) => String(cashier.key) === String(user.key))
          ),
        }));

        // Update both states after all data is ready
        setTableData(tableDataResult.data);
        setCashierLanes(updatedLanes);
        setActiveLane(updatedLanes[0].lane_id)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const handleSubmitCashierLane = async(lane_name:string) => {
      try {
        console.log("cashier lane name", lane_name)
        const response = await fetch(`/api/addCashierLane`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user_admin_id, lane_name}),
        });
    
        if (!response.ok) {
          throw new Error('Failed to add cashier lane');
        }
        openNotificationWithIcon('success', 'Success', 'Cashier lane added successfully');
        handleDrawerClose();
        fetchAllData();
        form.resetFields();
      } catch (error){
        openNotificationWithIcon('error', 'Error', 'Failed to add cashier lane');
        console.error('Error adding cashier lane:', error);
      }
    }
    
    
    // Update targetKeys when activeLane changes
    useEffect(() => {
      if (activeLane) {
        // Get all cashiers assigned to the active lane
        const selectedLaneCashiers = tableData
          .filter((cashier) => cashier.lane_id === activeLane)
          .map((cashier) => cashier.key); // Map to key for targetKeys
    
        console.log("Selected lane cashiers: ", selectedLaneCashiers);
        setTargetKeys(selectedLaneCashiers);
      } else {
        setTargetKeys([]); // Reset if no lane is selected
      }
    }, [activeLane, tableData]);

    useEffect(()=>{
      fetchAllData();
    },[])
    useEffect(() => {
      console.log('Cashier Lanes after data sync:', cashierLanes);
    }, [cashierLanes]);
    const handleSave = async (lane: CashierLane) => {
      try {
        console.log("lane to save", lane)
        const response = await fetch(`/api/updateCashierLane`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_admin_id: user_admin_id,
            laneId: lane.lane_id,
            assignedCashiers: lane.assignedCashiers.map((cashier) => cashier.id),
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
    
        // Update initialCashiers after successful save
        setCashierLanes((prevLanes) =>
          prevLanes.map((prevLane) =>
            prevLane.lane_id === lane.lane_id
              ? {
                  ...prevLane,
                  initialCashiers: [...prevLane.assignedCashiers],
                }
              : prevLane
          )
        );
        console.log(`Changes saved for ${lane.lane_name}`);
        openNotificationWithIcon('success', "Success", `Changes saved for ${lane.lane_name}`);
      } catch (error) {
        openNotificationWithIcon('error', "Error", `Failed to save changes for ${lane.lane_name}`);
        console.error('Error saving changes:', error);
      }
    };
    
  
    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
      setTargetKeys(nextTargetKeys);
      // Update active lane with new assigned cashiers
      setCashierLanes((prevLanes) =>
        prevLanes.map((lane) =>
          lane.lane_id === activeLane
            ? {
                ...lane,
                assignedCashiers: tableData.filter((user) => nextTargetKeys.includes(user.key)), // Store full user objects
              }
            : lane
        )
      );
      // Update tableData to reflect the lane_id change
      setTableData((prevTableData) =>
        prevTableData.map((cashier) => {
          // If the cashier is part of the currently active lane, update lane_id
          if (nextTargetKeys.includes(cashier.key)) {
            // Assign to activeLane if included in targetKeys
            return { ...cashier, lane_id: activeLane };
          } 
          // If the cashier was in the active lane but is no longer in targetKeys, reset lane_id to null
          else if (cashier.lane_id === activeLane) {
            return { ...cashier, lane_id: null };
          }
          // Otherwise, don't change the lane_id
          return cashier;
        })
      );
    };
  
    // const toggleDisabled = (checked: boolean) => {
    //   setDisabled(checked);
    // };
  
    return (
      <Flex align="start" gap="middle" vertical>
        <Button type="primary" onClick={handleAddCashierLane}>Add Cashier Lane</Button>
        {/* I want to add cards here for each cashier lane, there's 1 card for each cashier lane which includes title as cashier lane name, description shows names of cashiers assigned to this cashier lane, when I click this card this cashier lane will be active and those active will be focused or highlighted, then the right column of the table transfer will be the active cashier lane*/}
        <Flex 
        gap="middle"
        style={{
          maxWidth: '100%',
          flexWrap: 'nowrap', // Prevent wrapping to keep items in a single row
          overflowX: 'auto', // Allow horizontal scrolling
          paddingBottom: '8px', // Optional: Prevent scrollbar overlap
        }}
        >
          {cashierLanes.map((lane) => (
            <Card
              key={lane.lane_id}
              title={lane.lane_name}
              style={{
                margin: '8px',
                cursor: 'pointer',
                border: activeLane === lane.lane_id ? '2px solid #1890ff' : undefined
              }}
              onClick={() => setActiveLane(lane.lane_id)}
              actions={[
                <>
                {!areCashiersEqual(lane.assignedCashiers, lane.initialCashiers) && (
                  <Button 
                    type="primary" 
                    onClick={() => handleSave(lane)}
                    disabled={lane.assignedCashiers.length > MAX_CASHIERS_PER_LANE}
                  >
                    Save
                  </Button>
                )}
                </>
              ]}
            >
              <Table
                columns={columns}
                dataSource={tableData.filter((user) => {
                  const found = lane.assignedCashiers.some(
                    (cashier) => String(cashier.key) === String(user.key)
                  );
                  if (found) {
                    console.log(`User matched for lane ${lane.lane_name}:`, user.name); // ✅ Debug here
                  }
                  return found;
                })}
                size="small"
                pagination={false}
              />
              
              {/* <p>Cashiers: {lane.assignedCashiers.length}</p> */}
            </Card>
          ))}
        </Flex>
        {contextHolder}
        <Drawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        >
          <Form
          name="transaction_form"
          form={form}
          layout="vertical"
          onFinish={handleSubmitCashierLane}>
            <Form.Item label="Cashier Lane Name" name="lane_name"rules={[{ required: true, message: 'Please input the cashier lane name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
              Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <TableTransfer
          titles={["Cashiers", `${activeLane !== null && cashierLanes.find((lane) => lane.lane_id === activeLane)?.lane_name}`]}
          dataSource={tableData.filter((user) => user.lane_id === null || user.lane_id === activeLane)}
          targetKeys={targetKeys}
          // disabled={disabled}
          showSearch
          showSelectAll={false}
          onChange={onChange}
          filterOption={(inputValue, item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
          }
          leftColumns={transferColumns}
          rightColumns={transferColumns}
        />
        {/* <Switch
          unCheckedChildren="disabled"
          checkedChildren="disabled"
          checked={disabled}
          onChange={toggleDisabled}
        /> */}
      </Flex>
    );
  };
  
  export default TransferComponent;