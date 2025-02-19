import IUser from "../../entity/IUser.entity";

export default interface IProfileRepository {
  editProfile(userId: string, newUserName: string): Promise<IUser>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUser>;
}