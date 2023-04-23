import React, { ReactElement } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';

/* Comment-Comp */

//Emoji
export interface EmojiObj {
  key: string;
  value: string;
}

/* HomePage */

// BlogTagBox
export interface BlogTagBoxStatistic {
  author: string;
  time: string;
  views: number;
  classification: string;
}

/* SideMenu */
export interface SideMenuItem {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: SideMenuItem[];
}

/* IconStore */
export interface AntdIcon {
  icon: ReactElement;
  name: string;
}

/* LoginForm */
export interface LoginFormData {
  email: string;
  password: string;
}

/* MessageProvider */
export interface messageObj {
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
  holder: React.ReactNode;
}

/* NoticeProvider */
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type noticeObj = {
  openNotice: (type: NotificationType, message: string, description: string, placement?: NotificationPlacement) => void;
  holder: React.ReactNode;
};

/* Form */

// userPswObj
export interface userPswObj {
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}

// userUpdate
export interface userUpdateObj {
  name?: string;
  brief?: string;
  avatar?: unknown;
}

// userInfo
export interface userObj {
  name: string;
  email: string;
  brief: string;
  avatar: string;
  id: string;
}

// email
export interface emailObj {
  code?: string;
  newEmail?: string;
}
