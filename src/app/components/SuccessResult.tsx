import React from 'react';
import { Result } from 'antd';

interface SuccessResultProps {
    titleText: string;
    subTitleText: string;
}

  
const SuccessResult: React.FC<SuccessResultProps> = ({titleText, subTitleText}) => (
  <Result
    status="success"
    title={titleText}
    subTitle={subTitleText}
    // extra={[
    //   <Button type="primary" key="console">
    //     Go Console
    //   </Button>,
    // ]}
  />
);

export default SuccessResult;