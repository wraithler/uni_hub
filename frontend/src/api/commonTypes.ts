type Growth = {
  label: string;
  count: number;
  growth: number;
  month: string;
};

type Engagement = {
  idx: number;
  label: string;
  posts: number;
  comments: number;
}

export type { Growth, Engagement };
