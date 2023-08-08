import React, { useMemo, useState } from 'react';

// antd
import { CloseOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

// comp
import SearchList from '@/components/ElasticSearch/SearchList';
import SearchHistory from '@/components/ElasticSearch/SearchHistory';

// api
import { searchDoc } from '@/api/es';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

//global
import { BREAK_POINT } from '@/global';

// interface
import { SearchResultObj } from '@/interface/es';

const ElasticSearch = () => {
  const msg = useGlobalMessage();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const searchHistory = useAppSelector(state => state.es.history);
  const { width } = useViewport();
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResultObj[]>([]);
  // 用来修改input value以及判断x是否显示
  const [searchContent, setSearchContent] = useState('');
  // 用来判断延迟展示结果的Content
  const [resultContent, setResultContent] = useState('');
  // 用来判断是否显示结果（避免一开始输入就显示）
  const [showResult, setShowResult] = useState(false);

  // 输入事件
  const debounce = () => {
    let timer: string | number | NodeJS.Timeout | null | undefined;
    return (match: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clearTimeout(timer);
      timer = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!match) return;
        setLoading(true);
        searchDoc(
          match,
          res => {
            setSearchResult(res.data.final);
            setResultContent(match);
            setShowResult(true);
          },
          err => {
            msg.error(err);
          },
          () => {
            setTimeout(() => {
              setLoading(false);
            }, 300);
          }
        );
      }, 1000);
    };
  };

  const debounceFunc = useMemo(() => {
    return debounce();
  }, []);

  const deleteResult = () => {
    setSearchContent('');
    setShowResult(false);
  };

  return (
    <>
      <div
        className={`${style.wrapper} ${themeMode === 'dark' ? style.dark : style.light}`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className={`${style.icon} iconfont`}>&#xe6d4;</div>
        <div className={style.title}>搜索</div>
      </div>
      <div
        className={`${style.searcher} ${open ? style.open : style.close}`}
        onClick={() => {
          if (!isDragging) {
            // 实际逻辑
            setOpen(false);
          }
          setIsDragging(false);
        }}
      >
        <div
          className={`${style.searchBox} ${themeMode === 'dark' ? style.darkSearcher : style.lightSearcher}`}
          onClick={e => {
            // 注意在内部阻止事件传播，不是在外部定义onClick时
            // 但是此时如果在内部元素点击后移入外部元素后仍然会触发外部click事件，这里用isDragging标志来解决
            e.stopPropagation(); // 阻止事件传播，以免在点searchBox时关闭
          }}
          onMouseDown={() => {
            setIsDragging(true);
          }}
          onMouseUp={() => {
            setIsDragging(false);
          }}
        >
          <div className={`${style.input} ${themeMode === 'dark' ? style.inputDark : style.inputLight}`}>
            <div>
              {loading ? (
                <div className={`iconfont ${style.rotate}`}>&#xe8fc;</div>
              ) : (
                <div className="iconfont">&#xe6d4;</div>
              )}
            </div>
            <input
              type="text"
              placeholder="搜索"
              value={searchContent}
              onChange={e => {
                const match = e.currentTarget.value;
                setSearchContent(match);
                if (!match) setShowResult(false);
                debounceFunc(match);
              }}
            />
            {searchContent ? (
              <div onClick={deleteResult}>
                <CloseOutlined style={{ fontSize: width > BREAK_POINT ? 18 : 14 }} />
              </div>
            ) : undefined}
          </div>
          <div className={style.content} style={{ paddingBottom: showResult ? 15 : undefined }}>
            {showResult ? (
              searchResult.length ? (
                <>
                  {searchResult.map((searchObj, index) => {
                    return (
                      <SearchList
                        key={index}
                        searchObj={searchObj}
                        match={resultContent}
                        closeBox={() => {
                          setOpen(false);
                        }}
                      ></SearchList>
                    );
                  })}
                </>
              ) : (
                <div className={style.noResult}>
                  <svg
                    className={themeMode === 'dark' ? style.darkFont : style.lightFont}
                    width={width > BREAK_POINT ? 40 : 30}
                    height={width > BREAK_POINT ? 40 : 30}
                    viewBox="0 0 20 20"
                    fill="none"
                    fillRule="evenodd"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"></path>
                  </svg>
                  <div className={themeMode === 'dark' ? 'dark-font' : 'light-font'}>
                    没有找到相关结果：{`"${resultContent}"`}
                  </div>
                </div>
              )
            ) : searchHistory.length ? (
              <SearchHistory closeBox={deleteResult}></SearchHistory>
            ) : (
              <div className={style.noContent}>
                <div className={themeMode === 'dark' ? style.darkFont : style.lightFont}>没有搜索记录</div>
              </div>
            )}
          </div>
          <div className={style.footer}>
            <div>搜索提供者</div>
            <div>
              <span className="iconfont">&#xeb84;</span>&nbsp;
              <span>ElasticSearch</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElasticSearch;
