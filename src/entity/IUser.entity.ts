export interface IRegisterationCredentials {
  userName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
}

export default interface IUser {
  _id: string;
  userName: string;
  email: string;
  password: string;
}

export interface ILoginCredentials {
  email: string | undefined;
  password: string | undefined;
}