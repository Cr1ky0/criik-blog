import { MouseEventHandler } from 'react';

/* Comment-Comp */

//Emoji
export interface EmojiObj {
  key: string;
  value: string;
}

export interface EmojiProps {
  handleClick: MouseEventHandler<HTMLLIElement>;
}

// SingleComment
export interface SingleCommentProps {
  children?: string;
}
