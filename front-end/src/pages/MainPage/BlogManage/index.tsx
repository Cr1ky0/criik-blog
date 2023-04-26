import React, { useState } from 'react';

// antd
import { Input, TreeSelect, Button } from 'antd';

// css
import style from './index.module.scss';

// comp
import SideMenu from '@/components/SideMenu';
import MarkdownEditor from '@/components/MarkdownEditor';

// utils
import { getTreeSelectList } from '@/utils';

// redux
import { useAppSelector } from '@/redux';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { addBlogAjax } from '@/api/blog';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const BlogManage = () => {
  const [menuId, setMenuId] = useState('');
  const [titleContent, setTitleContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const icons = useIcons();
  const antdMenus = getTreeSelectList(menus, icons, true);
  const message = useGlobalMessage();
  const getValue = (value: string) => {
    setValue(value);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!titleContent) {
      setIsLoading(false);
      message.error('请输入标题！');
      return;
    }
    if (!menuId) {
      setIsLoading(false);
      message.error('请选择分类！');
      return;
    }
    if (!value) {
      setIsLoading(false);
      message.error('请输入博客内容！');
      return;
    }
    await addBlogAjax(
      {
        title: titleContent,
        belongingMenu: menuId,
        contents: value,
      },
      async () => {
        await message.success('提交成功！');
        setIsLoading(false);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.sider}>
        <SideMenu></SideMenu>
      </div>
      <div className={style.content}>
        <div className={style.inputBox}>
          <Input
            showCount
            placeholder="Title"
            maxLength={50}
            style={{ fontSize: '2vw' }}
            onChange={e => {
              setTitleContent(e.target.value);
            }}
          />
          <TreeSelect
            treeIcon
            placeholder="请选择分类"
            treeLine={true}
            treeData={antdMenus}
            onChange={(key, value) => {
              setMenuId(key as string);
              setTitleContent(value[0] as string);
            }}
          />
        </div>
        <div className={style.editor}>
          <MarkdownEditor value={value} setValue={getValue}></MarkdownEditor>
        </div>
        <div className={style.submitBtn}>
          <Button size="large" loading={isLoading} onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogManage;
