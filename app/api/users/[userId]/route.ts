import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;

    await connectDB(); // ensure DB is connected

    const user = await User.findById(params.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
