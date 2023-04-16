import React from 'react';

// redux
import { useAppSelector } from '@/redux';

// css
import style from './index.module.scss';

// interface
import { EmojiProps } from '@/interface';

const Emoji: React.FC<EmojiProps> = props => {
  const { handleClick } = props;
  const emojis = useAppSelector(state => state.emoji.emojiList);

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
