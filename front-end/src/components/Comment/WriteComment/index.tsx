import React, { useRef } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button } from 'antd';
import Emoji from './Emoji';

const WriteComment = () => {
  const commentRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={`${style.wrapper} clearfix`}>
      <textarea className={style.content} ref={commentRef} name="comment" placeholder="请输入文本" />
      <div className={`${style.funcBar} clearfix`}>
        <div className={style.emoji}>
          <Emoji />
        </div>
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
