import React from 'react';
import { Drawer } from 'antd';

// css
import style from './index.module.scss';
import './antd.scss';

interface ChangeInfoProps {
  open: boolean;
  onClose: () => void;
}

const ChangeInfo: React.FC<ChangeInfoProps> = ({ open, onClose }) => {
  return (
    <>
      <Drawer
        title="Personal Information"
        style={{ border: 'none' }}
        width={400}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      ></Drawer>
    </>
  );
};

export default ChangeInfo;
