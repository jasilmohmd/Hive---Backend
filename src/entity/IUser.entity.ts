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
  friendRequests: {
    sender: string;
    status: "pending" | "accepted" | "rejected";
  }[]; // Array of user IDs
  status: "online" | "offline"; // User status
  blocked: string[];
}



export interface ILoginCredentials {
  email: string | undefined;
  password: string | undefined;
}