import React from 'react';

// css
import style from './index.module.scss';

// antd
import { Popover, Tag } from 'antd';

// interface
import { BlogTagBoxStatistic } from '@/interface';

interface BlogInfoProps {
  statistics?: BlogTagBoxStatistic;
}

const BlogInfo: React.FC<BlogInfoProps> = ({ statistics }) => {
  return (
    <div className={`${style.wrapper} clearfix`}>
      <Popover content="作者信息" trigger="hover" placement="bottom">
        <div>
          <span className="iconfont">&#xe72e;</span>
          <span className={style.author}>{statistics?.author}</span>
        </div>
      </Popover>
      <Popover content="发布时间" trigger="hover" placement="bottom">
        <div className={style.time}>
          <span className="iconfont">&#xe632;</span>
          {statistics?.time}
        </div>
      </Popover>
      <Popover content="浏览量" trigger="hover" placement="bottom">
        <div className={style.views}>
          <span className="iconfont">&#xe66c;</span>
          {statistics?.views}
        </div>
      </Popover>
      <Popover content="分类标签" trigger="hover" placement="bottom">
        <div className={style.classification}>
          <span className="iconfont">&#xe623;</span>
          <Tag color="cyan" style={{ height: '20px', lineHeight: '20px' }}>
            {statistics?.classification}
          </Tag>
        </div>
      </Popover>
    </div>
  );
};

export default BlogInfo;
