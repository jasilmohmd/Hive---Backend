import IUser from "../../entity/User.entity";

export default interface IProfileUsecase {
  editProfile(userId: string, newUserName: string): Promise<IUser>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUser>;
}