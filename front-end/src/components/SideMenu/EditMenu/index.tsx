import React, { ReactNode, useCallback, useRef, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Tree, Select, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
// comp
import ChangeFormBox from '@/components/TopHeader/ChangeInfo/ChangeFormBox';

// redux
import { useAppSelector } from '@/redux';

// utils
import { getDataNodeTree, getSideMenuItem } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalNotice } from '@/components/ContextProvider/NoticeProvider';

// api
import { addMenuAjax, deleteMenuAjax } from '@/api/menu';

// interface
import { SideMenuItem } from '@/interface';

const AddMenu = () => {
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const notice = useGlobalNotice();
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
  // 修改标签的inputRef
  const tagRef = useRef<HTMLInputElement>(null);
  // 添加标签的inputRef
  const addRef = useRef<HTMLInputElement>(null);
  // 动画
  const changeHeight = useCallback((state: 'edit' | 'add') => {
    const div = document.getElementById('edit-input-Wrapper') as HTMLElement;
    const div2 = document.getElementById('add-input-Wrapper') as HTMLElement;
    const div3 = document.getElementById('select-icon-input-box') as HTMLElement;
    const div4 = document.getElementById('edit-tag-form-wrapper') as HTMLElement;
    div3.style.height = '32px';
    div4.style.border = '1px solid rgba(0,0,0,.2)';
    if (state === 'edit') {
      div.style.height = div.scrollHeight + 'px';
      div2.style.height = '0';
    } else {
      div2.style.height = div2.scrollHeight + 'px';
      div.style.height = '0';
    }
  }, []);

  const handleChange = (value: string) => {
    setIconValue(value);
  };

  const handleEdit = useCallback(() => {
    const ref = tagRef.current as HTMLInputElement;
    console.log(ref.value);
  }, []);

  const handleDelete = async () => {
    const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
    setDelLoading(true);
    await deleteMenuAjax(
      item.id,
      async () => {
        await message.success('删除成功！');
        setDelLoading(false);
      },
      async content => {
        await message.error(content);
        setDelLoading(false);
      }
    );
  };

  // 在选中的标签下添加子标签
  const handleAdd = async () => {
    const ref = addRef.current as HTMLInputElement;
    // 未选择图标
    if (!iconValue) {
      notice.openNotice('error', '操作错误', '请选择分类标签图标！');
      return;
    }
    // 未填写Title
    if (!ref.value) {
      notice.openNotice('error', '操作错误', '请输入标签的标题！');
      return;
    }
    // 当没有分类时
    if (!menus.length) {
      setIsLoading(true);
      await addMenuAjax(
        {
          title: ref.value,
          grade: 1,
          icon: iconValue,
        },
        async () => {
          await message.success('添加成功！');
          setIsLoading(false);
        },
        async content => {
          await message.error(content);
          setIsLoading(false);
        }
      );
    } else {
      const item = getSideMenuItem(menus, curKey as string) as SideMenuItem;
      // 当前选择二级菜单时
      if (item.grade === 2) {
        notice.openNotice('error', '操作错误', '二级分类无法再添加分类标签！');
        return;
      }
      setIsLoading(true);
      await addMenuAjax(
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
        async content => {
          await message.error(content);
          setIsLoading(false);
        }
      );
    }
  };
  return (
    <>
      {menus.length ? (
        //   TODO:设置不能取消选择
        <Tree
          showLine
          showIcon
          defaultExpandAll
          switcherIcon={<DownOutlined />}
          defaultCheckedKeys={[defaultCheck.key]}
          defaultSelectedKeys={[defaultCheck.key]}
          treeData={antdMenus}
          onClick={(_, node) => {
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
          />
        </div>
        <div id="edit-input-Wrapper" className={`${style.editInputWrapper} clearfix`}>
          <ChangeFormBox
            title=""
            placeHolder={curTitle as string}
            isOpen={[true]}
            handleSubmit={handleEdit}
            ref={tagRef}
            type="text"
            name="brief"
            seq={1}
            single={true}
            okText="修改"
            isLoading={isLoading}
          ></ChangeFormBox>
        </div>
        <div id="add-input-Wrapper" className={`${style.addInputWrapper} clearfix`}>
          <ChangeFormBox
            title=""
            placeHolder={curTitle ? `在${curTitle}下添加子分类` : `添加新分类`}
            isOpen={[true]}
            handleSubmit={handleAdd}
            ref={addRef}
            type="text"
            name="brief"
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
              changeHeight('add');
            }}
          >
            添加分类
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddMenu;
