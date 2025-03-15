export interface AuthResponse {
  user: any;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}