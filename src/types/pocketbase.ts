export type UserRecord = {
  id: string;
  email: string;
  name: string;
  created: Date;
};

export type PollRecord = {
  id?: string;
  poll_name: string;
  poll_desc: string;
  expire_at: Date;
  public_can_add: boolean;
  multivote: boolean;
  user_id: string;
  slug: string;
  created_at: Date;
};

export type PollOptionRecord = {
  id?: string;
  poll_id: string;
  option_name: string;
  option_desc: string;
  user_id: string;
  user_voted: boolean;
  can_modify: boolean;
  created_at: Date;
};

export type PollVoteRecord = {
  id?: string;
  poll_id: string;
  polloption_id: string;
  user_id: string;
  created_at: Date;
};
