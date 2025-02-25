import IUser from "../../entity/User.entity";

export default interface IAuthRepository{
  isUserExist(email: string, userName: string): Promise<IUser | null | never>
  saveOTP(email: string, otp: string, mode: string): Promise<void>
  clearOTP(email: string): Promise<void>
  createUser(data:Omit<IUser, "_id">): Promise<IUser | never>
  updateUserStatus(userId: string, status: "online" | "offline"): Promise<void>
  getUserDetails(userId: string): Promise<IUser | never>
  getUserDataByEmail(email: string): Promise<IUser | null | never>
  updatePassword(userId: string, hashedPassword: string): Promise<Document | null>
}