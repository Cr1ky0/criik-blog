import React, { ReactNode, useCallback, useRef, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Tree, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
// comp
import ChangeFormBox from '@/components/TopHeader/ChangeInfo/ChangeFormBox';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addMenu, deleteMenu, editMenu } from '@/redux/slices/blogMenu';

// utils
import { generateSideMenuItem, getDataNodeTree, getSideMenuItem } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { addMenuAjax, deleteMenuAjax, updateMenuAjax } from '@/api/menu';

// interface
import { SideMenuItem } from '@/interface';

const EditMenu = () => {
  const dispatch = useAppDispatch();
  const menus = useAppSelector(state => state.blogMenu.menuList);
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
  const [iconValue, setIconValue] = useState('');
  // btn的loading状态
  const [isLoading, setIsLoading] = useState(false);
  const [isDelLoading, setDelLoading] = useState(false);
  // edit下icon为当前选中的图标
  const [curIcon, setCurIcon] = useState<string | undefined>(menus.length ? menus[0].icon : undefined);
  // 当前是否处于edit下
  const [isEdit, setIsEdit] = useState(true);
  // 修改标签的inputRef
  const tagRef = useRef<HTMLInputElement>(null);
  // 添加标签的inputRef
  const addRef = useRef<HTMLInputElement>(null);
  // 添加总标签的inputRef
  const addParentRef = useRef<HTMLInputElement>(null);
  // 动画
  const changeHeight = useCallback((state: 'edit' | 'add' | 'addParent') => {
    const div = document.getElementById('edit-input-Wrapper') as HTMLElement;
    const div2 = document.getElementById('add-input-Wrapper') as HTMLElement;
    const div3 = document.getElementById('select-icon-input-box') as HTMLElement;
    const div4 = document.getElementById('edit-tag-form-wrapper') as HTMLElement;
    const div5 = document.getElementById('add-parent-input-Wrapper') as HTMLElement;
    div3.style.height = '32px';
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

  const handleChange = (value: string) => {
    setIconValue(value);
  };

  const reduxAddState = (state: SideMenuItem) => {
    const { id, belongingMenu, title, icon, grade } = state;
    const sideMenuItem = generateSideMenuItem(id, title, grade, icon, belongingMenu);
    dispatch(addMenu(sideMenuItem));
  };

  const reduxRemoveState = (state: string) => {
    dispatch(deleteMenu(state));
  };

  const handleEdit = async () => {
    const ref = tagRef.current as HTMLInputElement;
    // 未选择图标
    if (!iconValue) {
      message.error('请选择分类标签图标！');
      return;
    }
    // 未填写Title
    if (!ref.value) {
      message.error('请输入标签的标题！');
      return;
    }
    setIsLoading(true);
    await updateMenuAjax(
      { id: curKey, icon: iconValue, title: ref.value },
      async () => {
        await message.success('修改成功！');
        setIsLoading(false);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
    dispatch(editMenu({ id: curKey, title: ref.value, icon: iconValue }));
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
    await deleteMenuAjax(
      item.id,
      async () => {
        await message.success('删除成功！');
        setDelLoading(false);
      },
      content => {
        message.error(content);
        setDelLoading(false);
      }
    );
    // 更新state
    reduxRemoveState(item.id);
  };

  // 在选中的标签下添加子标签
  const handleAdd = async () => {
    const ref = addRef.current as HTMLInputElement;
    // 未选择图标
    if (!iconValue) {
      message.error('请选择分类标签图标！');
      return;
    }
    // 未填写Title
    if (!ref.value) {
      message.error('请输入标签的标题！');
      return;
    }
    // 当没有分类时
    if (!menus.length) {
      message.error('请先添加总分类！');
      return;
    }
    const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
    // 当前选择二级菜单时
    if (item.grade === 2) {
      message.error('二级分类无法再添加分类标签！');
      return;
    }
    setIsLoading(true);
    const response = await addMenuAjax(
      {
        title: ref.value,
        grade: item.grade + 1,
        icon: iconValue,
        parentId: item.id,
      },
      async () => {
        await message.success('添加成功！');
        setIsLoading(false);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
    // 后端发来的新对象，加入state中
    const newMenu = response.body.menu;
    reduxAddState(newMenu);
  };

  const handleAddParent = async () => {
    setIsLoading(true);
    const ref = addParentRef.current as HTMLInputElement;
    const response = await addMenuAjax(
      {
        title: ref.value,
        grade: 1,
        icon: iconValue,
      },
      async () => {
        await message.success('添加成功！');
        setIsLoading(false);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
    const newMenu = response.body.menu;
    reduxAddState(newMenu);
  };

  return (
    <>
      {menus.length ? (
        <Tree
          showLine
          showIcon
          defaultExpandAll
          switcherIcon={<DownOutlined />}
          defaultCheckedKeys={[defaultCheck.key]}
          defaultSelectedKeys={[defaultCheck.key]}
          treeData={antdMenus}
          selectedKeys={curKey ? [curKey] : undefined}
          onClick={(_, node) => {
            const item = getSideMenuItem(menus, node.key as string) as SideMenuItem;
            if (!isEdit && item.grade === 2) {
              // 当前选择二级菜单时
              message.error('二级分类无法再添加分类标签！');
              return;
            }
            setCurIcon((item as SideMenuItem).icon);
            setCurKey(node.key);
            setCurTitle(node.title as React.ReactNode);
          }}
        />
      ) : (
        <div className={style.noneMenu}>当前没有分类，请添加分类！</div>
      )}
      <div id="edit-tag-form-wrapper" className={style.formWrapper}>
        <div id="select-icon-input-box" className={style.selectBox}>
          <div>选择图标：</div>
          <Select
            style={{ width: 200 }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={selectIconList}
            onChange={handleChange}
            placeholder={isEdit ? curIcon : '请选择图标'}
          />
        </div>
        <div id="edit-input-Wrapper" className={`${style.inputWrapper} clearfix`}>
          <ChangeFormBox
            title="Edit"
            placeHolder={curTitle as string}
            isOpen={[true]}
            handleSubmit={handleEdit}
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
      <div className={`${style.editTagWrapper} clearfix`}>
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
              <Button danger onClick={handleDelete} loading={isDelLoading}>
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
