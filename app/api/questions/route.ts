import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest';
    
    // Build query
    let query: any = {};
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Build sort options
    const sortOptions = sort === 'popular' 
      ? { voteCount: -1 }
      : { createdAt: -1 };
    
    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort(sort === 'popular' ? { voteCount: -1 as const } : { createdAt: -1 as const })
        .skip(offset)
        .limit(limit)
        .populate('author', 'username name avatarUrl'),
      Question.countDocuments(query),
    ]);
    
    return NextResponse.json({
      questions,
      total,
    });
  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await auth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, content, tags } = await request.json();
    
    const question = await Question.create({
      title,
      content,
      author: user._id,
      tags,
    });
    
    await question.populate('author', 'username name avatarUrl');
    
    return NextResponse.json(question);
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}