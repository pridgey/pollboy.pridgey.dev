export type Poll = {
  id?: number;
  poll_name: string;
  poll_desc: string;
  expire_at: string;
  created_at: string;
  public_can_add: boolean;
  multivote: boolean;
  user_id: string;
  slug: string;
};
