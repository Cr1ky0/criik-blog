import React, { ReactElement } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import type { MenuProps } from 'antd/es/menu';

/******** API ********/
//Emoji
export interface EmojiObj {
  key: string;
  value: string;
}

// blog
export interface blogObj {
  _id: string;
  id: string;
  title: string;
  belongingMenu: string;
  contents?: string;
  likes?: number;
  views?: number;
  publishAt?: string;
  belongTo?: string;
}

/******** Ajax ********/
// LoginForm
export interface LoginFormData {
  email: string;
  password: string;
}

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

// menu
export interface addMenuObj {
  title: string;
  grade: number;
  parentId?: string;
  icon: string;
}

export interface updateMenuObj {
  id: string;
  title: string;
  icon?: string;
}

export interface addBlogObj {
  belongingMenu: string;
  title: string;
  contents: string;
}

/******** redux ********/
export interface SideMenuItem {
  id: string;
  _id: string;
  title: string;
  grade?: number;
  belongingMenu?: string;
  icon?: string;
  children?: SideMenuItem[];
  blogs?: blogObj[];
}

/******** HomePage ********/
// BlogTagBox
export interface BlogTagBoxStatistic {
  author: string;
  time: string;
  views: number;
  classification: string;
}

/******** SideMenu ********/
export type MenuItem = Required<MenuProps>['items'][number];

export interface TreeSelectItem {
  value?: string;
  icon?: React.ReactNode;
  key?: React.Key;
  children?: TreeSelectItem[];
}

/******** IconStore ********/
export interface AntdIcon {
  icon: ReactElement;
  name: string;
}

/******** NoticeProvider ********/
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type noticeObj = {
  openNotice: (type: NotificationType, message: string, description: string, placement?: NotificationPlacement) => void;
  holder: React.ReactNode;
};

/********* BlogPage *********/
export interface BreadCrumbObj {
  icon?: React.ReactNode;
  title: string;
}
