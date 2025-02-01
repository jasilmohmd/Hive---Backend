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
  friends: string[]; // Array of user IDs
  friendRequests: string[]; // Array of user IDs
  status: "online" | "offline"; // User status
}



export interface ILoginCredentials {
  email: string | undefined;
  password: string | undefined;
}