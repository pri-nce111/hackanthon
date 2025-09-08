import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  name?: string;
  language: 'en' | 'hi';
  location?: {
    state?: string;
    district?: string;
    pincode?: string;
  };
  age?: number;
  gender?: 'male' | 'female' | 'other';
  preferences: {
    receiveAlerts: boolean;
    preferredTime: string;
  };
  isActive: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  location: {
    state: String,
    district: String,
    pincode: String
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  preferences: {
    receiveAlerts: {
      type: Boolean,
      default: true
    },
    preferredTime: {
      type: String,
      default: '09:00'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ 'location.state': 1, 'location.district': 1 });

export const User = mongoose.model<IUser>('User', UserSchema);