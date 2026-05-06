import { Request, Response, NextFunction } from "express";
import { IChatUseCase } from "../interfaces/usecase/IChat.usecase.interface";
import IAuthRequest from "../interfaces/common/IAuthRequest.interface";
import StatusCodes from "../constants/auth/statusCodes";

export class ChatController {
  constructor(private chatUseCase: IChatUseCase) {}

  async getMessageHistory(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const messages = await this.chatUseCase.getMessageHistory(chatId, page, limit);
      res.status(StatusCodes.Success).json(messages);
    } catch (error) {
      next(error);
    }
  }
}
