import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// comp
import SideMenu from '@/components/SideMenu';
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';
import Comment from '@/components/Comment';

// antd
import { Skeleton, Breadcrumb } from 'antd';

// css
import style from './index.module.scss';

//redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId, deleteMenu } from '@/redux/slices/blogMenu';
import { initWriteContent, setAllContent, setIsEdit } from '@/redux/slices/blog';
import { setChosenList } from '@/redux/slices/chosenList';

// utils
import { getBreadcrumbList, getOneBlogId, getSideMenuItem } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';

// api
import { deleteBlogAjax } from '@/api/blog';

// interface
import { SideMenuItem } from '@/interface';

const BlogPage = () => {
  const message = useGlobalMessage();
  const modal = useGlobalModal();
  const navigate = useNavigate();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const curBlog = useAppSelector(state => state.blog.curBlog);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const { title, contents, author, publishAt } = curBlog;
  const icons = useIcons();
  const breadcrumbList = selectedId ? getBreadcrumbList(menus, selectedId, icons) : undefined;
  useEffect(() => {
    // 初始化动画
    setTimeout(() => {
      setInitLoading(false);
    }, 1000);
  }, [selectedId]);

  const handleEdit = () => {
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
    navigate('/manage');
    dispatch(setChosenList([false, false, true, false]));
    dispatch(setIsEdit(true));
  };
  const handleDelete = async () => {
    await deleteBlogAjax(
      selectedId,
      async () => {
        await message.loadingAsync('删除中...', '删除成功');
        // 删除后重新设置selectedId以外的ID（先更新selectedId的话下面的代码的selectedId仍是原来的Id，没做更新）
        const id = getOneBlogId(menus, selectedId);
        dispatch(setSelectedId(id || ''));
        // 删除id
        dispatch(deleteMenu(selectedId));
        // 没有博客了则将编辑状态置为Add
        if (!id) {
          dispatch(setIsEdit(false));
          dispatch(initWriteContent());
        }
      },
      msg => {
        message.error(msg);
      }
    );
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      {/* 初始化加载动画 */}
      {initLoading ? (
        <div className={style.loadingAnime}>
          <Skeleton active />
          <br />
          <Skeleton active />
          <br />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className={style.sider}>
            <SideMenu
              noEdit={true}
              setLoading={(state: boolean) => {
                setLoading(state);
              }}
            ></SideMenu>
          </div>
          <div className={`${style.content} clearfix`}>
            {/* 选中状态 */}
            {selectedId ? (
              /* Content加载状态 */
              loading ? (
                <>
                  <Skeleton active />
                  <br />
                  <Skeleton active />
                  <br />
                  <Skeleton active />
                </>
              ) : (
                <>
                  <div className={style.breadCrumb}>
                    <Breadcrumb
                      items={
                        breadcrumbList
                          ? breadcrumbList.map(item => {
                              return {
                                title: (
                                  <>
                                    {item.icon} {item.title}
                                  </>
                                ),
                              };
                            })
                          : []
                      }
                    />
                  </div>
                  <div className={style.info}>
                    <div className={style.title}>{title}</div>
                    <div className={style.blogInfo}>
                      <BlogInfo
                        statistics={{
                          author: 'criiky0',
                          time: '2020/1/2',
                          views: 100,
                          classification: 'test',
                        }}
                      ></BlogInfo>
                    </div>
                  </div>
                  <div className={style.blogContent}>
                    <div className={style.text}>
                      <ReactMarkdownRender>{contents as string}</ReactMarkdownRender>
                    </div>
                    <div className={style.blogEdit}>
                      <div>
                        <div
                          onClick={() => {
                            modal.confirm({
                              title: '提示',
                              content: '编辑此页会覆盖正在编辑的博客，确定要这么做吗？',
                              onOk: () => {
                                handleEdit();
                              },
                            });
                          }}
                        >
                          <span className="iconfont">&#xe624;</span>&nbsp;编辑此页
                        </div>
                        <div
                          onClick={() => {
                            modal.confirm({
                              title: '提示',
                              content: '是否删除当前博客？',
                              onOk: () => {
                                handleDelete();
                              },
                            });
                          }}
                        >
                          <span className="iconfont" style={{ fontSize: '1.1vw' }}>
                            &#xe604;
                          </span>
                          &nbsp;删除博客
                        </div>
                      </div>
                      <div>
                        <div>
                          上次编辑于：<span>{(publishAt as string).split('T')[0]}</span>
                        </div>
                        <div>
                          贡献者：<span>{author}</span>
                        </div>
                      </div>
                    </div>
                    <div className={style.comment}>
                      <Comment></Comment>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default BlogPage;
