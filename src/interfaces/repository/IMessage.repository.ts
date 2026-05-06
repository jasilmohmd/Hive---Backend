import { IMessage } from "../../entity/Message.entity";


export interface IMessageRepository {
  saveMessage(message: IMessage): Promise<IMessage>;
  getMessagesByChatId(chatId: string, page: number, limit: number): Promise<IMessage[]>;
  editMessage(messageId: string, newContent: string): Promise<IMessage | null>;
}