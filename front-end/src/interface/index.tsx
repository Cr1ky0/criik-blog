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
