import React, { useEffect, useState, MouseEventHandler } from 'react';

// css
import style from './index.module.scss';

import axios from 'axios';

interface EmojiObj {
  key: string;
  value: string;
}

interface EmojiProps {
  handleClick: MouseEventHandler<HTMLLIElement>;
}

const Emoji: React.FC<EmojiProps> = props => {
  const [emojis, setEmojis] = useState<EmojiObj[]>([]);
  const { handleClick } = props;

  useEffect(() => {
    axios.get('http://localhost:3002/emoji.json').then(
      response => {
        // 将json转化为对象
        const list: EmojiObj[] = [];
        Object.entries(response.data).map(([key, value]) => {
          list.push({ key, value } as EmojiObj);
        });
        setEmojis(list);
      },
      error => {
        console.log(error);
      }
    );
  }, []);

  return (
    <ul className={`${style.wrapper} clearfix`}>
      {emojis.map(emoji => (
        <li key={emoji.key} onClick={handleClick}>
          {emoji.value}
        </li>
      ))}
    </ul>
  );
};

export default Emoji;
