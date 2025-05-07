import { NextResponse } from "next/server";
import { getAnswers } from "@/services/answer.service";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Question from "@/models/Question";
import connectDB from "@/lib/mongodb";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const lowerQuery = query.toLowerCase();

    await connectDB();

    const questions = await Question.find({});
    const exactMatches = questions.filter(
      (q: any) =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.content.toLowerCase().includes(lowerQuery)
    );

    let contextData = "";
    let relatedQuestions: any = [];
    let relatedAnswers = [];

    if (exactMatches.length > 0) {
      const bestMatch = exactMatches[0];
      const answersResponse = await getAnswers(bestMatch.id);
      const questionAnswers = answersResponse.data;

      contextData = `
Related Question: ${bestMatch.title}
Question Content: ${bestMatch.content}
Related Answers:
${questionAnswers.map((a: any) => `- ${a.content}`).join("\n")}
      `.trim();

      relatedQuestions = [bestMatch];
      relatedAnswers = questionAnswers;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Act as a knowledgeable human expert answering on a professional Q&A platform like Quora.
    
    Your task is to provide the best possible answer to the following user question:
    
    "${query}"
    
    ${
      contextData
        ? `Use the following related questions and answers as supporting context:\n${contextData}`
        : ""
    }
    
    Strict instructions:
    - NEVER say you're an AI or language model.
    - NEVER mention your training or capabilities.
    - NEVER include introductions, greetings, apologies, or disclaimers.
    - NEVER list topics you're knowledgeable in — answer the question directly.
    - DO answer as a human would: confident, concise, and naturally written.
    - DO assume the user wants an answer, not a conversation.
    - DO use related context only if it's helpful — avoid repetition.
    
    Style:
    - Response must be minimal, accurate, and high-quality.
    - Use a professional tone with natural language — no over-explaining.
    - Avoid bulleted lists unless the question explicitly asks for them.
    - Output only the answer. Nothing more.
    
    Now, write the answer.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiContent = response.text();

    return NextResponse.json({
      content: aiContent.trim(),
      relatedQuestions,
      relatedAnswers,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
