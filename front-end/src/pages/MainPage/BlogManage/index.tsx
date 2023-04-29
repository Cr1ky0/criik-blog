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
import { getTreeSelectList, hasBlog } from '@/utils';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addBlogMenu, setSelectedId } from '@/redux/slices/blogMenu';
import { setMenuId, setTitle, setMenuTitle, initWriteContent } from '@/redux/slices/blog';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { addBlogAjax } from '@/api/blog';

// interface
import { SideMenuItem } from '@/interface';

const BlogManage = () => {
  // TODO:后续可以再整个草稿箱
  const menus = useAppSelector(state => state.blogMenu.menuList);
  // text info
  const { title, menuId, content, menuTitle } = useAppSelector(state => state.blog.writeContent);
  const icons = useIcons();
  const message = useGlobalMessage();
  const antdMenus = getTreeSelectList(menus, icons, true);
  const dispatch = useAppDispatch();
  // 提交按钮loading状态
  const [isLoading, setIsLoading] = useState(false);
  // 预览打开state
  const [open, setOpen] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!title) {
      setIsLoading(false);
      message.error('请输入标题！');
      return;
    }
    if (!menuId) {
      setIsLoading(false);
      message.error('请选择分类！');
      return;
    }
    if (!content) {
      setIsLoading(false);
      message.error('请输入博客内容！');
      return;
    }
    await addBlogAjax(
      {
        title,
        belongingMenu: menuId,
        contents: content,
      },
      async data => {
        await message.loadingSuccessAsync('提交中...', '提交成功！');
        const blog = data.newBlog;
        // 如果当前没有blog，则创建完毕后默认选中该blog
        if (!hasBlog(menus)) {
          dispatch(setSelectedId(blog.id));
        }
        dispatch(addBlogMenu(blog as SideMenuItem));
        dispatch(initWriteContent());
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
            value={title}
            onChange={e => {
              dispatch(setTitle(e.target.value));
            }}
          />
          <TreeSelect
            treeIcon
            placeholder="请选择分类"
            treeLine={true}
            treeData={antdMenus}
            value={menuTitle || undefined}
            treeDefaultExpandAll
            onChange={(key, title) => {
              dispatch(setMenuId(key));
              dispatch(setMenuTitle(title[0]));
            }}
          />
        </div>
        <div className={style.editor}>
          <MarkdownEditor></MarkdownEditor>
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
        <ReactMarkdownRender>{content}</ReactMarkdownRender>
      </Drawer>
    </div>
  );
};

export default BlogManage;
