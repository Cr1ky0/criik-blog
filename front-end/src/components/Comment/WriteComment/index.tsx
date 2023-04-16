import React, { MouseEventHandler, useEffect, useRef } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Popover } from 'antd';

// comp
import Emoji from './Emoji';
import { useAppDispatch } from '@/redux';
import { setEmoji } from '@/redux/slices/emoji';

const WriteComment = () => {
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setEmoji());
  }, []);
  // 向文本框内部添加表情
  const addEmoji: MouseEventHandler<HTMLLIElement> = event => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const commentNode = commentRef.current!;
    commentNode.value = commentNode.value + event.currentTarget.innerHTML;
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <textarea className={style.content} ref={commentRef} name="comment" placeholder="请输入文本" />
      <div className={`${style.funcBar} clearfix`}>
        <Popover
          placement="bottomLeft"
          content={<Emoji handleClick={addEmoji} />}
          trigger="click"
          style={{ boxShadow: '0 0 1px rgba(0,0,0,.5)' }}
        >
          <div className={style.emoji}>
            <span className="iconfont" style={{ fontSize: '32px' }}>
              &#xe618;
            </span>
          </div>
        </Popover>

        <div className={style.submit}>
          <Button size="middle">登录</Button>&nbsp;
          <Button type="primary" size="middle">
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;
