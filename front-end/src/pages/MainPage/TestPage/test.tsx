import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdownWrapper from '@/components/ReactMarkdownRender';

export default function MdEditor() {
  const [value, setValue] = React.useState('**Hello world!!!**');
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={value => {
          setValue(value as string);
        }}
      />
      <ReactMarkdownWrapper>{value}</ReactMarkdownWrapper>
    </div>
  );
}
