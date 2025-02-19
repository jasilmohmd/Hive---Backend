import { isObjectIdOrHexString } from "mongoose";
import IProfileUsecase from "../interfaces/usecase/IProfile.usecase.interface";
import ValidationError from "../errors/validationError.error";
import StatusCodes from "../constants/auth/statusCodes";
import { ErrorField } from "../constants/auth/errorField";
import { ErrorCode } from "../constants/auth/errorCode";
import IProfileRepository from "../interfaces/repository/IProfile.repository.interface";
import IUser from "../entity/IUser.entity";

export default class ProfileUSecase implements IProfileUsecase {

  private profileRepository: IProfileRepository;

  constructor(profileRepository: IProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async editProfile(userId: string, newUserName: string): Promise<IUser> {
    if (!isObjectIdOrHexString(userId) || !newUserName) {
      throw new ValidationError({
        statusCode: StatusCodes.BadRequest,
        errorField: ErrorField.USER,
        message: "User ID and new username are required.",
        errorCode: ErrorCode.INVALID_INPUT,
      });
    }
    return await this.profileRepository.editProfile(userId, newUserName);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUser> {
    if (!isObjectIdOrHexString(userId) || !newPassword) {
      throw new ValidationError({
        statusCode: StatusCodes.BadRequest,
        errorField: ErrorField.USER,
        message: "User ID and new password are required.",
        errorCode: ErrorCode.INVALID_INPUT,
      });
    }
    return await this.profileRepository.changePassword(userId, oldPassword, newPassword);
  }

}