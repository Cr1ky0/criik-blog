import React, { useEffect } from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

// comp
import ChangeInfo from '@/components/TopHeader/ChangeInfo';

const EditInfo = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectKey('info'));
  }, []);
  return (
    <div className={style.wrapper}>
      <ChangeInfo></ChangeInfo>
    </div>
  );
};

export default EditInfo;
