'use client';

import { useState } from 'react';

export default function GeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setThreads(data.threads || '');
        setNote(data.note || '');
      } else {
        alert('生成に失敗しました: ' + (data.error || '不明なエラー'));
      }
    } catch (err) {
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>
          🌿 メンタルサポート記事 ジェネレーター
        </h1>
        <a href="/" style={{ fontSize: '14px', color: '#2b6cb0', textDecoration: 'none' }}>
          ← タスカルへ戻る
        </a>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#ccc' : '#2b6cb0',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '24px'
        }}
      >
        {loading ? '生成中...' : '🚀 記事を生成する'}
      </button>

      {/* Threads用 */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>Threads用テキスト</h2>
          {threads && (
            <button
              onClick={() => copyToClipboard(threads, 'threads')}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#f6f8fa', cursor: 'pointer', fontSize: '14px' }}
            >
              {copied === 'threads' ? '✨ コピー完了！' : '📋 コピー'}
            </button>
          )}
        </div>
        <textarea
          value={threads}
          readOnly
          rows={6}
          placeholder="ここにThreads用の記事が表示されます"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: '#fafafa' }}
        />
      </section>

      {/* note用 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>note用エッセイ</h2>
          {note && (
            <button
              onClick={() => copyToClipboard(note, 'note')}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#f6f8fa', cursor: 'pointer', fontSize: '14px' }}
            >
              {copied === 'note' ? '✨ コピー完了！' : '📋 コピー'}
            </button>
          )}
        </div>
        <textarea
          value={note}
          readOnly
          rows={10}
          placeholder="ここにnote用の記事が表示されます"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: '#fafafa' }}
        />
      </section>
    </main>
  );
}
