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
import { getClassificationInfo, getOneBlogFromMenu, getSideMenuItem } from '@/utils';

// interface
import { SideMenuItem } from '@/interface';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const getColorRgb = (primaryColor: string) => {
  const color = primaryColor.split(',');
  return color.map(item => {
    return Number(item.replace('rgb(', '').replace(')', ''));
  });
};
const Classification = () => {
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const dispatch = useAppDispatch();
  const classInfoList = getClassificationInfo(menus);
  const [primaryColors, setPrimaryColors] = useState([] as string[]);
  const [hoverColors, setHoverColors] = useState([] as string[]);

  useEffect(() => {
    const primColors =
      classInfoList && classInfoList.length
        ? classInfoList.map((_, index) => {
            const div = document.getElementById(`classification-tag-${index}`) as HTMLElement;
            return window.getComputedStyle(div).backgroundColor;
          })
        : [];
    const hovColors =
      primColors && primColors.length
        ? primColors.map(color => {
            const colorRgb = getColorRgb(color as string);
            return `rgba(${colorRgb[0] - 10},${colorRgb[1] - 10},${colorRgb[2] - 10})`;
          })
        : [];
    setHoverColors(hovColors);
    setPrimaryColors(primColors);
  }, []);

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
                style={{ marginRight: '15px' }}
                onMouseEnter={e => {
                  // 这里也不能直接减
                  e.currentTarget.style.backgroundColor = hoverColors[index] as string;
                }}
                onMouseLeave={e => {
                  // 这里不能直接加，有bug导致最终变白色，需要记录原来的颜色直接赋值
                  e.currentTarget.style.backgroundColor = primaryColors[index] as string;
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
