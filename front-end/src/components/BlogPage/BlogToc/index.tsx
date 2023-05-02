import React, { useEffect, useMemo, useState } from 'react';

import style from './index.module.scss';
import { THEME_COLOR } from '@/global';

interface BlogTocProps {
  text: string;
}

const getTitleList = (text: string) => {
  const textList = text.match(/#(.*)/g);
  let newList;
  if (textList)
    newList = textList.map(text => {
      return text.split('#')[1].split('<')[0].trim();
    });
  return newList;
};

const changeColor = (num1: number, num2: number) => {
  const num1Div = document.getElementById(`blog-toc-item-${num1}`) as HTMLElement;
  const num2Div = document.getElementById(`blog-toc-item-${num2}`) as HTMLElement;
  const num1DivChild = num1Div.firstElementChild as HTMLElement;
  const num2DivChild = num2Div.firstElementChild as HTMLElement;
  num1Div.style.borderColor = 'rgba(0, 0, 0, .05)';
  num1DivChild.style.color = 'rgba(0, 0, 0, .4)';
  num2Div.style.borderColor = THEME_COLOR;
  num2DivChild.style.color = THEME_COLOR;
};

const BlogToc: React.FC<BlogTocProps> = ({ text }) => {
  // md忘记antd有toc可以用了，自己写一遍血亏
  const [curChosen, setCurChosen] = useState(0);
  const textList = getTitleList(text);

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
    const content = document.getElementById('blog-page-content-wrapper') as HTMLElement;
    const tocList = textList
      ? textList.map(text => {
          return document.getElementById(text) as HTMLElement;
        })
      : [];
    // 这里不用curChosen,有bug
    let cur = 0;
    const handleScroll = () => {
      tocList.map((toc, index) => {
        // 当滚动高度 >= toc所在位置则改变 - 60 （因为下面-60）
        if (content.scrollTop >= toc.offsetTop - 60) {
          changeColor(cur, index);
          cur = index;
        }
      });
    };
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => {
        content.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  // 动画
  const handleClick = (last: number, nowChosen: number) => {
    // 缓慢滑动
    const curAnchor = document.getElementById((textList as string[])[nowChosen]) as HTMLElement;
    const wrapper = document.getElementById('blog-page-content-wrapper') as HTMLElement;
    wrapper.scrollTo({
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
        {textList
          ? textList.map((text, index) => {
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
          : undefined}
      </>
    </div>
  );
};

export default BlogToc;
