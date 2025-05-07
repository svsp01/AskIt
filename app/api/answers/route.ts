import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Answer from '@/models/Answer';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    
    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }
    
    const answers = await Answer.find({ question: questionId })
      .populate('author', 'username name avatarUrl')
      .sort({ isAccepted: -1, voteCount: -1, createdAt: -1 });
    
    return NextResponse.json(answers);
  } catch (error) {
    console.error('Get answers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const user = await auth(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { questionId, content } = await req.json();
    
    const answer = await Answer.create({
      question: questionId,
      content,
      author: user._id,
    });
    
    await answer.populate('author', 'username name avatarUrl');
    
    return NextResponse.json(answer);
  } catch (error) {
    console.error('Create answer error:', error);
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    );
  }
}