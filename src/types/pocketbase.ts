export type ForumRecord = {
  id?: string;
  name: string;
  open: boolean;
  description: string;
  user: string;
  slug: string;
  banner?: string;
  created?: Date;
  updated?: Date;
};
