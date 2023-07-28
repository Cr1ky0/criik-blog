import React, { ReactElement } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import type { MenuProps } from 'antd/es/menu';

/******** Ajax ********/
// LoginForm
export interface LoginFormData {
  email: string;
  password: string;
}

// userPswObj
export interface UserPswObj {
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}

// userUpdate
export interface UserUpdateObj {
  name?: string;
  brief?: string;
  avatar?: unknown;
}

// userInfo
export interface UserObj {
  name: string;
  email: string;
  brief: string;
  avatar: string;
  id: string;
}

// email
export interface EmailObj {
  code?: string;
  newEmail?: string;
}

// menu
export interface AddMenuObj {
  title: string;
  grade: number;
  parentId?: string;
  icon: string;
}

export interface UpdateMenuObj {
  id: string;
  title?: string;
  icon?: string;
  color?: string;
}

// blog
export interface AddBlogObj {
  belongingMenu: string;
  title: string;
  contents: string;
  updateAt?: string;
  views?: string;
}

export interface UpdateBlogObj {
  blogId: string;
  data: AddBlogObj;
}

// comments
export interface AddCommentObj {
  belongingBlog: string;
  contents: string;
  username?: string;
  userId?: string;
  userRole: string;
  brief?: string;
}

export interface UpdateCommentObj {
  id: string;
  likes: number;
}

// reply
export interface AddReplyObj {
  belongingComment: string;
  contents: string;
  username?: string;
  userId?: string;
  userRole: string;
  brief?: string;
}

/******** redux ********/
//Emoji
export interface EmojiObj {
  key: string;
  value: string;
}

// blog（和菜单里的blogs项通用）
export interface BlogObj {
  _id: string;
  id: string;
  title: string;
  belongingMenu: string;
  isCollected?: boolean;
  author?: string;
  publishAt?: string;
  updateAt?: string;
  contents?: string;
  likes?: number;
  views?: number;
  sort?: number;
  commentCount?: number;
  belongTo?: string;
}

export interface SideMenuItem {
  id: string;
  _id: string;
  title: string;
  grade?: number;
  sort?: number;
  belongingMenu?: string;
  icon?: string;
  color?: string;
  children?: SideMenuItem[];
  blogs?: BlogObj[];
}

// export interface CommentObj {
//   id: string;
//   username: string;
//   brief: string;
//   time: string;
//   likes: number;
//   contents: string;
//   userRole: string;
//   userId: string;
// }

export interface CommentListObj {
  replys: ReplyApiObj[];
  id: string;
  username: string;
  brief: string;
  time: string;
  likes: number;
  contents: string;
  userRole: string;
  userId: string;
  belongingBlog: string;
}

export interface CommentApiObj {
  _id: string;
  contents: string;
  likes: number;
  publishAt: string;
  belongingUser: string;
  belongingBlog: string;
  userRole: string;
  username: string;
  replys: ReplyApiObj[];
  brief: string;
}

export interface ReplyApiObj {
  _id: string;
  contents: string;
  likes: number;
  publishAt: string;
  belongingUser: string;
  belongingComment: string;
  userRole: string;
  username: string;
  brief: string;
}

export interface TextContentObj {
  title: string;
  menuId: string; // 所属分类Id
  menuTitle: string;
  content: string;
}

export interface TimeLineObj {
  id: string;
  _id: string;
  title: string;
  publishAt: string;
}

/************ 请求参数 ****************/
export interface RequestOptions {
  id: string;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
}

export interface ReqOptions {
  sort?: string;
  page?: string;
  limit?: string;
  fields?: string;
  options?: string;
}

/******** HomePage ********/
// BlogTagBox
export interface BlogTagBoxStatistic {
  author: string;
  time: string;
  views: number;
  belongingMenu: string;
  isCollected: boolean;
  id: string;
  likes: number;
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

/*********** Classification **********/
export interface ClassificationInfoObj {
  title: string;
  color: string;
  blogNum: number;
  id: string;
}
