import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  serviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  clientName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', reviewSchema);
