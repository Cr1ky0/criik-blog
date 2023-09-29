import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

// antd
import { Modal, Timeline, Spin } from 'antd';
import { ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';
import './index.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

// interface
import { ImgObj } from '@/interface/imagesApi';

// api
import { getPhotos } from '@/api/images';

// img
import img from '@/assets/images/timeline.png';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// comp
import TopDisplay from '@/components/TopDisplay';
import Footer from '@/components/Footer';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { setIsLoading } from '@/redux/slices/progressbar';

const TimeLine = () => {
  const dispatch = useAppDispatch();
  const message = useGlobalMessage();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [photos, setPhotos] = useState<ImgObj[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [photoLoad, setPhotoLoad] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const wrapper = useRef<HTMLDivElement>(null);
  const handlePreview = (src: string) => {
    setPreviewOpen(true);
    setPreviewImage(src);
  };

  // 生成带年份分类的时间轴对象
  const generateTimeLine = (timeline: ImgObj[], handlePreview: (src: string) => void) => {
    // timeLine[] 已经按时间新到旧排序
    if (timeline && timeline.length) {
      const list = [];
      timeline.map((item, index) => {
        if (index < timeline.length - 1) {
          const year1 = moment(item.photoTime).format('YYYY');
          const year2 = moment(timeline[index + 1].photoTime).format('YYYY');
          if (year1 !== year2) {
            list.push({
              dot: (
                <div style={{ marginTop: '15px', marginLeft: '4px' }}>
                  <ClockCircleOutlined style={{ fontSize: '14px' }} />
                </div>
              ),
              children: <div className={style.year}>{year2}</div>,
            });
          }
        }
        list.push({
          label: moment(item.photoTime).format('M/DD'),
          dot: <div className={`${style.dot} ${themeMode === 'dark' ? 'dark-3-onforce' : ''}`}></div>,
          children: (
            <div
              id={item._id}
              className={`${style.itemWrapper} showAnime`}
              // click
              onClick={() => {
                handlePreview(item.url + item.filename);
              }}
            >
              <img src={item.url + item.filename} alt="photo" style={{ display: 'block' }} />
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
        children: <div className={style.year}>{moment(timeline[0].photoTime).format('YYYY')}</div>,
      });
      return list;
    }
    return [];
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // 滚动事件
  useEffect(() => {
    // 防抖
    const debounce = (delay: number) => {
      let timer: any = null;
      // 参数放内层，因为是要用到点击事件的值，如果放在外层函数无法获取
      return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const cur = document.documentElement.scrollTop + window.innerHeight + 90;
          // 触发事件
          if (cur >= document.documentElement.scrollHeight) {
            getPhotos(
              {
                page: page + 1,
                limit: 10,
                fields: '',
                sort: '-photoTime',
              },
              async res => {
                if (res.data.images.length) {
                  setPhotoLoad(true);
                  setTimeout(() => {
                    setPhotoLoad(false);
                    setPhotos([...photos, ...res.data.images]);
                    setPage(page + 1);
                  }, 500);
                }
              },
              content => {
                setPhotoLoad(false);
                message.error(content);
              }
            );
          }
        }, delay);
      };
    };

    const handleScroll = debounce(500);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, photos]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    dispatch(setChosenList([false, false, false, true]));
  }, []);

  useEffect(() => {
    getPhotos(
      {
        page: 1,
        limit: 10,
        fields: '',
        sort: '-photoTime',
      },
      res => {
        setPhotos(res.data.images);
      },
      content => {
        message.error(content);
      }
    );
  }, []);

  /// 打开滚动条
  useEffect(() => {
    // 如果先前打开了滚动条要先关闭
    dispatch(setIsLoading(false));
    setTimeout(() => {
      dispatch(setIsLoading(true));
    }, 50);
  }, []);

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : style.wrapperLight}`} ref={wrapper}>
      <TopDisplay img={img}></TopDisplay>
      <div className={`${style.content} ${themeMode === 'dark' ? 'dark-2' : 'light'}`}>
        <div className={loading ? 'loading-active' : 'loading-not-active'}>
          {photos.length ? (
            <Timeline mode="alternate" items={generateTimeLine(photos, handlePreview)} />
          ) : (
            <div className={style.noTimeLine}>当前没有相片轴~</div>
          )}
        </div>
        <div className={photoLoad ? style.load : style.loadHide}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
        </div>
      </div>
      <Footer></Footer>
      <Modal
        destroyOnClose
        open={previewOpen}
        title="Preview"
        footer={null}
        onCancel={() => {
          setPreviewOpen(false);
        }}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};
export default TimeLine;
