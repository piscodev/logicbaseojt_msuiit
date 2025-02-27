import React, { useEffect } from 'react';
import { message } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface MessengerProps {
  messageType: NotificationType;
  messageContent: string;
}

const Messenger: React.FC<MessengerProps> = ({ messageType, messageContent }) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (messageContent) {
      messageApi.open({
        type: messageType,
        content: messageContent,
      });
    }
  }, [messageType, messageContent, messageApi]);

  return <div>{contextHolder}</div>;
};

export default Messenger;
