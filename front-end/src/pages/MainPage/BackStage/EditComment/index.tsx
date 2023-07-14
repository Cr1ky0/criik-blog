import React, { useEffect } from 'react';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

const EditComment = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectKey('comment'));
  }, []);
  return <div></div>;
};

export default EditComment;
