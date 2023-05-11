import React, { useEffect, useRef, useState } from 'react';

import BackToTopBtn from '@/components/Universal/BackToTopBtn';

const TestPage = () => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);

  const backToTop = () => {
    (wrapper.current as HTMLDivElement).scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const current = wrapper.current as HTMLDivElement;
    const handler = () => {
      // 总滚动大小 = 总滚动高度 - 视图大小
      // 总滚动大小也放这里设置是因为，有的页面初始化加载时会有loading动画，而loading动画加载会覆盖真正的滚动高度
      setScrollHeight(current.scrollHeight - current.offsetHeight);
      setScrollTop(current.scrollTop);
    };
    current.addEventListener('scroll', handler);
    return () => {
      current.removeEventListener('scroll', handler);
    };
  }, []);
  return (
    <div
      style={{
        width: '100vw',
        height: '95vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#FFF',
      }}
      ref={wrapper}
    >
      <div style={{ height: '50px' }}></div>
      <BackToTopBtn scrollTop={scrollTop} scrollHeight={scrollHeight} onClick={backToTop}></BackToTopBtn>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      <div style={{ wordBreak: 'break-all' }}>AAA</div>
      {/*<div>*/}
      {/*<BlogToc text={testText}></BlogToc>*/}
      {/*<Classification></Classification>*/}
      {/*<BlogTimeLine></BlogTimeLine>*/}
      {/*<LoadingPage></LoadingPage>*/}
      {/*<Page404></Page404>*/}
      {/*<BlogDetailBox></BlogDetailBox>*/}
      {/*<LoadingComp></LoadingComp>*/}
    </div>
  );
};

export default TestPage;
