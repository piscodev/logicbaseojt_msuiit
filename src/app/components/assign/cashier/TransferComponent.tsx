import React, { useEffect, useState } from 'react';
import { Flex, Switch, Table, Transfer, Card, Button, Drawer, Form, Input } from 'antd';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';

// import { useUserStore } from '@/stores/userStore';
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
  cashier_lane_id: number | null
}
interface CashierLane {
  id: number;
  name: string;
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
    const [disabled, setDisabled] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [tableData, setTableData] = useState<DataType[]>([]);
    const [cashierLanes, setCashierLanes] = useState<CashierLane[]>([]);// WILL UPDATE THIS TO FETCH ACTUAL LANES FROM API

    const [activeLane, setActiveLane] = useState<number | null>(null);
    const handleAddCashierLane = () => {
      setIsDrawerOpen(true)
    };
    const handleSubmitCashierLane = async(name:string) => {
      try {
        console.log("cashier lane name", name)
        const response = await fetch(`/api/addCashierLane`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(name),
        });
    
        if (!response.ok) {
          throw new Error('Failed to add cashier lane');
        }
        form.resetFields();
      } catch (error){
        console.error('Error adding cashier lane:', error);
      }
    }
    const handleDrawerClose = () => {
      setIsDrawerOpen(false)
    }
    
    // Update targetKeys when activeLane changes
    useEffect(() => {
      if (activeLane) {
        // Get all cashiers assigned to the active lane
        const selectedLaneCashiers = tableData
          .filter((cashier) => cashier.cashier_lane_id === activeLane)
          .map((cashier) => cashier.key); // Map to key for targetKeys
    
        console.log("Selected lane cashiers: ", selectedLaneCashiers);
        setTargetKeys(selectedLaneCashiers);
      } else {
        setTargetKeys([]); // Reset if no lane is selected
      }
    }, [activeLane, tableData]);

    useEffect(()=>{
      const fetchAllData = async () => {
        try {
          const laneResponse = await fetch('/api/getCashierLanes');
          const lanesData = await laneResponse.json();
          if (!laneResponse.ok) {
            throw new Error('Failed to fetch cashier lanes');
          } 
          console.log('Fetched cashier lanes:', lanesData.data);
          const tableResponse = await fetch(`/api/getAllCashierData`, {
            method: 'GET'
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
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
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
            laneId: lane.id,
            assignedCashiers: lane.assignedCashiers.map((cashier) => cashier.id),
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
    
        // Update initialCashiers after successful save
        setCashierLanes((prevLanes) =>
          prevLanes.map((prevLane) =>
            prevLane.id === lane.id
              ? {
                  ...prevLane,
                  initialCashiers: [...prevLane.assignedCashiers],
                }
              : prevLane
          )
        );
        console.log(`Changes saved for ${lane.name}`);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    };
    
  
    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
      setTargetKeys(nextTargetKeys);
      // Update active lane with new assigned cashiers
      setCashierLanes((prevLanes) =>
        prevLanes.map((lane) =>
          lane.id === activeLane
            ? {
                ...lane,
                assignedCashiers: tableData.filter((user) => nextTargetKeys.includes(user.key)), // Store full user objects
              }
            : lane
        )
      );
      // Update tableData to reflect the cashier_lane_id change
      setTableData((prevTableData) =>
        prevTableData.map((cashier) => {
          // If the cashier is part of the currently active lane, update cashier_lane_id
          if (nextTargetKeys.includes(cashier.key)) {
            // Assign to activeLane if included in targetKeys
            return { ...cashier, cashier_lane_id: activeLane };
          } 
          // If the cashier was in the active lane but is no longer in targetKeys, reset cashier_lane_id to null
          else if (cashier.cashier_lane_id === activeLane) {
            return { ...cashier, cashier_lane_id: null };
          }
          // Otherwise, don't change the cashier_lane_id
          return cashier;
        })
      );
    };
  
    const toggleDisabled = (checked: boolean) => {
      setDisabled(checked);
    };
  
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
              key={lane.id}
              title={lane.name}
              style={{
                margin: '8px',
                cursor: 'pointer',
                border: activeLane === lane.id ? '2px solid #1890ff' : undefined
              }}
              onClick={() => setActiveLane(lane.id)}
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
                    console.log(`User matched for lane ${lane.name}:`, user.name); // ✅ Debug here
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
        <Drawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        >
          <Form
          name="transaction_form"
          form={form}
          layout="vertical"
          onFinish={handleSubmitCashierLane}>
            <Form.Item label="Cashier Lane Name" name="name"rules={[{ required: true, message: 'Please input the cashier lane name!' }]}>
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
          titles={["Cashiers", `${activeLane !== null && cashierLanes.find((lane) => lane.id === activeLane)?.name}`]}
          dataSource={tableData.filter((user) => user.cashier_lane_id === null || user.cashier_lane_id === activeLane)}
          targetKeys={targetKeys}
          disabled={disabled}
          showSearch
          showSelectAll={false}
          onChange={onChange}
          filterOption={(inputValue, item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
          }
          leftColumns={transferColumns}
          rightColumns={transferColumns}
        />
        <Switch
          unCheckedChildren="disabled"
          checkedChildren="disabled"
          checked={disabled}
          onChange={toggleDisabled}
        />
      </Flex>
    );
  };
  
  export default TransferComponent;