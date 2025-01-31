import { ILoginCredentials, IRegisterationCredentials } from "../../entity/IUser.entity";

export default interface IAuthUseCase {
  handleUserRegister(data:IRegisterationCredentials):Promise<string|never>;
  handleUserLogin(data:ILoginCredentials):Promise<string|never>;
  isUserAuthenticated(token: string | undefined): Promise<void | never>;
  sendVerificationOTP(email: string, mode: string): Promise<void | never>;
  verifyOTP(email: string, otp: string): Promise<boolean>
  setNewPassword(email: string, newPassword: string, confirmPassword: string): Promise<void>
}