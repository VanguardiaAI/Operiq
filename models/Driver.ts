import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDriver extends Document {
  driverUuid: string;
  partnerUuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: 'active' | 'inactive' | 'suspended';
  hasCashPayment: boolean;
  suspensionReason?: string;
  companyId: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  driverUuid: {
    type: String,
    required: true,
    unique: true,
  },
  partnerUuid: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    required: true,
  },
  hasCashPayment: {
    type: Boolean,
    required: true,
  },
  suspensionReason: {
    type: String,
    required: false,
  },
  companyId: {
    type: Number,
    required: true,
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Índices para búsquedas eficientes
DriverSchema.index({ email: 1 });
DriverSchema.index({ phone: 1 });
DriverSchema.index({ state: 1 });
DriverSchema.index({ companyId: 1 });
DriverSchema.index({ driverUuid: 1 });
DriverSchema.index({ firstName: 'text', lastName: 'text' });

const Driver: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);

export default Driver;