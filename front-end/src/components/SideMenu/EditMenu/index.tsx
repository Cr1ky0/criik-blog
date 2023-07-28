import React, { ReactNode, useCallback, useRef, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Tree, Select, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// comp
import ChangeFormBox from '@/components/TopHeader/ChangeInfo/ChangeFormBox';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addMenu, deleteMenu, editMenu, setSelectedId } from '@/redux/slices/blogMenu';

// utils
import { getDataNodeTree, getOneBlogId, getOneMenuId, getSideMenuItem, hasCurKey } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { addMenuAjax, deleteMenuAjax, updateMenuAjax } from '@/api/menu';
import { deleteBlogOfMenuAjax } from '@/api/blog';

// interface
import { SideMenuItem } from '@/interface';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';

// global
import { colorChoseList } from '@/global';

const EditMenu = () => {
  const dispatch = useAppDispatch();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const message = useGlobalMessage();
  // 选择图标的下拉菜单列表
  const icons = useIcons();
  const selectIconList = icons.map(icon => ({
    value: icon.name,
    label: (
      <>
        {icon.icon} {icon.name}
      </>
    ),
  }));
  // 分类标签选择树列表
  const antdMenus = getDataNodeTree(menus, icons, true);
  // 默认选中的TreeData
  const defaultCheck = antdMenus[0];
  // 当前选择的标签
  const [curKey, setCurKey] = useState<string | number>(defaultCheck ? defaultCheck.key : '');
  // 当前选择的标签的Title
  const [curTitle, setCurTitle] = useState<ReactNode>(defaultCheck ? (defaultCheck.title as ReactNode) : '');
  // 当前选择的icon的value
  const [iconValue, setIconValue] = useState<string | undefined>(undefined);
  // 当前选择的color的Value
  const [colorValue, setColorValue] = useState<string | undefined>(undefined);
  // btn的loading状态
  const [isLoading, setIsLoading] = useState(false);
  const [isDelLoading, setDelLoading] = useState(false);
  // edit下icon为当前选中的图标
  const [curIcon, setCurIcon] = useState<string | undefined>(menus.length ? menus[0].icon : undefined);
  // edit下color
  const [curColor, setCurColor] = useState<string | undefined>(menus.length ? menus[0].color : undefined);
  // 当前是否处于edit下
  const [isEdit, setIsEdit] = useState(true);
  // 修改标签的inputRef
  const tagRef = useRef<HTMLInputElement>(null);
  // 添加标签的inputRef
  const addRef = useRef<HTMLInputElement>(null);
  // 添加总标签的inputRef
  const addParentRef = useRef<HTMLInputElement>(null);
  const modal = useGlobalModal();
  // 动画
  const changeHeight = useCallback((state: 'edit' | 'add' | 'addParent') => {
    const div = document.getElementById('edit-input-Wrapper') as HTMLElement;
    const div2 = document.getElementById('add-input-Wrapper') as HTMLElement;
    const div3 = document.getElementById('select-icon-input-box') as HTMLElement;
    const div4 = document.getElementById('edit-tag-form-wrapper') as HTMLElement;
    const div5 = document.getElementById('add-parent-input-Wrapper') as HTMLElement;
    div3.style.height = '105px';
    div4.style.border = '1px solid rgba(0,0,0,.2)';
    if (state === 'edit') {
      setIsEdit(true);
      div.style.height = div.scrollHeight + 'px';
      div2.style.height = '0';
      div5.style.height = '0';
    } else if (state === 'add') {
      setIsEdit(false);
      div2.style.height = div2.scrollHeight + 'px';
      div.style.height = '0';
      div5.style.height = '0';
    } else {
      setIsEdit(false);
      div5.style.height = div.scrollHeight + 'px';
      div.style.height = '0';
      div2.style.height = '0';
    }
  }, []);

  // edit menu
  const handleEdit = async () => {
    const ref = tagRef.current as HTMLInputElement;
    setIsLoading(true);
    await updateMenuAjax(
      { id: curKey, icon: iconValue, title: ref.value, color: colorValue },
      async () => {
        await message.loadingSuccessAsync('修改中...', '修改成功！');
        dispatch(editMenu({ id: curKey, title: ref.value, icon: iconValue, color: colorValue }));
        setIsLoading(false);
        setCurTitle(ref.value);
        setCurIcon(iconValue);
        setCurColor(colorValue);
        ref.value = '';
        setIconValue(undefined);
        setColorValue(undefined);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
  };

  // delete menu
  const handleDelete = async () => {
    setDelLoading(true);
    // 需要删除该菜单下的所有博客以及子菜单
    const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
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
        await message.loadingAsync('删除中...', '删除成功！');
        // 选择新的id
        const id = getOneBlogId(menus, selectedId, item.id);
        dispatch(setSelectedId(id || ''));
        // 更新state
        dispatch(deleteMenu(item.id));
        // 重新设置curKey
        if (hasCurKey(item, curKey)) {
          const id = getOneMenuId(menus);
          const item = getSideMenuItem(menus, id);
          setCurKey(id);
          if (item) setCurTitle(item.title);
        }
        setDelLoading(false);
      },
      content => {
        message.error(content);
        setDelLoading(false);
      }
    );
  };

  // 在选中的标签下添加子标签
  const handleAdd = async () => {
    const ref = addRef.current as HTMLInputElement;
    // 当没有分类时
    if (!menus.length) {
      message.error('请先添加总分类！');
      return;
    }
    const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
    // // 当前选择二级菜单时
    // if (item.grade === 2) {
    //   message.error('二级分类无法再添加分类标签！');
    //   return;
    // }
    setIsLoading(true);
    await addMenuAjax(
      {
        title: ref.value,
        grade: (item.grade as number) + 1,
        icon: iconValue,
        color: colorValue,
        parentId: item.id,
      },
      async data => {
        await message.loadingSuccessAsync('操作中...', '添加成功！');
        // 后端发来的新对象，加入state中
        const newMenu = data.body.menu;
        dispatch(addMenu(newMenu));
        setIsLoading(false);
        ref.value = '';
        setIconValue(undefined);
        setColorValue(undefined);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
  };

  const handleAddParent = async () => {
    const ref = addParentRef.current as HTMLInputElement;
    setIsLoading(true);
    await addMenuAjax(
      {
        title: ref.value,
        grade: 1,
        icon: iconValue,
        color: colorValue,
      },
      async data => {
        await message.loadingSuccessAsync('操作中...', '添加成功！');
        const newMenu = data.body.menu;
        if (!curKey) {
          setCurKey(newMenu.id);
          setCurTitle(newMenu.title);
        }
        dispatch(addMenu(newMenu));
        setIsLoading(false);
        ref.value = '';
        setIconValue(undefined);
        setColorValue(undefined);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      {menus.length ? (
        // 有menus才显示，否则显示提示
        <Tree
          showLine
          showIcon
          switcherIcon={<DownOutlined />}
          defaultCheckedKeys={[defaultCheck.key]}
          defaultSelectedKeys={[defaultCheck.key]}
          treeData={antdMenus}
          selectedKeys={curKey ? [curKey] : undefined}
          onClick={(_, node) => {
            const item = getSideMenuItem(menus, node.key as string) as SideMenuItem;
            if (!isEdit && item.grade === 3) {
              // 当前选择二级菜单时
              message.error('三级分类无法再添加分类标签！');
              return;
            }
            setCurIcon((item as SideMenuItem).icon);
            setCurColor((item as SideMenuItem).color);
            setCurKey(node.key);
            setCurTitle(node.title as React.ReactNode);
          }}
        />
      ) : (
        <div className={style.noneMenu}>当前没有分类，请添加分类！</div>
      )}

      {/* 表单栏 */}
      <div id="edit-tag-form-wrapper" className={style.formWrapper}>
        <div id="select-icon-input-box" className={style.selectBox}>
          <div>
            <div>选择图标：</div>
            <Select
              value={iconValue}
              style={{ width: 200 }}
              optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
              options={selectIconList}
              onChange={value => {
                setIconValue(value);
              }}
              placeholder={isEdit ? curIcon : '请选择图标'}
            />
          </div>
          <div>
            <div>标签颜色：</div>
            <Select
              value={colorValue}
              style={{ width: 200 }}
              optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
              options={colorChoseList}
              onChange={value => {
                setColorValue(value);
              }}
              placeholder={isEdit ? curColor : '请选择颜色'}
            />
          </div>
        </div>
        <div id="edit-input-Wrapper" className={`${style.inputWrapper} clearfix`}>
          <ChangeFormBox
            title="Edit"
            placeHolder={curTitle as string}
            isOpen={[true]}
            handleSubmit={() => {
              modal.confirm({
                title: '提示',
                content: '确定要更新分类吗？',
                onOk: () => {
                  handleEdit();
                },
              });
            }}
            ref={tagRef}
            type="text"
            seq={1}
            single={true}
            okText="修改"
            isLoading={isLoading}
          ></ChangeFormBox>
        </div>
        <div id="add-input-Wrapper" className={`${style.inputWrapper} clearfix`}>
          <ChangeFormBox
            title="Add Child Tag"
            placeHolder={curTitle ? `在${curTitle}下添加子分类` : `添加新分类`}
            isOpen={[true]}
            handleSubmit={handleAdd}
            ref={addRef}
            type="text"
            seq={1}
            single={true}
            okText="添加"
            isLoading={isLoading}
          ></ChangeFormBox>
        </div>
        <div id="add-parent-input-Wrapper" className={`${style.inputWrapper} clearfix`}>
          <ChangeFormBox
            title="Add Parent Tag"
            placeHolder={`添加新的总分类`}
            isOpen={[true]}
            handleSubmit={handleAddParent}
            ref={addParentRef}
            type="text"
            seq={1}
            single={true}
            okText="添加"
            isLoading={isLoading}
          ></ChangeFormBox>
        </div>
      </div>
      {/* 最下排按钮*/}
      <div className={`${style.editTagWrapper} clearfix`}>
        {/* 有menu才显示edit和delete 否则不显示*/}
        {menus.length ? (
          <>
            <div className={style.editTagBtn}>
              <Button
                onClick={() => {
                  changeHeight('edit');
                }}
                style={{ marginLeft: '5px' }}
              >
                Edit
              </Button>
            </div>
            <div className={style.deleteTagBtn}>
              <Button
                danger
                onClick={() => {
                  modal.confirm({
                    title: '提示',
                    content: '该操作会删除分类下的所有内容，确定要删除分类吗？',
                    onOk: () => {
                      handleDelete();
                    },
                  });
                }}
                loading={isDelLoading}
              >
                Delete
              </Button>
            </div>
          </>
        ) : undefined}
        <div className={style.addTagBtn}>
          <Button
            onClick={() => {
              changeHeight('addParent');
            }}
          >
            添加总分类
          </Button>
          <Button
            onClick={() => {
              changeHeight('add');
              if (defaultCheck) setCurKey(curKey ? curKey : defaultCheck.key);
            }}
          >
            添加子分类
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditMenu;
