import { MessageModel } from "../framework/models/message.model";
import { IMessage } from "../entity/Message.entity";
import { IMessageRepository } from "../interfaces/repository/IMessage.repository";

export class MessageRepository implements IMessageRepository {
  async saveMessage(message: IMessage): Promise<IMessage> {
    const newMessage = new MessageModel(message);
    return await newMessage.save();
  }

  async getMessagesByChatId(chatId: string, page: number = 1, limit: number = 50): Promise<IMessage[]> {
    return MessageModel.find({ chatId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async editMessage(messageId: string, newContent: string): Promise<IMessage | null> {
    return MessageModel.findByIdAndUpdate(
      messageId,
      { content: newContent, edited: true },
      { new: true }
    );
  }
}