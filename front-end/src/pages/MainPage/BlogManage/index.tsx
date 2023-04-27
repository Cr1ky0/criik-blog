import React, { useState } from 'react';

// antd
import { Input, TreeSelect, Button, Drawer } from 'antd';

// css
import style from './index.module.scss';

// comp
import SideMenu from '@/components/SideMenu';
import MarkdownEditor from '@/components/MarkdownEditor';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// utils
import { getTreeSelectList } from '@/utils';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addBlogMenu } from '@/redux/slices/blogMenu';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { addBlogAjax } from '@/api/blog';
import { SideMenuItem } from '@/interface';

const BlogManage = () => {
  const dispatch = useAppDispatch();
  const [menuId, setMenuId] = useState('');
  const [titleContent, setTitleContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
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
      async data => {
        await message.loadingAsync('提交中...', '提交成功！');
        const { id, title, belongingMenu } = data.newBlog;
        dispatch(addBlogMenu({ id, title, belongingMenu } as SideMenuItem));
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
          <Button
            size="large"
            onClick={() => {
              setOpen(true);
            }}
          >
            预览
          </Button>
        </div>
      </div>
      <Drawer
        destroyOnClose
        title="总览"
        placement="right"
        width="50vw"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <ReactMarkdownRender>{value}</ReactMarkdownRender>
      </Drawer>
    </div>
  );
};

export default BlogManage;
