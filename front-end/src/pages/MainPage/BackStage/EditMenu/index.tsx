import React, { useEffect, useState } from 'react';

// dnd
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// antd
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

// css
import style from './index.module.scss';

// api
import { changeSort, getSelfMenu } from '@/api/menu';
import { changeSortOfBlog } from '@/api/blog';

//interface
import { SideMenuItem, BlogObj } from '@/interface';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

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
}

interface MenuRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  data: MenuType;
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

const generateBlogData = (data: BlogObj) => {
  return { key: data.id, title: data.title, sort: data.sort } as BlogType;
};

// 单个博客行
const BlogRow: React.FC<BlogRowProps> = ({ data }) => {
  const { key, title, sort } = data;

  // dnd
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: key,
  });
  const styles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr ref={setNodeRef} className={style.tr} style={styles} {...attributes} {...listeners}>
      <td></td>
      <td>{title}</td>
      <td>{sort || 0}</td>
      <td>action</td>
    </tr>
  );
};

// 单个菜单行
const MenuRow: React.FC<MenuRowProps> = ({ data }) => {
  const msg = useGlobalMessage();
  const { key, title, grade, color, sort, icon, child, blogs } = data;
  const [menuData, setMenuData] = useState<MenuType[]>(
    child.map(item => {
      return generateMenuData(item);
    })
  );

  const [blogData, setBlogData] = useState<BlogType[]>(
    blogs.map((blog: BlogObj) => {
      return generateBlogData(blog);
    })
  );

  const [isChange, setIsChange] = useState(false);
  // 展开子表
  const [childOpen, setChildOpen] = useState(false);

  // dnd
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: key,
  });
  const styles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
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
      <tr className={style.tr} ref={setNodeRef} style={styles} {...attributes} {...listeners}>
        <td>
          {child.length || blogs.length ? (
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
        <td>{title}</td>
        <td>{grade}</td>
        <td>
          <Tag color={color}>{color}</Tag>
        </td>
        <td>{sort}</td>
        <td>{icon}</td>
        <td>操作</td>
      </tr>
      {/* 单个父菜单的博客 */}
      {childOpen ? (
        <tr className={style.childTr}>
          <td colSpan={7} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndOfBlog}>
              <SortableContext
                // rowKey array
                items={blogData.map(i => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={style.head}>
                      <th></th>
                      <th colSpan={3} style={{ textAlign: 'center' }}>
                        博客列表
                      </th>
                    </tr>
                    <tr className={style.head}>
                      <th></th>
                      <th>博客标题</th>
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
      {childOpen ? (
        <tr className={style.childTr}>
          <td colSpan={7} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={menuData.map(i => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={style.head}>
                      <th></th>
                      <th colSpan={6} style={{ textAlign: 'center' }}>
                        菜单列表
                      </th>
                    </tr>
                    <tr className={style.head}>
                      <th></th>
                      <th>菜单标题</th>
                      <th>菜单层级</th>
                      <th>标签颜色</th>
                      <th>菜单图标</th>
                      <th>排序值</th>
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
          </td>
        </tr>
      ) : undefined}
    </>
  );
};

// 总组件
const App: React.FC = () => {
  const msg = useGlobalMessage();
  const [menuData, setMenuData] = useState<MenuType[]>([]);
  const [isChange, setIsChange] = useState(false);

  const dispatch = useAppDispatch();

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
    <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={menuData.map(i => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <table className={style.table} style={{ overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
          <thead>
            <tr className={style.head}>
              <th></th>
              <th>菜单标题</th>
              <th>菜单层级</th>
              <th>标签颜色</th>
              <th>菜单图标</th>
              <th>排序值</th>
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
  );
};

export default App;
