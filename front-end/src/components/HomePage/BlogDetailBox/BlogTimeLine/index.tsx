import React, { MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment';

// antd
import { Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';
import './index.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setTimeLine } from '@/redux/slices/blog';
import { setSelectedId } from '@/redux/slices/blogMenu';

// interface
import { TimeLineObj } from '@/interface';
import { setMobileMenuOpen } from '@/redux/slices/universal';

const BlogTimeLine = () => {
  const timeline = useAppSelector(state => state.blog.timeLine);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // 生成带年份分类的时间轴对象
  const generateTimeLine = (timeline: TimeLineObj[], handleClick: MouseEventHandler) => {
    // timeLine[] 已经按时间新到旧排序
    if (timeline && timeline.length) {
      const list = [];
      timeline.map((item, index) => {
        if (index < timeline.length - 1) {
          const year1 = moment(item.publishAt).format('YYYY');
          const year2 = moment(timeline[index + 1].publishAt).format('YYYY');
          if (year1 !== year2) {
            list.push({
              dot: (
                <div
                  style={{
                    marginTop: '15px',
                    marginLeft: '4px',
                  }}
                >
                  <ClockCircleOutlined style={{ fontSize: '14px' }} />
                </div>
              ),
              children: <div className={style.year}>{year2}</div>,
            });
          }
        }
        list.push({
          dot: <div className={`${style.dot} ${themeMode === 'dark' ? 'dark-3-onforce' : ''}`}></div>,
          children: (
            <div
              id={item.id}
              className={style.itemWrapper}
              // 鼠标移入修改dot颜色
              onMouseEnter={e => {
                const grandParent = (e.currentTarget.parentElement as HTMLElement).parentElement as HTMLElement;
                const dot = grandParent.children[1].children[0];
                dot.classList.add('dot-hover-on-active');
              }}
              onMouseLeave={e => {
                const grandParent = (e.currentTarget.parentElement as HTMLElement).parentElement as HTMLElement;
                const dot = grandParent.children[1].children[0];
                dot.classList.remove('dot-hover-on-active');
              }}
              // click
              onClick={handleClick}
            >
              <span className={style.time}>{moment(item.publishAt).format('M/DD')}</span>
              <span className={style.title}>{item.title}</span>
            </div>
          ),
          color: 'gray',
        });
      });
      list.unshift({
        dot: (
          <div style={{ marginTop: '15px', marginLeft: '4px' }}>
            <ClockCircleOutlined style={{ fontSize: '14px' }} />
          </div>
        ),
        children: <div className={style.year}>{moment(timeline[0].publishAt).format('YYYY')}</div>,
      });
      return list;
    }
    return [];
  };

  useEffect(() => {
    dispatch(setTimeLine());
  }, []);

  return (
    <div className={`${style.wrapper} clearfix`}>
      <Timeline
        mode="left"
        items={generateTimeLine(timeline, e => {
          dispatch(setSelectedId((e.currentTarget as HTMLElement).id));
          dispatch(setMobileMenuOpen(false));
          navigate('/blog');
        })}
      />
    </div>
  );
};

export default BlogTimeLine;
