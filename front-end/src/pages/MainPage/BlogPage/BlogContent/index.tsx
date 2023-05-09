import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment';
import Cookies from 'universal-cookie';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';
import Comment from '@/components/Comment';
import BlogToc from '@/components/BlogPage/BlogToc';

// antd
import { Breadcrumb, Skeleton } from 'antd';

// css
import style from './index.module.scss';

//redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId, deleteMenu } from '@/redux/slices/blogMenu';
import { initWriteContent, setAllContent, setIsEdit } from '@/redux/slices/blog';

// utils
import { filterLT, filterTitle, getBreadcrumbList, getOneBlogId, getSideMenuItem } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { deleteBlogAjax, getCurBlog, updateBlogViewAjax } from '@/api/blog';

// interface
import { SideMenuItem, blogObj } from '@/interface';

const BlogContent = () => {
  const icons = useIcons();
  const message = useGlobalMessage();
  const modal = useGlobalModal();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);

  // 获取面包屑列表
  const breadcrumbList = selectedId ? getBreadcrumbList(menus, selectedId, icons) : [];

  // cookie
  const cookies = new Cookies();
  const user = cookies.get('user');

  // curBlog
  const [curBlog, setCurBlog] = useState<blogObj>({
    id: '',
    _id: '',
    title: '',
    belongingMenu: '',
  });

  useEffect(() => {
    let timer: any;
    setLoading(true);
    getCurBlog(selectedId)
      .then(response => {
        // 加载一次热度+1
        return updateBlogViewAjax(selectedId, response.data.blog.views + 1);
      })
      .then(data => {
        const blog = data.data.updatedBlog;
        // 处理Title
        const contents = filterTitle(blog.contents);
        const newBlog = Object.assign({}, blog, { contents });
        setCurBlog(newBlog);
        timer = setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch(err => {
        message.error(err.message);
      });
    return () => {
      clearTimeout(timer);
    };
  }, [selectedId]);

  const handleEdit = () => {
    getCurBlog(selectedId).then(
      response => {
        const blog = response.data.blog;
        const { belongingMenu, contents, title } = blog;
        const menu = getSideMenuItem(menus, belongingMenu) as SideMenuItem;
        dispatch(
          setAllContent({
            title,
            menuId: menu.id,
            menuTitle: menu.title,
            content: filterLT(contents),
          })
        );
        navigate('/manage');
        dispatch(setIsEdit(true));
      },
      err => {
        message.error(err.message);
      }
    );
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
          navigate(`/blog?id=${id}`);
        }
      },
      msg => {
        message.error(msg);
      }
    );
  };

  return (
    /* Content加载状态 */
    <>
      {loading ? (
        <div style={{ width: '100%', height: '100%', paddingRight: '5vw' }}>
          <Skeleton active />
          <br />
          <Skeleton active />
          <br />
          <Skeleton active />
        </div>
      ) : (
        <div className={`${style.main} clearfix`}>
          <div className={style.blog}>
            <div className={style.breadCrumb}>
              <Breadcrumb
                items={
                  breadcrumbList && breadcrumbList.length
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
              <div className={style.title}>{curBlog.title}</div>
              <div className={style.blogInfo}>
                {curBlog.id ? (
                  <BlogInfo
                    statistics={{
                      id: curBlog.id,
                      author: curBlog.author as string,
                      time: moment(curBlog.publishAt).format('YYYY-MM-DD'),
                      views: curBlog.views as number,
                      likes: curBlog.likes as number,
                      belongingMenu: curBlog.belongingMenu,
                      isCollected: curBlog.isCollected as boolean,
                    }}
                  ></BlogInfo>
                ) : undefined}
              </div>
            </div>
            <div className={style.blogContent}>
              <div className={style.text}>
                <ReactMarkdownRender>{curBlog.contents as string}</ReactMarkdownRender>
              </div>
              {/* 博客编辑选项 */}
              {user ? (
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
                      <span className="iconfont" style={{ fontSize: '0.8vw' }}>
                        &#xe624;
                      </span>
                      &nbsp;
                      <span>编辑此页</span>
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
                      <span className="iconfont">&#xe604;</span>&nbsp;
                      <span>删除博客</span>
                    </div>
                  </div>
                  <div>
                    <div>
                      上次编辑于：<span>{moment(curBlog.updateAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                    <div>
                      贡献者：<span>{curBlog.author}</span>
                    </div>
                  </div>
                </div>
              ) : undefined}
            </div>
            <div className={style.comment}>
              <Comment></Comment>
            </div>
          </div>
          <div className={style.toc}>
            {curBlog.id ? <BlogToc text={curBlog.contents as string}></BlogToc> : undefined}
          </div>
        </div>
      )}
    </>
  );
};

export default BlogContent;
