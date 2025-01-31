import { NextFunction, Request, Response } from "express";
import IAuthController from "../interfaces/controllers/IAuthController.interface";
import StatusCodes from "../constants/auth/statusCodes";
import { ILoginCredentials, IRegisterationCredentials } from "../entity/IUser.entity";
import IAuthUseCase from "../interfaces/usecase/IAuth.usecase.interface";
import SuccessMessage from "../constants/auth/successMessage";
import IAuthRequest from "../interfaces/common/IAuthRequest.interface";

import ErrorMessage from "../constants/auth/errorMessage";
import { ErrorCode } from "../constants/auth/errorCode";

export default class AuthController implements IAuthController {

  private authUsecase: IAuthUseCase

  constructor(authUsecase: IAuthUseCase) {
    this.authUsecase = authUsecase
  }

  // Handle email verification OTP request
  async sendVerificationOTP(req: Request, res: Response, next:NextFunction): Promise<void> {
    
    try {

      const { email, mode  } = req.body;

      await this.authUsecase.sendVerificationOTP(email,mode);
      res.status(StatusCodes.Success).json({
        message: 'OTP sent successfully to your email!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Handle OTP verification
  async verifyOTP(req: Request, res: Response, next:NextFunction): Promise<void> {
    const { email, otp } = req.body;

    try {
      await this.authUsecase.verifyOTP(email, otp);
      res.status(StatusCodes.Success).json({
        message: 'Email verified successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

      const { userName, email, password, confirmPassword } = req.body;


      const registerationCredentials: IRegisterationCredentials = {
        userName,
        email,
        password,
        confirmPassword
      }

      const token: string = await this.authUsecase.handleUserRegister(registerationCredentials);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });

      res.status(StatusCodes.Success).json({
        message: SuccessMessage.REGISTERTATION_SUCCESS,
        token: token
      });

    } catch (error) {
      next(error);
    }

  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const loginCredentials: ILoginCredentials = {
        email: req.body.email,
        password: req.body.password
      }

      const token: string = await this.authUsecase.handleUserLogin(loginCredentials)

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });

      res.status(StatusCodes.Success).json({
        message: SuccessMessage.LOGIN_SUCCESS
      });

    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });

      res.status(StatusCodes.Success).json({
        message: SuccessMessage.LOGOUT_SUCCESS
      });
    } catch (error: any) {
      next(error);
    }
  }

  async isUserAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.cookies;

      await this.authUsecase.isUserAuthenticated(token);

      res.status(StatusCodes.Success).json({
        message: SuccessMessage.USER_AUTHENTICATED
      });
    } catch (error: any) {
      next(error);
    }
  }

  async setNewPassword(req: Request, res: Response, next: NextFunction): Promise<void> {

    try{

      const { email, newPassword, confirmPassword } = req.body;
      await this.authUsecase.setNewPassword(email,newPassword,confirmPassword);
      res.status(StatusCodes.Success).json({
        message: SuccessMessage.PASSWORD_UPDATE_SUCCESS
      });

    }catch(error){
      next(error);
    }

  }

}