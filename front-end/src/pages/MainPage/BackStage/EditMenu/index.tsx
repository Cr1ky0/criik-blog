import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// dnd
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// antd
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Input, Select, TreeSelect, Modal, Button } from 'antd';

// css
import style from './index.module.scss';

// api
import {
  addMenuAjax,
  changeSort,
  deleteMenuAjax,
  getMenuAjax,
  getSelfMenu,
  updateBelong,
  updateMenuAjax,
} from '@/api/menu';
import { changeSortOfBlog, deleteBlogAjax, deleteBlogOfMenuAjax, getCurBlog, updateBelongOfBlogAjax } from '@/api/blog';

//interface
import { SideMenuItem, BlogObj, TreeSelectItem } from '@/interface';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useIcons } from '@/components/ContextProvider/IconStore';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';
import { setAllContent, setCurEditId, setIsEdit } from '@/redux/slices/blog';
import { deleteMenu, setDeleteKey, setDelKind, setSelectedId } from '@/redux/slices/blogMenu';

// utils
import {
  filterLT,
  getAntdIcon,
  getAntdMenus,
  getEditBelongMenuTree,
  getOneBlogId,
  getSideMenuItem,
  getTreeSelectList,
} from '@/utils';

// global
import { colorChoseList } from '@/global';

interface MenuType {
  key: string;
  title: string;
  grade: number;
  color: string;
  sort: number;
  icon: string;
  child: SideMenuItem[];
  blogs: BlogObj[];
}

interface BlogType {
  key: string;
  title: string;
  sort: number;
  menuTitle: string;
  menuIcon: string;
}

interface MenuRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  data: MenuType;
  parentIcon?: string;
  parentTitle?: string;
  parentId?: string;
}

interface BlogRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  data: BlogType;
}

const generateMenuData = (data: SideMenuItem) => {
  return {
    key: data.id,
    title: data.title,
    grade: data.grade,
    color: data.color,
    sort: data.sort,
    icon: data.icon,
    child: data.children,
    blogs: data.blogs,
  } as MenuType;
};

const generateBlogData = (data: BlogObj, menuIcon: string, menuTitle: string) => {
  return { key: data.id, title: data.title, sort: data.sort, menuIcon, menuTitle } as BlogType;
};

