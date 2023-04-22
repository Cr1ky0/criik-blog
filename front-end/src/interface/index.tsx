import React, { ReactElement } from 'react';

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
  holder: React.ReactElement;
}

/* Form */

// userPswObj
export interface userPswObj {
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}

// userInfo
export interface userInfoObj {
  name?: string;
  brief?: string;
  avatar?: unknown;
}

// email
export interface emailObj {
  code?: string;
  newEmail?: string;
}
