from datetime import datetime
import os
from google import genai

client = genai.Client()
today_str = datetime.now().strftime("%Y-%m-%d")

threads_prompt = """
あなたはうつ病当事者やそのご家族にそっと寄り添い、孤立を防ぐためのサポートボットです。
Threads向けに、今日を少しだけ楽に過ごすための温かい共感メッセージや簡単なコーピング（心の対処法）を、
140文字程度で短く優しく1つだけ生成してください。
"""

note_prompt = """
あなたはうつ病当事者やそのご家族にそっと寄り添い、孤立を防ぐためのサポートボットです。
note向けに、心の重荷を少し軽くするための少し丁寧なエッセイ記事を、
「タイトル：」から始めて本文まで含めて生成してください。
"""

res_threads = client.models.generate_content(model='gemini-3.6-flash', contents=threads_prompt)
threads_filename = f"threads_{today_str}.txt"
with open(threads_filename, "w", encoding="utf-8") as f:
    f.write(res_threads.text)

res_note = client.models.generate_content(model='gemini-3.6-flash', contents=note_prompt)
note_filename = f"note_{today_str}.txt"
with open(note_filename, "w", encoding="utf-8") as f:
    f.write(res_note.text)

print("================ 【Threads用】 ================")
print(res_threads.text)
print("\n================== 【note用】 ==================")
print(res_note.text)
print(f"\n[完了] 保存ファイル: {threads_filename}, {note_filename}")
