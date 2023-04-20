import React from 'react';
import { Drawer } from 'antd';

// css
import style from './index.module.scss';
import './antd.scss';

// comp
import IntroductionBox from '@/components/HomePage/IntroductionBox';

interface InformationProps {
  open: boolean;
  onClose: () => void;
}

const Information: React.FC<InformationProps> = ({ open, onClose }) => {
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
      >
        <IntroductionBox isMobile={true}></IntroductionBox>
      </Drawer>
    </>
  );
};

export default Information;
