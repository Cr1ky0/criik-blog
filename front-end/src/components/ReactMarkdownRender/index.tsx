import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { nanoid } from 'nanoid';

// util
import { getOffset } from '@/utils';

// markdown
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// css
import 'github-markdown-css';
import './index.scss';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppSelector } from '@/redux';

interface ReactMarkdownWrapperProps {
  children: string;
}

const ReactMarkdownRender: React.FC<ReactMarkdownWrapperProps> = ({ children }) => {
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const fadeOut = useAppSelector(state => state.progressbar.fadeOut);
  return (
    <ReactMarkdown
      className={`markdown-body ${themeMode === 'dark' ? 'markdown-render-dark' : 'markdown-render-light'}`}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const [match, setMatch] = useState(/language-(\w+)/.exec(className || ''));
          const message = useGlobalMessage();
          const [unique] = useState(nanoid());
          const ref = useRef<HTMLDivElement>(null);
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

          useEffect(() => {
            // 当前的wrapper
            const div = document.getElementsByClassName(unique)[0];
            // 当前的funcbar
            const funcBar = ref ? (ref.current as HTMLElement) : undefined;
            const parent = div ? (div.parentElement as HTMLElement) : undefined;
            if (funcBar && parent) {
              const { left, top } = getOffset(parent);
              const parentWidth = parseFloat(window.getComputedStyle(parent).width);
              const selfWidth = parseFloat(window.getComputedStyle(funcBar).width);
              funcBar.style.left = parentWidth + left - selfWidth + 'px';
              funcBar.style.top = top + 15 + 'px';
            }
          }, []);

          useEffect(() => {
            const newMatch = /language-(\w+)/.exec(className || '');
            setMatch(newMatch);
          }, [className]);

          return !inline && match ? (
            <>
              <SyntaxHighlighter
                {...props}
                showLineNumbers
                style={vscDarkPlus}
                language={match[1]}
                className={`syntax-highlighter-wrapper ${unique}`}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              {createPortal(
                <div
                  className={`syntax-highlighter-func-bar-wrapper ${fadeOut ? 'hideCodeClass' : 'showCodeClass'}`}
                  ref={ref}
                >
                  <div
                    className={`iconfont syntax-highlighter-copy-btn-${themeMode === 'dark' ? 'dark' : 'light'}`}
                    onClick={handleClick}
                  >
                    &#xe706;
                  </div>
                  <div className={`syntax-highlighter-code-language-${themeMode === 'dark' ? 'dark' : 'light'}`}>
                    {match[1]}
                  </div>
                </div>,
                document.body
              )}
            </>
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
