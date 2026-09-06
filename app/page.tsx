import { useState } from "react";

export default function Home() {
  const [mood, setMood] = useState<number | null>(null);
  const [sleepHours, setSleepHours] = useState<string>("7");
  const [tookMeds, setTookMeds] = useState<boolean>(true);
  const [memo, setMemo] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  const moods = [
    { score: 1, label: "かなりつらい", emoji: "😭" },
    { score: 2, label: "少ししんどい", emoji: "😔" },
    { score: 3, label: "ふつう", emoji: "😐" },
    { score: 4, label: "調子よい", emoji: "🙂" },
  ];

  const handleSave = () => {
    if (mood === null) return;
    setSaved(true);
    // TODO: Supabaseへ記録データを保存する処理を接続
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* ヘッダー */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">ココロログ</h1>
          <p className="text-xs text-slate-500">きょうの体調をワンタップで記録</p>
        </header>

        {/* 今日の記録カード */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          
          {/* 気分選択（絵文字タップ） */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">1. きょうの気分</label>
            <div className="grid grid-cols-4 gap-2">
              {moods.map((item) => (
                <button
                  key={item.score}
                  onClick={() => setMood(item.score)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${
                    mood === item.score
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-medium text-slate-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 睡眠時間 */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">2. 睡眠時間（およそ）</label>
            <select
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3">3時間以下</option>
              <option value="5">4〜5時間</option>
              <option value="7">6〜7時間</option>
              <option value="9">8〜9時間</option>
              <option value="10">10時間以上</option>
            </select>
          </div>

          {/* 服薬チェック */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">3. おくすり</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTookMeds(true)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                  tookMeds ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "border-slate-200 text-slate-500"
                }`}
              >
                飲めた 💊
              </button>
              <button
                onClick={() => setTookMeds(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                  !tookMeds ? "bg-rose-50 border-rose-500 text-rose-700" : "border-slate-200 text-slate-500"
                }`}
              >
                飲んでない
              </button>
            </div>
          </div>

          {/* ひと言メモ（任意） */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">4. 先生に伝えたいこと（任意）</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="例: 朝起きるのが特につらかった"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={mood === null}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm disabled:opacity-40"
          >
            {saved ? "記録しました！ ✓" : "記録を保存する"}
          </button>
        </section>

        {/* 通院時サマリーカード（先生に見せる用） */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-300">👨‍⚕️ 診察時見せるモード</h2>
            <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">直近2週間</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ここをタップすると、2週間の気分の波グラフ・睡眠傾向・服薬率が1画面にまとまり、主治医へ即座に共有できます。
          </p>
          <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-2.5 rounded-xl text-xs transition">
            診察用サマリーを表示
          </button>
        </section>

      </div>
    </main>
  );
}
