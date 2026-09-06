import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // TODO: ここにGemini APIやSupabaseとの連携処理を接続
    setTimeout(() => {
      setResult(`「${input}」に関する生成結果がここに表示されます。`);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* ヘッダー */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Assistant App
          </h1>
          <p className="text-sm text-slate-500">
            AIを活用してあなたの作業を効率化します
          </p>
        </header>

        {/* 入力エリア */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            プロンプト / 質問を入力
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: ブログの目次を作成して、プログラミング学習のアドバイスを教えて..."
            rows={4}
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "生成中..." : "AIで生成する"}
          </button>
        </section>

        {/* 結果表示エリア */}
        {result && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-2">
            <h2 className="text-sm font-semibold text-slate-500">生成結果</h2>
            <div className="p-4 bg-slate-50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
