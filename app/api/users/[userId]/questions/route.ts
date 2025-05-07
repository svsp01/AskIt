import Question from '@/models/Question';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    console.log('params', params);
    const questions = await Question.find({ author: new ObjectId(params.userId) })
      // .populate('author')
      .sort({ createdAt: -1 });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}