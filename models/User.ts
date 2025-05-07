import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  name: String,
  bio: String,
  avatarUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
   try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

let User: any;

try {
  // Try to get existing model
  User = mongoose.model('User');
} catch {
  // Model doesn't exist, create new one
  User = mongoose.model('User', userSchema);
}

export default User;
