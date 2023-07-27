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

//interface
import { SideMenuItem } from '@/interface';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

interface DataType {
  key: string;
  title: string;
  grade: number;
  color: string;
  sort: number;
  child: SideMenuItem[];
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  data: DataType;
}

const generateData = (
  key: string,
  title: string,
  grade: number,
  color: string,
  sort: number,
  child: SideMenuItem[]
) => {
  return { key, title, grade, color, sort, child };
};

const Row: React.FC<RowProps> = ({ data }) => {
  const msg = useGlobalMessage();
  const { key, title, grade, color, sort, child } = data;
  const [dataSource, setDataSource] = useState<DataType[]>(
    child.map(item => {
      return generateData(item.id, item.title, item.grade!, item.color!, item.sort!, item.children!);
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
      setDataSource(prev => {
        const activeIndex = prev.findIndex(i => i.key === active.id);
        const overIndex = prev.findIndex(i => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  // 顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const idList = dataSource.map(data => {
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
  }, [dataSource]);

  return (
    <>
      <tr className={style.tr} ref={setNodeRef} style={styles} {...attributes} {...listeners}>
        <td>
          {child.length ? (
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
      </tr>
      {childOpen ? (
        <tr className={style.childTr}>
          <td colSpan={5} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={dataSource.map(i => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={style.head}>
                      <th></th>
                      <th>菜单标题</th>
                      <th>菜单层级</th>
                      <th>标签颜色</th>
                      <th>排序顺序</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSource.map(item => {
                      return <Row key={item.key} data={item}></Row>;
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
  const [dataSource, setDataSource] = useState<DataType[]>([]);
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
      setDataSource(prev => {
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
      const idList = dataSource.map(data => {
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
  }, [dataSource]);

  useEffect(() => {
    getSelfMenu(
      '',
      res => {
        setDataSource(
          res.body.menus.map((item: SideMenuItem) => {
            return generateData(item.id, item.title, item.grade!, item.color!, item.sort!, item.children!);
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
        items={dataSource.map(i => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <table className={style.table}>
          <thead>
            <tr className={style.head}>
              <th></th>
              <th>菜单标题</th>
              <th>菜单层级</th>
              <th>标签颜色</th>
              <th>排序顺序</th>
            </tr>
          </thead>
          <tbody>
            {dataSource.map(item => {
              return <Row key={item.key} data={item}></Row>;
            })}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
};

export default App;
