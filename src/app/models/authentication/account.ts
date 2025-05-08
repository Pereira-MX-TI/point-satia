export interface Account {
  token: string;
  user: User;
  quantity_locations: number;
  api: Api;
}

export interface Api {
  id: string;
  database: string;
  url: string;
  quantity_r: number;
  quantity_w: number;
  logo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type_user: UserType;
  privacy_policy: number;
  image: Image;
}

export interface UserType {
  id: number;
  type_user_name: string;
}

interface Image {
  id: string;
  url: string;
}
