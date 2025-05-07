import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { username, email, password, name } = await req.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      name: name || username,
      avatarUrl: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}