// 单个博客行
const BlogRow: React.FC<BlogRowProps> = ({ data }) => {
  const { key, title, sort, menuTitle: mt, menuIcon: mi } = data;
  const navigate = useNavigate();
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const icons = useIcons();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [menuIcon, setMenuIcon] = useState(mi);
  const [menuTitle, setMenuTitle] = useState(mt);
  const antdMenus = getTreeSelectList(menus, icons, true);
  // flag
  const [showEdit, setShowEdit] = useState(false);

  // dnd
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: key,
  });
  const styles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    // cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  // handler
  const handleEdit = () => {
    dispatch(setCurEditId(key));
    getCurBlog(key).then(
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
        navigate('/backstage/blog');
        dispatch(setIsEdit(true));
      },
      err => {
        message.error(err.message);
      }
    );
  };
  const handleDelete = async () => {
    await deleteBlogAjax(
      key,
      async () => {
        await message.loadingSuccessAsync('删除中...', '删除成功');
        // 删除后重新设置selectedId以外的ID（先更新selectedId的话下面的代码的selectedId仍是原来的Id，没做更新）
        const id = getOneBlogId(menus, key);
        dispatch(setSelectedId(id || ''));

        // 设置删除信息
        dispatch(setDelKind('blog'));
        dispatch(setDeleteKey(key));

        // 删除id
        dispatch(deleteMenu(key));
        // navigate(0);
      },
      msg => {
        message.error(msg);
      }
    );
  };

  // main
  return (
    <tr
      ref={setNodeRef}
      className={`${style.tr} ${themeMode === 'dark' ? style.trDark : style.trLight}`}
      style={styles}
      {...attributes}
      {...listeners}
    >
      <td></td>
      <td>{title}</td>
      <td>
        {showEdit ? (
          <TreeSelect
            autoFocus
            treeIcon
            style={{ width: '100%' }}
            placeholder="请选择分类"
            treeLine={true}
            treeData={antdMenus}
            value={menuTitle}
            onChange={id => {
              updateBelongOfBlogAjax(key, id)
                .then(res => {
                  message.success('修改成功，刷新后重置菜单！');
                  const menu = getSideMenuItem(menus, res.data.updatedBlog.belongingMenu) as SideMenuItem;
                  setMenuIcon(menu.icon!);
                  setMenuTitle(menu.title);
                })
                .catch(err => {
                  message.error(err.data.message);
                });
            }}
            onBlur={() => {
              setShowEdit(false);
            }}
          />
        ) : (
          <>
            {getAntdIcon(menuIcon, icons)}&nbsp;&nbsp;
            {menuTitle}&nbsp;
            <span
              className={`${style.editBtn} iconfont`}
              onClick={() => {
                setShowEdit(true);
              }}
            >
              &#xe601;
            </span>
          </>
        )}
      </td>
      <td>{sort || 0}</td>
      <td className={style.actionBtn}>
        <Tooltip title="删除" placement="top">
          <div
            className="iconfont"
            onClick={() => {
              modal.confirm({
                title: '提示',
                content: '是否删除当前博客？',
                centered: true,
                onOk: () => {
                  handleDelete();
                },
              });
            }}
          >
            &#xe604;
          </div>
        </Tooltip>
        <Tooltip title="编辑" placement="top">
          <div
            className="iconfont"
            onClick={() => {
              modal.confirm({
                title: '提示',
                content: '编辑此页会覆盖正在编辑的博客，确定要这么做吗？',
                centered: true,
                onOk: () => {
                  handleEdit();
                },
              });
            }}
          >
            &#xe624;
          </div>
        </Tooltip>
      </td>
    </tr>
  );
};

