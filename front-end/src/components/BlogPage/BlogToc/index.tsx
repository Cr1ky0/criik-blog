import React, { useState } from 'react';

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
const BlogToc: React.FC<BlogTocProps> = ({ text }) => {
  // md忘记antd有toc可以用了，自己写一遍血亏
  const textList = getTitleList(text);
  const [curChosen, setCurChosen] = useState(0);
  // 动画
  const handleClick = (last: number, nowChosen: number) => {
    const lastDiv = document.getElementById(`blog-toc-item-${last}`) as HTMLElement;
    const nowDiv = document.getElementById(`blog-toc-item-${nowChosen}`) as HTMLElement;
    const lastDivChild = lastDiv.firstElementChild as HTMLElement;
    const nowDivChild = nowDiv.firstElementChild as HTMLElement;
    lastDiv.style.borderColor = 'rgba(0, 0, 0, .05)';
    lastDivChild.style.color = 'rgba(0, 0, 0, .4)';
    nowDiv.style.borderColor = THEME_COLOR;
    nowDivChild.style.color = THEME_COLOR;
    // 缓慢滑动
    const curAnchor = document.getElementById((textList as string[])[nowChosen]) as HTMLElement;
    const wrapper = document.getElementById('blog-page-content-wrapper') as HTMLElement;
    wrapper.scrollTo({
      top: curAnchor.offsetTop,
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
