import React, { MouseEventHandler, useCallback, useRef, useState } from 'react';
import Cookies from 'universal-cookie';

// antd
import { Button, Popover } from 'antd';

// css
import style from './index.module.scss';

// comp
import Emoji from './Emoji';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLength, setComments, setIsLoading } from '@/redux/slices/comments';

// api
import { addCommentAjax } from '@/api/comment';

const WriteComment = () => {
  const message = useGlobalMessage();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading1] = useState(false);
  const cookies = new Cookies();
  const user = cookies.get('user');
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const curPage = useAppSelector(state => state.comments.curPage);
  const sort = useAppSelector(state => state.comments.sort);
  const dispatch = useAppDispatch();
  // 向文本框内部添加表情
  const addEmoji: MouseEventHandler<HTMLLIElement> = useCallback(event => {
    const commentNode = commentRef.current as HTMLTextAreaElement;
    commentNode.value = commentNode.value + event.currentTarget.innerHTML;
    setIsOpen(false);
  }, []);

  const handleSubmit = async () => {
    setIsLoading1(true);
    const ref = commentRef.current as HTMLTextAreaElement;
    await addCommentAjax(
      {
        belongingBlog: selectedId,
        contents: ref.value,
        userId: user ? user.id : '644c9a90f43dbdb4dc3296f8', // 没登录统一设为匿名账户
        username: user ? user.name : undefined,
        brief: user ? user.brief : undefined,
      },
      async () => {
        await message.loadingAsync('提交中...', '提交成功');
        ref.value = '';
        dispatch(setIsLoading(true));
        setTimeout(() => {
          dispatch(setIsLoading(false));
        }, 500);
        dispatch(addLength());
        dispatch(
          setComments({
            id: selectedId,
            page: curPage,
            sort: sort === 'time' ? '-publishAt' : '-likes',
          })
        );
        setIsLoading1(false);
      },
      msg => {
        message.error(msg);
        setIsLoading1(false);
      }
    );
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <textarea className={style.content} ref={commentRef} name="comment" placeholder="请输入评论" />
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
