import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';
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
      <div className={style.preview}>
        <div className={style.previewTips}>预览</div>
        <ReactMarkdownRender>{value}</ReactMarkdownRender>
      </div>
    </div>
  );
};
export default MarkdownEditor;
