import React from 'react';

// css
import style from './index.module.scss';

// antd
import { Popover, Tag } from 'antd';

// util
import { getLimitString } from '@/utils';

// interface
import { BlogTagBoxStatistic } from '@/interface';

export interface BlogTagBoxProps {
  children: string;
  title: string;
  statistics?: BlogTagBoxStatistic;
}

// 主页的BlogBox组件
const BlogTagBox: React.FC<BlogTagBoxProps> = props => {
  const { children, title, statistics } = props;
  const limit = 400; // 超过400字加`...`
  return (
    <div className={style.wrapper}>
      <div className={style.titleWrapper}>
        <div className={style.title}>
          {title}
          <div className={style.bar}></div>
        </div>
        <div className={`${style.pin} iconfont`}>&#xe637;</div>
      </div>
      <div className={style.text}>{getLimitString(limit, children)}</div>
      <div className={style.line}></div>
      <div className={`${style.statistics} clearfix`}>
        <Popover content="作者信息" trigger="hover">
          <div>
            <span className="iconfont">&#xe72e;</span>
            <span className={style.author}>{statistics?.author}</span>
          </div>
        </Popover>
        <Popover content="发布时间" trigger="hover">
          <div className={style.time}>
            <span className="iconfont">&#xe632;</span>
            {statistics?.time}
          </div>
        </Popover>
        <Popover content="浏览量" trigger="hover">
          <div className={style.views}>
            <span className="iconfont">&#xe66c;</span>
            {statistics?.views}
          </div>
        </Popover>
        <Popover content="分类标签" trigger="hover">
          <div className={style.classification}>
            <span className="iconfont">&#xe623;</span>
            <Tag color="cyan" style={{ height: '20px', lineHeight: '20px' }}>
              {statistics?.classification}
            </Tag>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default BlogTagBox;
