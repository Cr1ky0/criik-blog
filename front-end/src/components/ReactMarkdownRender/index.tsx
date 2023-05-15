import React, { useEffect } from 'react';

// markdown
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

// 加入其他语言渲染
SyntaxHighlighter.registerLanguage('jsx', jsx);

// css
import 'github-markdown-css';
import './index.scss';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface ReactMarkdownWrapperProps {
  children: string;
}

const ReactMarkdownRender: React.FC<ReactMarkdownWrapperProps> = ({ children }) => {
  let count = 0;
  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const message = useGlobalMessage();
          // copy点击事件
          const handleClick = () => {
            // 复制到粘贴板
            const clipboardObj = navigator.clipboard;
            const value = String(children).replace(/\n$/, '');
            clipboardObj.writeText(value).then(
              () => {
                message.success('已粘贴到粘贴板');
              },
              () => {
                message.error('粘贴失败');
              }
            );
          };
          // 这里利用原生js在代码块右上角插入一个代码所用语言的提示块和copy btn
          useEffect(() => {
            const codeBox = document.getElementsByClassName('syntax-highlighter-wrapper');
            if (codeBox[count] && match) {
              const parent = codeBox[count].parentElement as HTMLElement;
              parent.style.position = 'relative';
              // wrapper
              const wrapper = document.createElement('div');
              wrapper.className = 'syntax-highlighter-func-bar-wrapper';
              parent.insertAdjacentElement('afterbegin', wrapper);
              // code language
              const div = document.createElement('div');
              div.className = 'syntax-highlighter-code-language';
              div.innerHTML = match[1];
              wrapper.insertAdjacentElement('afterbegin', div);
              // copy btn
              const copyBtn = document.createElement('div');
              copyBtn.className = 'iconfont syntax-highlighter-copy-btn';
              copyBtn.innerHTML = '&#xe706;';
              copyBtn.addEventListener('click', handleClick);
              wrapper.insertAdjacentElement('afterbegin', copyBtn);
              count += 1;
            }
            return () => {
              removeEventListener('click', handleClick);
            };
          }, []);
          return !inline && match ? (
            <SyntaxHighlighter {...props} style={oneLight} language={match[1]} className="syntax-highlighter-wrapper">
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

export default ReactMarkdownRender;
