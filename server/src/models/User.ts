import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  skinType?: string;
  allergies?: string;
  totalSpent: number;
  role: 'client' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    skinType: { type: String },
    allergies: { type: String },
    totalSpent: { type: Number, default: 0 },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcryptjs.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const { password, ...rest } = this.toObject();
  return rest;
};

export default mongoose.model<IUser>('User', userSchema);
