import { NextFunction, Response } from "express";
import IAuthMiddleware from "../../interfaces/middleware/IAuthMiddleware.interface";
import JWTService from "../utils/jwt.service";
import IAuthRequest from "../../interfaces/common/IAuthRequest.interface";
import StatusCodes from "../../constants/auth/statusCodes";
import ErrorMessage from "../../constants/auth/errorMessage";
import { ErrorCode } from "../../constants/auth/errorCode";
import { IPayload } from "../../interfaces/utils/IJwt.service";
import { isObjectIdOrHexString } from "mongoose";

export default class AuthMiddleware implements IAuthMiddleware {
  private jwtService: JWTService;

  constructor(jwtService: JWTService) {
    this.jwtService = jwtService
  }

  isAuthenticated(req: IAuthRequest, res: Response, next: NextFunction): void {

    try {

      const { token } = req.cookies

      if (!token) throw {
        statusCode: StatusCodes.NotFound,
        message: ErrorMessage.NOT_AUTHENTICATED,
        errorCode: ErrorCode.TOKEN_NOT_FOUND
      };

      try {

        const decoded: IPayload = this.jwtService.verifyToken(token);

        if (!isObjectIdOrHexString(decoded.id)) throw {
          statusCode: StatusCodes.BadRequest,
          message: ErrorMessage.NOT_AUTHENTICATED,
          errorCode: ErrorCode.TOKEN_PAYLOAD_NOT_VALID
        };

        req.id = decoded.id

      } catch (error) {
        throw error
      }

      next(); // user is authenticated procced with the actual request

    } catch (error) {
      throw error
    }

  }

}