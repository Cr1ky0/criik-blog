import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Badge, Tag } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

import { setSelectedId } from '@/redux/slices/blogMenu';
//util
import {
  getClassificationInfo,
  getOneBlogFromMenu,
  getSideMenuItem,
  getColorRgb,
  getColorHsl,
  rgbToHsl,
} from '@/utils';

// interface
import { SideMenuItem } from '@/interface';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const Classification = () => {
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();
  const classInfoList = getClassificationInfo(menus);

  useEffect(() => {
    // 切换hover模式
    classInfoList && classInfoList.length
      ? classInfoList.forEach((_, index) => {
          const div = document.getElementById(`classification-tag-${index}`) as HTMLElement;
          if (themeMode === 'dark') {
            div.classList.add('hoverDark');
            div.classList.remove('hoverLight');
          } else {
            div.classList.add('hoverLight');
            div.classList.remove('hoverDark');
          }
        })
      : [];
  }, [themeMode]);

  return (
    <div className="clearfix">
      {classInfoList
        ? classInfoList.map((info, index) => {
            return (
              <Tag
                id={`classification-tag-${index}`}
                key={index}
                color={info.color}
                className={style.tag}
                style={{
                  marginRight: '15px',
                }}
                onClick={() => {
                  const item = getSideMenuItem(menus, info.id) as SideMenuItem;
                  const blogId = getOneBlogFromMenu(item);
                  if (blogId) {
                    dispatch(setSelectedId(blogId));
                    navigate('/blog');
                  } else {
                    message.success('当前分类下暂时没有博客哦~');
                  }
                }}
              >
                <span>{info.title}</span>
                <Badge count={info.blogNum} showZero color={info.color} className={style.badge} />
              </Tag>
            );
          })
        : undefined}
    </div>
  );
};
export default Classification;
