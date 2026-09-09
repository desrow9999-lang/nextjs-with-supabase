import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST() {
  try {
    const thRes = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: 'うつ病当事者に寄り添うThreads用の温かい共感メッセージを140文字程度で1つ生成してください。',
    });

    const noRes = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: 'うつ病当事者に寄り添うnote用の丁寧なエッセイ記事を「タイトル：」から作成してください。',
    });

    return NextResponse.json({
      success: true,
      threads: thRes.text ? thRes.text.trim() : '生成に失敗しました',
      note: noRes.text ? noRes.text.trim() : '生成に失敗しました',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
