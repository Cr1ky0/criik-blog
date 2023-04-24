import React from 'react';

// markdown
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// css
import './index.scss';

interface ReactMarkdownWrapperProps {
  children: string;
}

const ReactMarkdownWrapper: React.FC<ReactMarkdownWrapperProps> = ({ children }) => {
  return (
    <div id="react-markdown-wrapper-avoid-conflict">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkToc]}
        rehypePlugins={[rehypeKatex, remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter {...props} style={a11yDark} language={match[1]} PreTag="div">
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
    </div>
  );
};

export default ReactMarkdownWrapper;
