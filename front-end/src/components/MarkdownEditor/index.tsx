import React, { useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

// css
import './editor.scss';
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setContent } from '@/redux/slices/blog';

const MarkdownEditor = () => {
  const { content } = useAppSelector(state => state.blog.writeContent);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const textarea = document.getElementsByClassName('w-md-editor-text-input')[0];
    const toolbar = document.getElementsByClassName('w-md-editor-toolbar')[0];
    if (themeMode === 'dark') {
      textarea.classList.add(style.textDark);
      textarea.classList.remove(style.textLight);
      toolbar.classList.add(style.toolbarDark);
      toolbar.classList.remove(style.toolbarLight);
    } else {
      textarea.classList.add(style.textLight);
      textarea.classList.remove(style.textDark);
      toolbar.classList.add(style.toolbarLight);
      toolbar.classList.remove(style.toolbarDark);
    }
  }, [themeMode]);
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.editor}>
        <MDEditor
          className={themeMode === 'dark' ? style.dark : style.light}
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
