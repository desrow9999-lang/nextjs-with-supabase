import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6KNeGPvEP7-3QHaRDX8hA8qKW5v3gboFW-46nURrfrZvg' });

async function runWithRetry(retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`生成を試行中... (${i + 1}回目)`);
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: 'あなたは優しいメンタルヘルス・心理カウンセラーです。現代人が日常で抱えがちな心の疲れ、焦り、不安をやさしく包み込み、心がふっと軽くなるようなメッセージを作成してください。Threads用テキストとnote用エッセイの2つを出力してください。',
      });
      console.log("\n=== 生成結果 ===");
      console.log(response.text);
      return;
    } catch (error) {
      console.log(`一時的なエラーです。${delay / 1000}秒後に再試行します...`);
      if (i === retries - 1) {
        console.error("エラー詳細:", error);
      } else {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

runWithRetry();
