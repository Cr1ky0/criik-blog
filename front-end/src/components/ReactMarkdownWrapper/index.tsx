import React from 'react';

// markdown
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
// 加入jsx渲染
SyntaxHighlighter.registerLanguage('jsx', jsx);

// css
import 'github-markdown-css';
import './index.scss';

interface ReactMarkdownWrapperProps {
  children: string;
}

const ReactMarkdownWrapper: React.FC<ReactMarkdownWrapperProps> = ({ children }) => {
  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter {...props} style={oneLight} language={match[1]} PreTag="div">
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default ReactMarkdownWrapper;
