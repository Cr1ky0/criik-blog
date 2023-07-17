import React, { useEffect, useState } from 'react';

import style from './index.module.scss';
import { THEME_COLOR } from '@/global';
import { useBlogPageContentWrapper } from '@/pages/MainPage/BlogPage';

interface BlogTocProps {
  text: string;
}

const getTitleList = (text: string) => {
  // Delete code blocks
  const codeBlocksRemoved = text.replace(/```[^`]*```|~~~[^~]*~~~/gs, '');

  // Find titles
  const titles = codeBlocksRemoved.match(/^(#{1,})(?:\s+)(.*)$/gm);

  const filterList = titles
    ? titles.map(title => {
        return title.replace(/^[#]+/g, '').trim();
      })
    : [];
  return filterList.map(title => {
    return title.split('<')[0].trim();
  });
};

const BlogToc: React.FC<BlogTocProps> = ({ text }) => {
  // md忘记antd有toc可以用了，自己写一遍血亏
  const [curChosen, setCurChosen] = useState(0);
  const textList = getTitleList(text);
  const changeColor = (num1: number, num2: number) => {
    const num1Div = document.getElementById(`blog-toc-item-${num1}`) as HTMLElement;
    const num2Div = document.getElementById(`blog-toc-item-${num2}`) as HTMLElement;
    if (num1Div && num2Div) {
      const num1DivChild = num1Div.firstElementChild as HTMLElement;
      const num2DivChild = num2Div.firstElementChild as HTMLElement;
      num1Div.style.borderColor = 'rgba(0, 0, 0, .05)';
      num1DivChild.style.color = 'rgba(0, 0, 0, .4)';
      num2Div.style.borderColor = THEME_COLOR;
      num2DivChild.style.color = THEME_COLOR;
    }
  };

  // BlogPage 的Ref
  const scrollWrapper = useBlogPageContentWrapper().current.current as HTMLElement;

  useEffect(() => {
    const textList = getTitleList(text);
    // 初始化重置toc
    const divList = textList
      ? textList.map((_, index) => {
          return document.getElementById(`blog-toc-item-${index}`);
        })
      : [];
    if (divList.length) {
      divList.map((div, index) => {
        if (index === 0) {
          (div as HTMLElement).style.borderColor = THEME_COLOR;
          ((div as HTMLElement).firstElementChild as HTMLElement).style.color = THEME_COLOR;
        } else {
          (div as HTMLElement).style.borderColor = 'rgba(0, 0, 0, .05)';
          ((div as HTMLElement).firstElementChild as HTMLElement).style.color = 'rgba(0, 0, 0, .4)';
        }
      });
    }

    // 滚动切换
    // 必须放在内部，不然刷新就没了
    const tocList = textList
      ? textList.map(text => {
          return document.getElementById(text) as HTMLElement;
        })
      : [];
    // 这里要用防抖而不是节流，因为判断的是最终状态（不过必须滚动完才设置状态）
    const debounce = () => {
      let timer: any;
      // 这里不用curChosen,有bug
      let cur = 0;
      return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          // 逻辑处理
          if (tocList && tocList.length) {
            if (scrollWrapper.scrollTop <= tocList[0].offsetTop) {
              changeColor(cur, 0);
              cur = 0;
            } else {
              tocList.map((toc, index) => {
                // 当滚动高度 >= toc所在位置则改变 - 60 （因为下面-60）
                if (scrollWrapper.scrollTop >= toc.offsetTop - 60 && textList) {
                  changeColor(cur, index);
                  cur = index;
                }
              });
            }
          }
        }, 300);
      };
    };
    const debounceFunc = debounce();

    if (scrollWrapper) {
      scrollWrapper.addEventListener('scroll', debounceFunc);
      return () => {
        scrollWrapper.removeEventListener('scroll', debounceFunc);
      };
    }
  }, []);

  // 动画
  const handleClick = (last: number, nowChosen: number) => {
    // 缓慢滑动
    const curAnchor = document.getElementById((textList as string[])[nowChosen]) as HTMLElement;
    scrollWrapper.scrollTo({
      top: curAnchor.offsetTop - 60,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.tocHeader}>
        <span>此页内容 </span>
        <span className="iconfont">&#xe640;</span>
      </div>
      <>
        {textList ? (
          textList.map((text, index) => {
            return (
              <div key={index} id={`blog-toc-item-${index}`} className={style.item}>
                <a
                  // href={`#${text}`}
                  onClick={() => {
                    // 此时curChosen的颜色退去，index的颜色出现
                    handleClick(curChosen, index);
                    setCurChosen(index);
                  }}
                >
                  {text}
                </a>
              </div>
            );
          })
        ) : (
          <div style={{ marginLeft: '20px' }}>
            <span>无标题</span>
          </div>
        )}
      </>
    </div>
  );
};

export default BlogToc;
