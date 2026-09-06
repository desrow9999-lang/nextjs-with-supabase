import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { logs } = await request.json();

    if (!logs || logs.length === 0) {
      return NextResponse.json({ summary: "分析する記録がありません。" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "APIキーが設定されていません。" }, { status: 500 });
    }

    const prompt = `以下の体調記録データを分析し、最近の体調の傾向と、親しみやすい1〜2文のアドバイスを日本語で出力してください。\n\nデータ:\n${JSON.stringify(logs)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: `APIエラー: ${data.error.message}` }, { status: 500 });
    }

    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "要約の生成に失敗しました。";

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}