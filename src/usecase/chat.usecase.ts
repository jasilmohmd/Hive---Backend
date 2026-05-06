import { IChatUseCase } from "../interfaces/usecase/IChat.usecase.interface";
import { IMessage } from "../entity/Message.entity";

import { IChatRepository } from "../interfaces/repository/IChat.repository.interface";
import { Types } from "mongoose";
import { IMessageRepository } from "../interfaces/repository/IMessage.repository";

export class ChatUseCase implements IChatUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private chatRepository: IChatRepository
  ) {}

  async sendMessage(senderId: string, chatId: string, content: string, type: string): Promise<IMessage> {
    // Validate chat exists
    const chat = await this.chatRepository.findChatById(chatId);
    if (!chat) {
      throw new Error('Chat does not exist');
    }

    // For direct messages, verify participants
    if (chat.type === 'direct') {
      const [user1, user2] = chatId.split('_');
      if (senderId !== user1 && senderId !== user2) {
        throw new Error('Unauthorized to send message to this chat');
      }
    }

    const message: IMessage = {
      sender: new Types.ObjectId(senderId),
      chatId,
      content,
      type: type as IMessage['type'],
      timestamp: new Date()
    };

    return this.messageRepository.saveMessage(message);
  }

  async getMessageHistory(chatId: string, page: number = 1, limit: number = 50): Promise <IMessage[]> {
    return this.messageRepository.getMessagesByChatId(chatId, page, limit);
  }
}