import React, { useState } from 'react';
import { message } from 'antd';
type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface MessengerProps {
  messageType: NotificationType;
  messageContent: string;
  messageKey: string
}

const Messenger: React.FC<MessengerProps> = ({ messageType, messageContent, messageKey }) => {
    const [messageApi, contextHolder] = message.useMessage();
    if (messageContent) {
        message.destroy(); 
        messageApi.open({
            type: messageType,
            content: messageContent,
            key: messageKey
        });
    }

    return <div>{contextHolder}</div>;
};

export default Messenger;
