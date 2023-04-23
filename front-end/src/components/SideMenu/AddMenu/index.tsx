import React, { ReactNode, useCallback, useRef, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// comp
import ChangeFormBox from '@/components/TopHeader/ChangeInfo/ChangeFormBox';

// redux
import { useAppSelector } from '@/redux';

// utils
import { getDataNodeTree } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';

const AddMenu = () => {
  const icons = useIcons();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const antdMenus = getDataNodeTree(menus, icons, true);
  const tagRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);
  const defaultCheck = antdMenus[0];
  const [curKey, setCurKey] = useState<string | number>(defaultCheck.key);
  const [curTitle, setCurTitle] = useState<ReactNode>(defaultCheck.title as ReactNode);
  const changeHeight = useCallback((state: 'edit' | 'del') => {
    const div = document.getElementById('edit-input-Wrapper') as HTMLElement;
    const div2 = document.getElementById('delete-input-Wrapper') as HTMLElement;
    if (state === 'edit') {
      div.style.height = div.scrollHeight + 'px';
      div2.style.height = '0';
    } else {
      div2.style.height = div.scrollHeight + 'px';
      div.style.height = '0';
    }
  }, []);

  const handleEdit = useCallback(() => {
    const ref = tagRef.current as HTMLInputElement;
    console.log(ref.value);
  }, []);

  const handleDelete = useCallback(() => {
    console.log(curKey);
  }, []);

  const handleAdd = useCallback(() => {
    const ref = addRef.current as HTMLInputElement;
    console.log(ref.value);
  }, []);
  return (
    <>
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
      <div id="edit-input-Wrapper" className={style.editInputWrapper}>
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
      <div id="delete-input-Wrapper" className={style.addInputWrapper}>
        <ChangeFormBox
          title=""
          placeHolder={`在${curTitle}下添加子分类`}
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
        <div className={style.addTagBtn}>
          <Button
            type="primary"
            onClick={() => {
              changeHeight('del');
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
