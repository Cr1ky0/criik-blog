import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';
import Comment from '@/components/Comment';

// antd
import { Skeleton, Breadcrumb } from 'antd';

// css
import style from './index.module.scss';

//redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId, deleteMenu } from '@/redux/slices/blog';
import { initWriteContent, setAllContent, setCurBlog, setIsEdit, setViews, updateCurBlog } from '@/redux/slices/blog';

// utils
import { getBreadcrumbList, getOneBlogId, getSideMenuItem } from '@/utils';
import moment from 'moment';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { deleteBlogAjax, updateBlogAjax } from '@/api/blog';

// interface
import { SideMenuItem } from '@/interface';
import BlogToc from '@/components/BlogPage/BlogToc';

interface BlogPageContentProps {
  setLoading: (state: boolean) => void;
  loading: boolean;
}

const BlogPageContent: React.FC<BlogPageContentProps> = ({ loading, setLoading }) => {
  const message = useGlobalMessage();
  const modal = useGlobalModal();
  const navigate = useNavigate();
  const menus = useAppSelector(state => state.blog.menuList);
  const curBlog = useAppSelector(state => state.blog.curBlog);
  const selectedId = useAppSelector(state => state.blog.selectedId);
  const views = useAppSelector(state => state.blog.views);
  const dispatch = useAppDispatch();
  const { title, contents, author, publishAt, belongingMenu, updateAt } = curBlog;
  const icons = useIcons();
  const breadcrumbList = selectedId ? getBreadcrumbList(menus, selectedId, icons) : undefined;

  useEffect(() => {
    // 组件加载一次热度+1
    if (selectedId) {
      updateBlogAjax(
        {
          blogId: selectedId,
          data: {
            views: views + 1,
          },
        },
        data => {
          const newBlog = data.data.updatedBlog;
          dispatch(setViews(newBlog.views));
        },
        msg => {
          message.error(msg);
        }
      );
    }
  }, []);
  const handleEdit = () => {
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
        } else {
          // 有博客就将curBlog设为该博客
          dispatch(setCurBlog(id));
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      },
      msg => {
        message.error(msg);
      }
    );
  };
  return (
    <div id="blog-page-content-wrapper" className={`${style.content} clearfix`}>
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
            <div className={style.blog}>
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
                      author: author as string,
                      time: moment(publishAt).format('YYYY-MM-DD'),
                      views: views as number,
                      belongingMenu,
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
                      上次编辑于：<span>{moment(updateAt).format('YYYY-MM-DD HH:mm:ss')}</span>
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
            </div>
            <div className={style.toc}>
              <BlogToc text={contents as string}></BlogToc>
            </div>
          </>
        )
      ) : (
        <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>
      )}
    </div>
  );
};

export default BlogPageContent;
