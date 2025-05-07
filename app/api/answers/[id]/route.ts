import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Answer from '@/models/Answer';
import { auth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const user = await auth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    const answer = await Answer.findByIdAndUpdate(
      id,
      { content: body.content },
      { new: true }
    ).populate('author', 'username name avatarUrl');

    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Update answer error:', error);
    return NextResponse.json(
      { error: 'Failed to update answer' },
      { status: 500 }
    );
  }
}