import React, { useState } from 'react';

// antd
import { Input, TreeSelect, Button, Drawer, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// css
import style from './index.module.scss';

// comp
import SideMenu from '@/components/SideMenu';
import MarkdownEditor from '@/components/MarkdownEditor';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// utils
import { getSideMenuItem, getTreeSelectList, hasBlog } from '@/utils';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addBlogMenu, setSelectedId, deleteMenu } from '@/redux/slices/blog';
import {
  setMenuId,
  setTitle,
  setMenuTitle,
  initWriteContent,
  setIsEdit,
  setAllContent,
  updateCurBlog,
} from '@/redux/slices/blog';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';

// api
import { addBlogAjax, updateBlogAjax } from '@/api/blog';

// interface
import { SideMenuItem } from '@/interface';

const BlogManage = () => {
  // TODO:后续可以再整个草稿箱
  const menus = useAppSelector(state => state.blog.menuList);
  const modal = useGlobalModal();
  // text info
  const { title, menuId, content, menuTitle } = useAppSelector(state => state.blog.writeContent);
  const isEdit = useAppSelector(state => state.blog.isEdit);
  const selectedId = useAppSelector(state => state.blog.selectedId);
  const curBlog = useAppSelector(state => state.blog.curBlog);
  const icons = useIcons();
  const message = useGlobalMessage();
  const antdMenus = getTreeSelectList(menus, icons, true);
  const dispatch = useAppDispatch();
  // 提交按钮loading状态
  const [isLoading, setIsLoading] = useState(false);
  // 预览打开state
  const [open, setOpen] = useState(false);

  // 编辑状态菜单
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div style={{ fontSize: '1vw' }}>Update</div>,
      onClick: () => {
        if (!hasBlog(menus) && !selectedId) {
          message.error('当前没有博客可供编辑！');
          return;
        }
        modal.confirm({
          title: '提示',
          content: '编辑当前博客会覆盖正在编辑的内容，确定要这么做吗？',
          onOk: () => {
            const { title, belongingMenu, contents } = curBlog;
            const menu = getSideMenuItem(menus, belongingMenu) as SideMenuItem;
            dispatch(
              setAllContent({
                title,
                menuId: menu.id,
                menuTitle: menu.title,
                content: contents,
              })
            );
            dispatch(setIsEdit(true));
          },
        });
      },
    },
    {
      key: '2',
      label: <div style={{ fontSize: '1vw' }}>Add</div>,
      onClick: () => {
        modal.confirm({
          title: '提示',
          content: '添加博客会情况当前编辑状态，确定要这么做吗？',
          onOk: () => {
            dispatch(initWriteContent());
            dispatch(setIsEdit(false));
          },
        });
      },
    },
  ];
  const handleSubmit = async () => {
    setIsLoading(true);
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

  const handleUpdate = async () => {
    setIsLoading(true);
    await updateBlogAjax(
      {
        blogId: selectedId,
        data: {
          title,
          belongingMenu: menuId,
          contents: content,
          updateAt: Date.now(),
        },
      },
      async () => {
        await message.loadingSuccessAsync('更新中...', '更新成功！');
        dispatch(initWriteContent());
        // 更新后要重新设置blog信息、删除原blog的menu、添加blog到新的menu
        dispatch(updateCurBlog({ title, belongingMenu: menuId, contents: content, updateAt: Date.now() }));
        dispatch(deleteMenu(selectedId));
        dispatch(
          addBlogMenu({
            id: selectedId,
            title,
            belongingMenu: menuId,
          })
        );
        dispatch(setIsEdit(false));
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
        {/*<div className={style.editState}>当前状态：{isEdit ? 'Update' : 'Add'}</div>*/}
        <div className={style.editState}>
          当前状态：
          <Dropdown menu={{ items, selectable: true, selectedKeys: [isEdit ? '1' : '2'] }}>
            <a
              onClick={e => {
                e.preventDefault();
              }}
            >
              <Space>
                {isEdit ? 'Update' : 'Add'}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
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
          {/* 是否处于编辑状态 */}
          {isEdit ? (
            <Button size="large" loading={isLoading} onClick={handleUpdate}>
              更新
            </Button>
          ) : (
            <Button size="large" loading={isLoading} onClick={handleSubmit}>
              提交
            </Button>
          )}
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
