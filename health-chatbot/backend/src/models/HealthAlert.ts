import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthAlert extends Document {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'outbreak' | 'vaccination' | 'prevention' | 'general';
  location: {
    state?: string;
    district?: string;
    pincode?: string;
    nationwide?: boolean;
  };
  language: 'en' | 'hi' | 'both';
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  sentCount: number;
  targetAudience?: {
    ageRange?: { min: number; max: number };
    gender?: 'male' | 'female' | 'other';
  };
  source: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthAlertSchema = new Schema<IHealthAlert>({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  type: {
    type: String,
    enum: ['outbreak', 'vaccination', 'prevention', 'general'],
    required: true
  },
  location: {
    state: String,
    district: String,
    pincode: String,
    nationwide: {
      type: Boolean,
      default: false
    }
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'both'],
    default: 'both'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  sentCount: {
    type: Number,
    default: 0
  },
  targetAudience: {
    ageRange: {
      min: Number,
      max: Number
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    }
  },
  source: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

HealthAlertSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
HealthAlertSchema.index({ 'location.state': 1, 'location.district': 1 });
HealthAlertSchema.index({ type: 1, severity: 1 });

export const HealthAlert = mongoose.model<IHealthAlert>('HealthAlert', HealthAlertSchema);