export type Poll = {
  Slug: string;
  PollName: string;
  PollDescription: string;
  UserID: string;
  DateCreated?: Date;
  DateExpire: string;
  PublicCanAdd: boolean;
};
