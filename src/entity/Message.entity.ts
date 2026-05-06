import { Types } from "mongoose";


export interface IMessage {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  chatId: string; // references Chat.chatId
  content: string;
  type: 'text' | 'emoji' | 'image' | 'video' | 'audio' | 'file'; // expand as needed
  edited?: boolean;
  timestamp: Date;
}