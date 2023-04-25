import React, { Component } from 'react';
import { Select, Form, Divider } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useIcons } from '@/components/ContextProvider/IconStore';

const Option = Select.Option;

const Demo = () => {
  const items = [
    { code: 201, text: 'text1 code' },
    { code: 202, text: 'text2 code' },
    { code: 203, text: 'text3 code' },
    { code: 204, text: 'text4 code' },
    { code: 205, text: 'text5 code' },
    { code: 206, text: 'text6 code' },
  ];
  const icons = useIcons();

  // 以下是函数组件中，返回的select部分jsx
  return (
    <Select
      style={{ width: 200 }}
      placeholder="custom dropdown render"
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
      optionLabelProp="title" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
    >
      {icons.map((icon: { name: string; icon: React.ReactNode }, index: number) => (
        <Option key={index} value={icon.name} title={icon.name}>
          <span>{icon.icon}</span>&nbsp;
          <span>{icon.name}</span>
        </Option>
      ))}
    </Select>
  );
};

export default Demo;