// 单个菜单行
const MenuRow: React.FC<MenuRowProps> = ({ data, parentTitle, parentId, parentIcon }) => {
  const icons = useIcons();
  const msg = useGlobalMessage();
  const modal = useGlobalModal();
  const { key, title, grade, color, icon, child, blogs } = data;
  const dispatch = useAppDispatch();
  const deleteKey = useAppSelector(state => state.blogMenu.deleteKey);
  const delKind = useAppSelector(state => state.blogMenu.delKind);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [pTitle, setPTitle] = useState(parentTitle);
  const [pIcon, setPIcon] = useState(parentIcon);
  const [pId, setPId] = useState(parentId);
  const [menuData, setMenuData] = useState<MenuType[]>(
    child.map(item => {
      return generateMenuData(item);
    }) || []
  );
  const [blogData, setBlogData] = useState<BlogType[]>(
    blogs.map((blog: BlogObj) => {
      return generateBlogData(blog, icon, title);
    }) || []
  );

  // 选择图标的下拉菜单列表
  const selectIconList = useState(
    icons.map(icon => ({
      value: icon.name,
      label: (
        <>
          {icon.icon} {icon.name}
        </>
      ),
    })) || []
  );

  // 建立子菜单的选择颜色、icon和菜单标题
  const [selectIcon, setSelectIcon] = useState<string>();
  const [selectColor, setSelectColor] = useState<string>();
  const [createTitle, setCreateTitle] = useState<string>();

  // 展开添加子菜单Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // 是否更改拖动排序
  const [isChange, setIsChange] = useState(false);

  // 展开子表
  const [childOpen, setChildOpen] = useState(false);

  // title编辑部分
  const [showTitleEdit, setShowTitleEdit] = useState<boolean>(false);
  const [beforeTitle, setBeforeTitle] = useState<string>(title);
  const [titleValue, setTitleValue] = useState<string>(title);

  const onTitleInputBlur = () => {
    if (titleValue !== beforeTitle) {
      updateMenuAjax(
        { id: key, title: titleValue },
        () => {
          msg.success('修改成功！');
          setBeforeTitle(titleValue);
        },
        content => {
          setTitleValue(beforeTitle);
          msg.error(content);
        }
      );
    }
    setShowTitleEdit(false);
  };

  // color部分
  const [showColorEdit, setShowColorEdit] = useState<boolean>(false);
  const [beforeColor, setBeforeColor] = useState<string>(color);
  const [colorValue, setColorValue] = useState<string>(color);

  const onColorSelectBlur = () => {
    if (colorValue !== beforeColor) {
      updateMenuAjax(
        { id: key, color: colorValue },
        () => {
          msg.success('修改成功！');
          setBeforeColor(colorValue);
        },
        content => {
          setColorValue(beforeColor);
          msg.error(content);
        }
      );
    }
    setShowColorEdit(false);
  };

  // Icon部分
  const [showIconEdit, setShowIconEdit] = useState<boolean>(false);
  const [beforeIcon, setBeforeIcon] = useState<string>(icon);
  const [iconValue, setIconValue] = useState<string>(icon);

  const onIconSelectBlur = () => {
    if (iconValue !== beforeIcon) {
      updateMenuAjax(
        { id: key, icon: iconValue },
        () => {
          msg.success('修改成功！');
          setBeforeIcon(iconValue);
        },
        content => {
          setIconValue(beforeIcon);
          msg.error(content);
        }
      );
    }
    setShowIconEdit(false);
  };

  // BelongMenu部分
  const antdMenus = [
    {
      value: '主菜单',
      title: '主菜单',
      children: getEditBelongMenuTree(getTreeSelectList(menus, icons, true), key),
    },
  ];

  const [showEditBelong, setShowEditBelong] = useState(false);
  const [selectBelong, setSelectBelong] = useState<string>(parentId || '主菜单');

  // dnd
  const [draggable, setDraggable] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: key,
    disabled: !draggable,
  });
  const styles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    // cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setMenuData(prev => {
        const activeIndex = prev.findIndex(i => i.key === active.id);
        const overIndex = prev.findIndex(i => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  const onDragEndOfBlog = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setBlogData(prev => {
        const activeIndex = prev.findIndex(i => i.key === active.id);
        const overIndex = prev.findIndex(i => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  // handler
  // delete menu
  const handleDelete = async () => {
    // 需要删除该菜单下的所有博客以及子菜单
    const item = getSideMenuItem(menus, key as string) as SideMenuItem;
    await deleteMenuAjax(
      item.id,
      async () => {
        // 删除该菜单下的blogs
        await deleteBlogOfMenuAjax(item.id);
        // 删除子菜单和其下的blogs
        if (item.children)
          item.children.map(child => {
            deleteMenuAjax(child.id);
            if (child.blogs && child.blogs.length) deleteBlogOfMenuAjax(child.id);
            // 删除grandChild
            if (child.children)
              child.children.map(grandChild => {
                deleteMenuAjax(grandChild.id);
                if (grandChild.blogs && grandChild.blogs.length) deleteBlogOfMenuAjax(grandChild.id);
              });
          });
        await msg.loadingAsync('删除中...', '删除成功！');
        // 选择新的id
        const id = getOneBlogId(menus, selectedId, item.id);
        dispatch(setSelectedId(id || ''));
        // 更新state
        dispatch(deleteMenu(item.id));

        // 更新删除状态
        dispatch(setDeleteKey(key));
        dispatch(setDelKind('menu'));
      },
      content => {
        msg.error(content);
      }
    );
  };

  // 博客或菜单被删后修改State
  useEffect(() => {
    if (delKind === 'blog') {
      // 由于是递归关系这里修改的值必定是当前menu下的blog，所以不用考虑key的归属问题
      setBlogData(blogData.filter(blog => blog.key !== deleteKey));
    }
    if (delKind === 'menu') {
      setMenuData(menuData.filter(menu => menu.key !== deleteKey));
    }
  }, [deleteKey]);

  // 菜单顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const idList = menuData.map(data => {
        return data.key;
      });
      changeSort(
        idList,
        () => {
          // pass
        },
        err => {
          msg.error(err);
        }
      );
      setIsChange(false);
    }
  }, [menuData]);

  // 博客顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const idList = blogData.map(data => {
        return data.key;
      });
      changeSortOfBlog(
        idList,
        () => {
          // pass
        },
        err => {
          msg.error(err);
        }
      );
      setIsChange(false);
    }
  }, [blogData]);

  return (
    <>
      {/* 父菜单内容 */}
      <tr
        className={`${style.tr} ${themeMode === 'dark' ? style.trDark : style.trLight}`}
        ref={setNodeRef}
        style={styles}
        {...attributes}
        {...listeners}
      >
        <td>
          {menuData.length || blogData.length ? (
            <div
              className={style.expandBtn}
              onClick={() => {
                setChildOpen(!childOpen);
              }}
            >
              {childOpen ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
            </div>
          ) : undefined}
        </td>
        <td>{grade}</td>
        {/* title编辑 */}
        <td>
          {showTitleEdit ? (
            <Input
              showCount
              value={titleValue}
              maxLength={50}
              onChange={e => {
                setTitleValue(e.target.value);
              }}
              autoFocus
              onBlur={onTitleInputBlur}
            />
          ) : (
            <div>
              <span>{titleValue}</span>&nbsp;
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowTitleEdit(true);
                }}
              >
                &#xe601;
              </span>
            </div>
          )}
        </td>
        {/* 标签编辑 */}
        <td>
          {showColorEdit ? (
            <Select
              autoFocus
              value={colorValue}
              style={{ width: 150 }}
              optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
              options={colorChoseList}
              onChange={value => {
                setColorValue(value);
              }}
              onBlur={onColorSelectBlur}
            />
          ) : (
            <div>
              <Tag color={colorValue}>{colorValue}</Tag>
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowColorEdit(true);
                }}
              >
                &#xe601;
              </span>
            </div>
          )}
        </td>
        {/* 图标编辑 */}
        <td>
          {showIconEdit ? (
            <Select
              autoFocus
              value={iconValue}
              style={{ width: 150 }}
              optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
              options={selectIconList[0]}
              onChange={value => {
                setIconValue(value);
              }}
              onBlur={onIconSelectBlur}
            />
          ) : (
            <div>
              {getAntdIcon(iconValue, icons)}&nbsp;&nbsp;
              {iconValue}&nbsp;
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowIconEdit(true);
                }}
              >
                &#xe601;
              </span>
            </div>
          )}
        </td>
        {/* 菜单编辑 */}
        <td>
          {showEditBelong ? (
            <TreeSelect
              autoFocus
              treeIcon
              style={{ width: '100%' }}
              placeholder="请选择分类"
              treeLine={true}
              treeData={antdMenus}
              value={selectBelong}
              onChange={async value => {
                setSelectBelong(value);
                try {
                  if (value === '主菜单') {
                    await updateBelong({ id: key, belongingMenu: value, isMain: true });
                    setPId(undefined);
                    setPIcon(undefined);
                    setPTitle('主菜单');
                  } else {
                    await updateBelong({ id: key, belongingMenu: value });
                    const res = await getMenuAjax(value);
                    const parent = res.data.data.menu;
                    setPId(parent.id);
                    setPTitle(parent.title);
                    setPIcon(parent.icon);
                  }
                  msg.success('修改成功，刷新列表后重置！');
                } catch (err: any) {
                  msg.error(err.data.message);
                }
              }}
              onBlur={() => {
                setShowEditBelong(false);
              }}
            />
          ) : (
            <>
              {pId ? (
                <>
                  <span>{getAntdIcon(pIcon as string, icons)}</span>&nbsp;
                  <span>{pTitle}</span>
                </>
              ) : (
                '主菜单'
              )}
              &nbsp;
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowEditBelong(true);
                }}
              >
                &#xe601;
              </span>
            </>
          )}
        </td>
        <td className={style.actionBtn}>
          <Tooltip title="删除" placement="top">
            <div
              className="iconfont"
              onClick={() => {
                modal.confirm({
                  title: '提示',
                  content: '是否删除当前菜单？注意：删除菜单会删除菜单下的所有内容！',
                  centered: true,
                  onOk: () => {
                    handleDelete();
                  },
                });
              }}
            >
              &#xe604;
            </div>
          </Tooltip>
          {grade !== 3 ? (
            <>
              <Tooltip title="添加子菜单" placement="top">
                <div
                  className="iconfont"
                  onClick={() => {
                    setShowAddModal(true);
                    setDraggable(false);
                  }}
                >
                  &#xe603;
                </div>
              </Tooltip>
              {/* 添加菜单Modal */}
              <Modal
                title="添加子菜单"
                width={400}
                okText="创建"
                cancelText="取消"
                open={showAddModal}
                onCancel={() => {
                  setDraggable(true);
                  setShowAddModal(false);
                }}
                onOk={() => {
                  addMenuAjax(
                    {
                      title: createTitle,
                      grade: grade + 1,
                      icon: selectIcon,
                      color: selectColor,
                      parentId: key,
                    },
                    res => {
                      msg.success('创建成功!');
                      const menu = res.body.menu;
                      menu.children = [];
                      menu.blogs = [];
                      setMenuData([generateMenuData(menu), ...menuData]);
                      setCreateTitle(undefined);
                      setSelectIcon(undefined);
                      setSelectColor(undefined);
                    },
                    err => {
                      msg.error(err);
                    }
                  );
                }}
              >
                <div className={style.selectInput}>
                  <div>选择图标：</div>
                  <Select
                    value={selectIcon}
                    style={{ width: 200 }}
                    optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
                    options={selectIconList[0]}
                    onChange={value => {
                      setSelectIcon(value);
                    }}
                    placeholder="请选择图标"
                  />
                </div>
                <div className={style.selectInput}>
                  <div>标签颜色：</div>
                  <Select
                    value={selectColor}
                    style={{ width: 200 }}
                    optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
                    options={colorChoseList}
                    onChange={value => {
                      setSelectColor(value);
                    }}
                    placeholder="请选择颜色"
                  />
                </div>
                <div className={style.selectInput}>
                  <div>菜单标题：</div>
                  <Input
                    placeholder="请输入菜单标题"
                    style={{ width: 200 }}
                    value={createTitle}
                    onChange={e => {
                      setCreateTitle(e.currentTarget.value);
                    }}
                  ></Input>
                </div>
              </Modal>
            </>
          ) : undefined}
        </td>
      </tr>
      {/* 单个父菜单的博客 */}
      {childOpen && blogData.length ? (
        <tr className={`${style.childTr} ${themeMode === 'dark' ? style.trChildDark : style.trChildLight}`}>
          <td colSpan={7} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndOfBlog}>
              <SortableContext
                // rowKey array
                items={blogData.map(i => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th colSpan={4} style={{ textAlign: 'center' }}>
                        博客列表
                      </th>
                    </tr>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th>博客标题</th>
                      <th>所属菜单</th>
                      <th>排序值</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogData.map(blog => {
                      return <BlogRow key={blog.key} data={blog}></BlogRow>;
                    })}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </td>
        </tr>
      ) : undefined}
      {/* 单个父菜单的子菜单 */}
      {childOpen && menuData.length && grade !== 3 ? (
        <tr className={`${style.childTr} ${themeMode === 'dark' ? style.trChildDark : style.trChildLight}`}>
          <td colSpan={7} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={menuData.map(i => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th colSpan={6} style={{ textAlign: 'center' }}>
                        菜单列表
                      </th>
                    </tr>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th>菜单层级</th>
                      <th>菜单标题</th>
                      <th>标签颜色</th>
                      <th>菜单图标</th>
                      <th>所属菜单</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuData.map(item => {
                      return (
                        <MenuRow
                          key={item.key}
                          data={item}
                          parentIcon={icon}
                          parentTitle={title}
                          parentId={key}
                        ></MenuRow>
                      );
                    })}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </td>
        </tr>
      ) : undefined}
    </>
  );
};

