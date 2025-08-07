import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle extends Document {
  boltId: number;
  uuid: string;
  model: string;
  year: number;
  regNumber: string;
  state: 'active' | 'inactive' | 'suspended';
  suspensionReason?: string;
  companyId: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  boltId: {
    type: Number,
    required: true,
    unique: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  regNumber: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
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
VehicleSchema.index({ regNumber: 1 });
VehicleSchema.index({ state: 1 });
VehicleSchema.index({ companyId: 1 });
VehicleSchema.index({ uuid: 1 });

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;