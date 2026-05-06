import { Router } from "express";
import JWTService from "../utils/jwt.service";
import AuthMiddleware from "../middlewares/auth.middleware";
import { IChatRepository } from "../../interfaces/repository/IChat.repository.interface";
import { IMessageRepository } from "../../interfaces/repository/IMessage.repository";
import { ChatRepository } from "../../repositories/chat.repository";
import { MessageRepository } from "../../repositories/message.repository";
import IJWTService from "../../interfaces/utils/IJwt.service";
import IAuthMiddleware from "../../interfaces/middleware/IAuth.middleware.interface";
import { ChatUseCase } from "../../usecase/chat.usecase";
import { ChatController } from "../../controller/chat.controller";

const chatRouter: Router = Router();

const chatRepository: IChatRepository = new ChatRepository();
const messageRepository: IMessageRepository = new MessageRepository();
const jwtService: IJWTService = new JWTService();
const authMiddleware: IAuthMiddleware = new AuthMiddleware(jwtService);

const chatUseCase = new ChatUseCase(messageRepository, chatRepository);
const chatController = new ChatController(chatUseCase);

chatRouter.use(authMiddleware.isAuthenticated.bind(authMiddleware));

chatRouter.get('/messages/:chatId', chatController.getMessageHistory.bind(chatController));

export default chatRouter;