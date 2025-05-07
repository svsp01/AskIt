import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Answer from '@/models/Answer';
import Question from '@/models/Question';
import { auth } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = await auth(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const answer = await Answer.findById(params.id);
    
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }
    
    // Check ownership
    if (answer.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to update this answer' },
        { status: 403 }
      );
    }
    
    const { content } = await req.json();
    
    answer.content = content;
    await answer.save();
    
    await answer.populate('author', 'username name avatarUrl');
    
    return NextResponse.json(answer);
  } catch (error) {
    console.error('Update answer error:', error);
    return NextResponse.json(
      { error: 'Failed to update answer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = await auth(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const answer = await Answer.findById(params.id);
    
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }
    
    // Check ownership
    if (answer.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to delete this answer' },
        { status: 403 }
      );
    }
    
    await answer.deleteOne();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete answer error:', error);
    return NextResponse.json(
      { error: 'Failed to delete answer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = await auth(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const answer = await Answer.findById(params.id)
      .populate('question');
    
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the question author
    const question = await Question.findById(answer.question);
    if (!question || question.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to accept this answer' },
        { status: 403 }
      );
    }
    
    // Remove accepted status from other answers
    await Answer.updateMany(
      { question: question._id },
      { isAccepted: false }
    );
    
    // Accept this answer
    answer.isAccepted = true;
    await answer.save();
    
    await answer.populate('author', 'username name avatarUrl');
    
    return NextResponse.json(answer);
  } catch (error) {
    console.error('Accept answer error:', error);
    return NextResponse.json(
      { error: 'Failed to accept answer' },
      { status: 500 }
    );
  }
}