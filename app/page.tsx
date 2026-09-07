'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function Page() {
  const supabase = createBrowserClient(
    'https://mwurdtuqkgnqplaqscrg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXJkdHVxa2ducXBsYXFzY3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NTYyMTIsImV4cCI6MjEwNDEzMjIxMn0.JpcU343VYpelgIXB4V589KOc8M1ENGcWu7tVoqsUlMA'
  )

  const [mode, setMode] = useState<'input' | 'report'>('input')
  const [mood, setMood] = useState<number>(3)
  const [sleepHours, setSleepHours] = useState<number>(7.0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [memo, setMemo] = useState<string>('')
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const moodIcons: { [key: number]: { icon: string; label: string; color: string } } = {
    5: { icon: '😃', label: '絶好調', color: '#22c55e' },
    4: { icon: '🙂', label: '良い', color: '#84cc16' },
    3: { icon: '😐', label: '普通', color: '#eab308' },
    2: { icon: '🙁', label: 'いまいち', color: '#f97316' },
    1: { icon: '😫', label: 'つらい', color: '#ef4444' },
  }

  const presetTags = ['睡眠不足', '薬飲んだ', '外出できた', '頭痛', 'めまい', '不安', '胃痛', '運動した']

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('health_logs')
      .select('*')
      .order('created_at', { ascending: false })
    setLogs(data || [])
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.from('health_logs').insert({
      mood,
      sleep_hours: sleepHours,
      tags: selectedTags,
      memo,
    })

    setMemo('')
    setSelectedTags([])
    fetchLogs()
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    await supabase.from('health_logs').delete().eq('id', id)
    fetchLogs()
  }

  // 集計データの計算
  const avgMood = logs.length > 0 ? (logs.reduce((acc, cur) => acc + cur.mood, 0) / logs.length).toFixed(1) : '0'
  const avgSleep = logs.length > 0 ? (logs.reduce((acc, cur) => acc + cur.sleep_hours, 0) / logs.length).toFixed(1) : '0'

  // 出現順タグ集計
  const tagCounts: { [key: string]: number } = {}
  logs.forEach((log) => {
    log.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* モード切り替えタブ */}
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          <button
            onClick={() => setMode('input')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: mode === 'input' ? '#ffffff' : 'transparent',
              color: mode === 'input' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'input' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            📝 毎日の記録
          </button>
          <button
            onClick={() => setMode('report')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: mode === 'report' ? '#ffffff' : 'transparent',
              color: mode === 'report' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'report' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            🩺 診察用レポート
          </button>
        </div>

        {mode === 'input' ? (
          <>
            {/* 記録入力フォーム */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <form onSubmit={handleSubmit}>
                
                {/* 1. 5段階気分選択 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                    1. 今日の気分・調子
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                    {[5, 4, 3, 2, 1].map((val) => {
                      const isSelected = mood === val
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setMood(val)}
                          style={{
                            flex: 1,
                            padding: '10px 4px',
                            borderRadius: '12px',
                            border: isSelected ? `2px solid ${moodIcons[val].color}` : '2px solid #f1f5f9',
                            backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '26px' }}>{moodIcons[val].icon}</div>
                          <div style={{ fontSize: '11px', color: isSelected ? '#1e293b' : '#64748b', fontWeight: isSelected ? 'bold' : 'normal', marginTop: '2px' }}>
                            {moodIcons[val].label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. 睡眠時間 */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                    <span>2. 睡眠時間</span>
                    <span style={{ color: '#2563eb' }}>{sleepHours} 時間</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="14" 
                    step="0.5" 
                    value={sleepHours} 
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#2563eb', height: '6px', cursor: 'pointer' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    <span>0時間</span>
                    <span>7時間</span>
                    <span>14時間</span>
                  </div>
                </div>

                {/* 3. プリセットタグ選択 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                    3. 状態・症状（タップで選択）
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {presetTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#475569',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 4. メモ（任意） */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                    4. メモ（任意）
                  </label>
                  <input 
                    type="text" 
                    value={memo} 
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="気になったことを一言だけ..." 
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      fontSize: '14px', 
                      color: '#0f172a',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxSizing: 'border-box'
                    }} 
                  />
                </div>

                {/* 記録ボタン */}
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: '#ffffff', 
                    backgroundColor: loading ? '#93c5fd' : '#2563eb', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
                  }}
                >
                  {loading ? '記録中...' : 'ログを記録する'}
                </button>
              </form>
            </div>

            {/* 過去ログ一覧 */}
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '12px' }}>
              最近の記録
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.length > 0 ? (
                logs.map((log: any) => (
                  <div 
                    key={log.id} 
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '12px', 
                      padding: '14px 16px', 
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '22px' }}>{moodIcons[log.mood]?.icon}</span>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>
                          {moodIcons[log.mood]?.label}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: 'auto', paddingRight: '8px' }}>
                          睡眠: {log.sleep_hours}時間
                        </span>
                      </div>

                      {log.tags && log.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                          {log.tags.map((t: string) => (
                            <span key={t} style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px' }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {log.memo && (
                        <p style={{ fontSize: '12px', color: '#475569', margin: '6px 0 0 0' }}>
                          {log.memo}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDelete(log.id)}
                      style={{ color: '#94a3b8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '20px 0' }}>
                  まだ記録がありません。
                </p>
              )}
            </div>
          </>
        ) : (
          /* 診察用レポート画面 */
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                診察用サマリーレポート
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>この画面を医師に見せてご説明ください</p>
            </div>

            {/* サマリーカード */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>平均気分スコア</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>
                  {avgMood} <span style={{ fontSize: '14px' }}>/ 5.0</span>
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>平均睡眠時間</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>
                  {avgSleep} <span style={{ fontSize: '14px' }}>時間</span>
                </div>
              </div>
            </div>

            {/* 頻出症状タグ */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                よく出ている症状・状態
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.keys(tagCounts).length > 0 ? (
                  Object.entries(tagCounts).map(([tag, count]) => (
                    <div key={tag} style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', color: '#1e40af', fontWeight: '500' }}>
                      {tag}: {count}回
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>タグデータがありません</p>
                )}
              </div>
            </div>

            {/* 簡易バーグラフ表示 */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                直近の体調・睡眠の記録
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {logs.slice(0, 7).map((log: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{moodIcons[log.mood]?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(log.mood / 5) * 100}%`, backgroundColor: moodIcons[log.mood]?.color, height: '100%' }} />
                      </div>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '12px', width: '60px', textAlign: 'right' }}>
                      {log.sleep_hours}時間
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 印刷・PDF表示切り替えボタン */}
            <button
              onClick={() => window.print()}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#475569',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              🖨️ 画面を印刷 / PDFで保存
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
