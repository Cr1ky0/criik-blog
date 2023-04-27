import React from 'react';
import MDEditor from '@uiw/react-md-editor';

// comp
// import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// css
import style from './index.module.scss';
import './editor.scss';

interface MarkdownEditorProps {
  value: string;
  setValue: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = props => {
  const { value, setValue } = props;
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.editor}>
        <MDEditor
          value={value}
          preview="edit"
          onChange={value => {
            setValue(value as string);
          }}
        />
      </div>
      {/* 预览会卡顿暂时不提供 */}
      {/*<div className={style.preview}>*/}
      {/*  <div className={style.previewTips}>预览</div>*/}
      {/*  <ReactMarkdownRender>{preview}</ReactMarkdownRender>*/}
      {/*</div>*/}
    </div>
  );
};
export default MarkdownEditor;
