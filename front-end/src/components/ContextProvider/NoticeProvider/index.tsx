import React, { createContext, useCallback, useContext } from 'react';

// antd
import { notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';

// interface
import { noticeObj, NotificationType } from '@/interface';

interface noticeProviderProps {
  children?: React.ReactNode;
}

const noticeContext = createContext<noticeObj>(
  (type: NotificationType, message: string, description: string, placement?: NotificationPlacement) => {
    return { type, message, description, placement };
  }
);
const NoticeProvider: React.FC<noticeProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotice = useCallback(
    (type: NotificationType, message: string, description: string, placement?: NotificationPlacement) => {
      api.open({
        type,
        message,
        description,
        placement,
      });
    },
    []
  );

  return (
    <noticeContext.Provider value={openNotice}>
      {contextHolder}
      {children}
    </noticeContext.Provider>
  );
};

export default NoticeProvider;

export const useGlobalNotice = () => {
  return useContext(noticeContext);
};
