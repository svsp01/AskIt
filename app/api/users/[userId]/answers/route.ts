import Answer from '@/models/Answer';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const answers = await Answer.find({ author: params.userId })
      .populate('question')
      .populate('author')
      .sort({ createdAt: -1 });

    return NextResponse.json(answers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}