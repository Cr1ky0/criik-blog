import React, { createContext, useContext } from 'react';

// antd
import { message } from 'antd';

// interface
import { messageObj } from '@/interface';

interface messageProviderProps {
  children?: React.ReactNode;
}

const messageContext = createContext<messageObj>({
  success: content => {
    message.success(content);
  },
  warning: content => {
    message.warning(content);
  },
  error: content => {
    message.error(content);
  },
  holder: <></>,
});

const MessageProvider: React.FC<messageProviderProps> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = async (content: string) => {
    await messageApi.open({
      type: 'success',
      content,
    });
  };

  const error = async (content: string) => {
    await messageApi.open({
      type: 'error',
      content,
    });
  };

  const warning = async (content: string) => {
    await messageApi.open({
      type: 'warning',
      content,
    });
  };

  return (
    <messageContext.Provider value={{ success, error, warning, holder: contextHolder }}>
      {children}
    </messageContext.Provider>
  );
};

export default MessageProvider;

export const useGlobalMessage = () => {
  const { success, error, warning, holder } = useContext(messageContext);
  return { success, error, warning, holder };
};
