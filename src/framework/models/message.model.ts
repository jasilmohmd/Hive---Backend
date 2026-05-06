import mongoose, { Schema, Document, Types } from 'mongoose';
import { IMessage } from '../../entity/Message.entity';


const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'emoji', 'image', 'video', 'audio', 'file'], default: 'text' },
    edited: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Add indexes
MessageSchema.index({ chatId: 1, timestamp: -1 }); // For message history queries
MessageSchema.index({ sender: 1 }); // If you need to query by sender

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
