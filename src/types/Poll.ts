export type Poll = {
  Slug: string;
  PollName: string;
  PollDescription: string;
  UserID: string;
  DateCreated?: string;
  DateExpire: string;
  PublicCanAdd: boolean;
};
