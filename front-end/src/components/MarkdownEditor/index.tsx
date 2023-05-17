import React from 'react';
import MDEditor from '@uiw/react-md-editor';

// css
import style from './index.module.scss';
import './editor.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setContent } from '@/redux/slices/blog';

const MarkdownEditor = () => {
  const { content } = useAppSelector(state => state.blog.writeContent);
  const dispatch = useAppDispatch();
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.editor}>
        <MDEditor
          value={content}
          preview="edit"
          onChange={value => {
            dispatch(setContent(value));
          }}
        />
      </div>
    </div>
  );
};
export default MarkdownEditor;
