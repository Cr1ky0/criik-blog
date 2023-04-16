import React, { MouseEventHandler } from 'react';

/* Comment-Comp */

//Emoji
export interface EmojiObj {
  key: string;
  value: string;
}

export interface EmojiProps {
  handleClick: MouseEventHandler<HTMLLIElement>;
}

// SingleComment
export interface SingleCommentProps {
  children?: string;
}

// HomePageBlogTagBox
export interface BlogTagBoxStatistic {
  author: string;
  time: string;
  views: number;
  classification: string;
}

export interface BlogTagBoxProps {
  children: string;
  title: string;
  statistics?: BlogTagBoxStatistic;
}

// SideMenu

export interface SideMenuItem {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: SideMenuItem[];
}

export interface SideMenuProps {
  menus: SideMenuItem[];
}
