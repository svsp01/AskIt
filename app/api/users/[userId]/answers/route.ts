import { NextRequest, NextResponse } from 'next/server';
import Answer from '@/models/Answer';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const answers = await Answer.find({ author: params.userId })
      .populate('author')
      .populate('question')
      .sort({ createdAt: -1 });

    return NextResponse.json(answers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}