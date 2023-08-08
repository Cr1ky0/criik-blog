export interface SearchBlogObj {
  blog_id: string;
  belong_menu_id: string;
  title: string;
  content: string;
  match_kind: 'both' | 'content' | 'title';
}

export interface SearchResultObj {
  menu_title: string;
  blogs: SearchBlogObj[];
}

export interface SearchHistoryObj {
  blog: SearchBlogObj;
  match: string;
}
