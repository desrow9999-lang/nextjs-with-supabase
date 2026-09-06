'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface HealthLog {
  id: string;
  condition_score: number;
  memo: string;
  created_at: string;
}

export default function Home() {
  const [score, setScore] = useState<number>(3);
  const [memo, setMemo] = useState<string>('');
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [summarizing, setSummarizing] = useState<boolean>(false);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('取得エラー:', error.message);
    } else if (data) {
      setLogs(data);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('health_logs').insert([
      { condition_score: score, memo },
    ]);

    setLoading(false);

    if (error) {
      alert('保存に失敗しました: ' + error.message);
    } else {
      setMemo('');
      fetchLogs();
    }
  };

  const handleSummarize = async () => {
    if (logs.length === 0) {
      alert('分析する記録がありません。');
      return;
    }
    setSummarizing(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });
      const data = await res.json();
      setSummary(data.summary || data.error);
    } catch (e) {
      setSummary('要約中にエラーが発生しました。');
    }
    setSummarizing(false);
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold text-center">体調管理 (PWA + AI)</h1>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-xl border">
        <div>
          <label className="block text-sm font-medium mb-1">今の気分/体調 (1-5)</label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setScore(num)}
                className={`w-10 h-10 rounded-full text-sm font-bold ${
                  score === num ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メモ・症状</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm text-black"
            rows={3}
            placeholder="例: 少し頭痛がする、睡眠不足かも"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? '保存中...' : '記録を保存'}
        </button>
      </form>

      {/* AI要約エリア */}
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-purple-900">✨ AI体調アドバイス</h2>
          <button
            onClick={handleSummarize}
            disabled={summarizing}
            className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
          >
            {summarizing ? '分析中...' : 'AIで分析'}
          </button>
        </div>
        {summary && <p className="text-sm text-purple-950 whitespace-pre-wrap">{summary}</p>}
      </div>

      {/* 履歴表示 */}
      <div className="space-y-2">
        <h2 className="text-md font-bold">最近の記録</h2>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">まだ記録はありません。</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3 bg-white border rounded-lg text-sm space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>スコア: {log.condition_score} / 5</span>
                  <span>{new Date(log.created_at).toLocaleString('ja-JP')}</span>
                </div>
                {log.memo && <p className="text-gray-800">{log.memo}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
