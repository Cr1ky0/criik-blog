import React, { ReactNode, useCallback, useRef, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Tree, Select, Divider } from 'antd';
import { DownOutlined, CodeOutlined } from '@ant-design/icons';

const Option = Select.Option;

// comp
import ChangeFormBox from '@/components/TopHeader/ChangeInfo/ChangeFormBox';

// redux
import { useAppSelector } from '@/redux';

// utils
import { getDataNodeTree } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';

// api
import { addMenuAjax } from '@/api/menu';

const AddMenu = () => {
  const icons = useIcons();
  const selectIconList = icons.map(icon => ({
    value: icon.name,
    label: (
      <>
        {icon.icon} {icon.name}
      </>
    ),
  }));
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const antdMenus = getDataNodeTree(menus, icons, true);
  const defaultCheck = antdMenus[0];
  const [curKey, setCurKey] = useState<string | number>(defaultCheck ? defaultCheck.key : '');
  const [curTitle, setCurTitle] = useState<ReactNode>(defaultCheck ? (defaultCheck.title as ReactNode) : '');
  const [iconValue, setIconValue] = useState(selectIconList[0].value);
  const tagRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);
  const changeHeight = useCallback((state: 'edit' | 'add') => {
    const div = document.getElementById('edit-input-Wrapper') as HTMLElement;
    const div2 = document.getElementById('add-input-Wrapper') as HTMLElement;
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
    console.log(value);
  };

  const handleEdit = useCallback(() => {
    const ref = tagRef.current as HTMLInputElement;
    console.log(ref.value);
  }, []);

  const handleDelete = useCallback(() => {
    console.log(curKey);
  }, []);

  const handleAdd = useCallback(async () => {
    const ref = addRef.current as HTMLInputElement;
    console.log(ref.value);
    console.log(iconValue);
    // if (!menus.length) {
    //   await addMenuAjax({
    //     title: ref.value,
    //     grade: 1,
    //   });
    // }
  }, [iconValue]);
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
          onClick={(_, node) => {
            setCurKey(node.key);
            setCurTitle(node.title as React.ReactNode);
            console.log(node.icon);
          }}
        />
      ) : (
        <div className={style.noneMenu}>当前没有分类！请添加分类！</div>
      )}
      <div id="edit-input-Wrapper" className={`${style.editInputWrapper} clearfix`}>
        <div className={style.selectBox}>
          <Select
            style={{ width: 200 }}
            dropdownRender={menu => {
              return (
                <>
                  <div style={{ padding: '0 10px' }}>
                    <div>选择图标</div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  {menu}
                </>
              );
            }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={selectIconList}
            onChange={handleChange}
          />
        </div>
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
        ></ChangeFormBox>
      </div>
      <div id="add-input-Wrapper" className={`${style.addInputWrapper} clearfix`}>
        <div className={style.selectBox}>
          <Select
            style={{ width: 200 }}
            defaultValue={selectIconList[0].value}
            dropdownRender={menu => {
              return (
                <>
                  <div style={{ padding: '0 10px' }}>
                    <div>选择图标</div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  {menu}
                </>
              );
            }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={selectIconList}
            onChange={handleChange}
          />
        </div>
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
        ></ChangeFormBox>
      </div>
      <div className={`${style.editTagWrapper} clearfix`}>
        {menus.length ? (
          <>
            <div id="edit-tag-btn" className={style.editTagBtn}>
              <Button
                onClick={() => {
                  changeHeight('edit');
                }}
              >
                Edit
              </Button>
            </div>
            <div id="delete-tag-btn" className={style.deleteTagBtn}>
              <Button danger onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </>
        ) : undefined}
        <div className={style.addTagBtn}>
          <Button
            type="primary"
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
