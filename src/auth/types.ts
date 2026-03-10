export type JwtPayload = {
  userId: string;
  email: string;
  roles: string[];
  scopes: string[];
};

export type AuthUser = {
  userId: string;
  email: string;
  roles: string[];
  scopes: string[];
};
