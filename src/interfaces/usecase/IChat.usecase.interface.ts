import { IMessage } from "../../entity/Message.entity";


export interface IChatUseCase {
  sendMessage(senderId: string, chatId: string, content: string, type: string): Promise<IMessage>;
  getMessageHistory(chatId: string, page: number, limit: number): Promise<IMessage[]>;
}