// 总组件
const App: React.FC = () => {
  const msg = useGlobalMessage();
  const dispatch = useAppDispatch();
  const icons = useIcons();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const delKind = useAppSelector(state => state.blogMenu.delKind);
  const deleteKey = useAppSelector(state => state.blogMenu.deleteKey);
  const [menuData, setMenuData] = useState<MenuType[]>([]);
  const [isChange, setIsChange] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // 建立主菜单的选择颜色、icon和菜单标题
  const [selectIcon, setSelectIcon] = useState<string>();
  const [selectColor, setSelectColor] = useState<string>();
  const [createTitle, setCreateTitle] = useState<string>();

  // 选择图标的下拉菜单列表
  const selectIconList = useState(
    icons.map(icon => ({
      value: icon.name,
      label: (
        <>
          {icon.icon} {icon.name}
        </>
      ),
    })) || []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setMenuData(prev => {
        const activeIndex = prev.findIndex(i => i.key === active.id);
        const overIndex = prev.findIndex(i => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  useEffect(() => {
    dispatch(setSelectKey('editmenu'));
  }, []);

  // 博客或菜单被删后修改State
  useEffect(() => {
    if (delKind === 'menu') {
      setMenuData(menuData.filter(menu => menu.key !== deleteKey));
    }
  }, [deleteKey]);

  // 顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const idList = menuData.map(data => {
        return data.key;
      });
      changeSort(
        idList,
        () => {
          // pass
        },
        err => {
          msg.error(err);
        }
      );
      setIsChange(false);
    }
  }, [menuData]);

  useEffect(() => {
    getSelfMenu(
      '',
      res => {
        setMenuData(
          res.body.menus.map((item: SideMenuItem) => {
            return generateMenuData(item);
          })
        );
      },
      err => {
        msg.error(err);
      }
    );
  }, []);

  return (
    <>
      <Tooltip title="添加主菜单">
        <Button
          className={`iconfont ${style.addMain}`}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          &#xe603;
        </Button>
      </Tooltip>
      {/* 添加菜单Modal */}
      <Modal
        title="添加子菜单"
        width={400}
        okText="创建"
        cancelText="取消"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        onOk={() => {
          addMenuAjax(
            {
              title: createTitle,
              grade: 1,
              icon: selectIcon,
              color: selectColor,
            },
            res => {
              msg.success('创建成功!');
              const menu = res.body.menu;
              menu.children = [];
              menu.blogs = [];
              setMenuData([...menuData, generateMenuData(menu)]);
              setCreateTitle(undefined);
              setSelectIcon(undefined);
              setSelectColor(undefined);
            },
            err => {
              msg.error(err);
            }
          );
        }}
      >
        <div className={style.selectInput}>
          <div>选择图标：</div>
          <Select
            value={selectIcon}
            style={{ width: 200 }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={selectIconList[0]}
            onChange={value => {
              setSelectIcon(value);
            }}
            placeholder="请选择图标"
          />
        </div>
        <div className={style.selectInput}>
          <div>标签颜色：</div>
          <Select
            value={selectColor}
            style={{ width: 200 }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={colorChoseList}
            onChange={value => {
              setSelectColor(value);
            }}
            placeholder="请选择颜色"
          />
        </div>
        <div className={style.selectInput}>
          <div>菜单标题：</div>
          <Input
            placeholder="请输入菜单标题"
            style={{ width: 200 }}
            value={createTitle}
            onChange={e => {
              setCreateTitle(e.currentTarget.value);
            }}
          ></Input>
        </div>
      </Modal>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={menuData.map(i => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <table className={style.table} style={{ overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
            <thead>
              <tr
                className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}
                style={{ width: '100%' }}
              >
                <th></th>
                <th>菜单层级</th>
                <th>菜单标题</th>
                <th>标签颜色</th>
                <th>菜单图标</th>
                <th>所属菜单</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {menuData.map(item => {
                return <MenuRow key={item.key} data={item}></MenuRow>;
              })}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default App;
