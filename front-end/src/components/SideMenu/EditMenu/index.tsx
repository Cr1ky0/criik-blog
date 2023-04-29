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
import { addMenu, deleteMenu, editMenu, setSelectedId } from '@/redux/slices/blogMenu';

// utils
import { generateSideMenuItem, getDataNodeTree, getOneBlogId, getSideMenuItem } from '@/utils';

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

  // 选择icon的input改变时处理
  const handleChange = (value: string) => {
    setIconValue(value);
  };

  // redux操作
  const reduxAddState = (state: SideMenuItem) => {
    const { id, belongingMenu, title, icon, grade } = state;
    const sideMenuItem = generateSideMenuItem(id, title, grade, icon, belongingMenu);
    dispatch(addMenu(sideMenuItem));
  };

  // edit menu
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
        await message.loadingSuccessAsync('修改中...', '修改成功！');
        dispatch(editMenu({ id: curKey, title: ref.value, icon: iconValue }));
        setIsLoading(false);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
  };

  // delete menu
  const handleDelete = async () => {
    // TODO:当删除包含选中的blog的菜单时切换selectedId
    setDelLoading(true);
    const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
    await deleteMenuAjax(
      item.id,
      async () => {
        await message.loadingSuccessAsync('删除中...', '删除成功！');
        // 选择新的id
        const id = getOneBlogId(menus, selectedId, item.id);
        dispatch(setSelectedId(id || ''));
        // 更新state
        dispatch(deleteMenu(item.id));
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
    await addMenuAjax(
      {
        title: ref.value,
        grade: item.grade ? item.grade + 1 : 1,
        icon: iconValue,
        parentId: item.id,
      },
      async data => {
        await message.loadingSuccessAsync('操作中...', '添加成功！');
        // 后端发来的新对象，加入state中
        const newMenu = data.body.menu;
        reduxAddState(newMenu);
        setIsLoading(false);
      },
      content => {
        message.error(content);
        setIsLoading(false);
      }
    );
  };

  const handleAddParent = async () => {
    const ref = addParentRef.current as HTMLInputElement;
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
    await addMenuAjax(
      {
        title: ref.value,
        grade: 1,
        icon: iconValue,
      },
      async data => {
        await message.loadingSuccessAsync('操作中...', '添加成功！');
        const newMenu = data.body.menu;
        reduxAddState(newMenu);
        setIsLoading(false);
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

      {/* 表单栏 */}
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
