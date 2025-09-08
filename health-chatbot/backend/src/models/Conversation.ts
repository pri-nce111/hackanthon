import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  phoneNumber: string;
  messages: IMessage[];
  status: 'active' | 'completed' | 'escalated';
  language: 'en' | 'hi';
  tags: string[];
  satisfaction?: number;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  intent: String,
  confidence: Number,
  metadata: Schema.Types.Mixed
});

const ConversationSchema = new Schema<IConversation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  messages: [MessageSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'escalated'],
    default: 'active'
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  tags: [String],
  satisfaction: {
    type: Number,
    min: 1,
    max: 5
  },
  resolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ phoneNumber: 1 });
ConversationSchema.index({ status: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);