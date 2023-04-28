import React, { MouseEventHandler, useCallback, useRef, useState } from 'react';
import Cookies from 'universal-cookie';

// antd
import { Button, Popover } from 'antd';

// css
import style from './index.module.scss';

// comp
import Emoji from './Emoji';

// redux
import { useAppSelector } from '@/redux';
import { addCommentAjax } from '@/api/comment';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const WriteComment = () => {
  const message = useGlobalMessage();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cookies = new Cookies();
  const user = cookies.get('user');
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  // 向文本框内部添加表情
  const addEmoji: MouseEventHandler<HTMLLIElement> = useCallback(event => {
    const commentNode = commentRef.current as HTMLTextAreaElement;
    commentNode.value = commentNode.value + event.currentTarget.innerHTML;
    setIsOpen(false);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const ref = commentRef.current as HTMLTextAreaElement;
    await addCommentAjax(
      {
        belongingBlog: selectedId,
        contents: ref.value,
        username: user ? user.name : undefined,
        brief: user ? user.brief : undefined,
      },
      async () => {
        await message.loadingAsync('提交中...', '提交成功');
        ref.value = '';
        setIsLoading(false);
      },
      msg => {
        message.error(msg);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <textarea className={style.content} ref={commentRef} name="comment" placeholder="请输入文本" />
      <div className={`${style.funcBar} clearfix`}>
        <Popover
          placement="bottomLeft"
          content={<Emoji handleClick={addEmoji} />}
          open={isOpen}
          style={{ boxShadow: '0 0 1px rgba(0,0,0,.5)' }}
        >
          <div
            className={style.emoji}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span className="iconfont" style={{ fontSize: '32px' }}>
              &#xe618;
            </span>
          </div>
        </Popover>

        <div className={style.submit}>
          <Button size="middle">登录</Button>&nbsp;
          <Button type="primary" size="middle" loading={isLoading} onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;
