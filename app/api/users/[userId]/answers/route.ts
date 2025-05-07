import { NextRequest, NextResponse } from "next/server";
import Answer from "@/models/Answer";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const answers = await Answer.find({ author: new ObjectId(params.userId) })
      // .populate('authorId')
      // .populate('question')
      .sort({ createdAt: -1 });

    return NextResponse.json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { error: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}
