import React, { MouseEventHandler, useCallback, useRef, useState } from 'react';
import Cookies from 'universal-cookie';

// antd
import { Button, Popover, Input, InputRef } from 'antd';

// css
import style from './index.module.scss';

// comp
import Emoji from './Emoji';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLength, setComments, setIsLoading, addReply } from '@/redux/slices/comments';

// api
import { addCommentAjax, filterCommentAjax } from '@/api/comment';
import { addReplyAjax } from '@/api/reply';

interface WriteCommentProps {
  belongingComment?: string;
}

const WriteComment: React.FC<WriteCommentProps> = ({ belongingComment }) => {
  const message = useGlobalMessage();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const userNameRef = useRef<InputRef>(null);
  const userBriefRef = useRef<InputRef>(null);
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

  // 正常提交
  const handleSubmit = async () => {
    setIsLoading1(true);
    const comment = commentRef.current as HTMLTextAreaElement;
    const username = (userNameRef.current as InputRef).input as HTMLInputElement;
    const brief = (userBriefRef.current as InputRef).input as HTMLInputElement;
    try {
      if (!comment.value) {
        message.error('请输入评论！');
        setIsLoading1(false);
        return;
      }
      const res = await filterCommentAjax(comment.value);
      // 是否违规
      const data = res.data.data;
      const type = data.conclusion_type;
      const dataObj = data.data[0];
      if (type.toString() === '1')
        if (belongingComment)
          await addReplyAjax(
            {
              belongingComment,
              contents: comment.value,
              userId: user ? user.id : undefined,
              brief: user ? user.brief : brief.value ? brief.value : undefined,
              username: user ? user.name : username.value ? username.value : '匿名',
              userRole: user ? user.role : 'visitor',
            },
            async data => {
              await message.loadingAsync('提交中...', '提交成功');
              comment.value = '';
              dispatch(setIsLoading(true));
              setTimeout(() => {
                dispatch(setIsLoading(false));
              }, 500);
              dispatch(addReply({ belongingComment, newReply: data.data.reply }));
              setIsLoading1(false);
            },
            msg => {
              message.error(msg);
              setIsLoading1(false);
            }
          );
        else
          await addCommentAjax(
            {
              belongingBlog: selectedId,
              contents: comment.value,
              userId: user ? user.id : undefined,
              brief: user ? user.brief : brief.value ? brief.value : undefined,
              username: user ? user.name : username.value ? username.value : '匿名',
              userRole: user ? user.role : 'visitor',
            },
            async () => {
              await message.loadingAsync('提交中...', '提交成功');
              comment.value = '';
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
      else {
        message.error(`评论包含敏感词: ${dataObj.words[0]} ,请重新编辑后发送！`);
        setIsLoading1(false);
      }
    } catch (err: any) {
      message.error(err.message);
      setIsLoading1(false);
    }
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.infoInput}>
        <div>
          <Input className={style.input} placeholder="昵称" ref={userNameRef} />
        </div>
        <div>
          <Input className={style.input} placeholder="个人签名" ref={userBriefRef} />
        </div>
      </div>
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
          <Button type="primary" size="middle" loading={isLoading} onClick={handleSubmit}>
            {belongingComment ? '回复' : '提交'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;
