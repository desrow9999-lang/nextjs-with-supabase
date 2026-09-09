import os
import streamlit as st
if "GEMINI_API_KEY" in st.secrets:
    os.environ["GEMINI_API_KEY"] = st.secrets["GEMINI_API_KEY"]
import streamlit as st
from datetime import datetime
import subprocess
from google import genai

API_KEY = "AQ.Ab8RN6KNeGPvEP7-3QHaRDX8hA8qKW5v3gboFW-46nURrfrZvg"

client = genai.Client(api_key=API_KEY)
t = datetime.now().strftime("%Y-%m-%d")
th = client.models.generate_content(model='gemini-2.5-flash', contents='うつ病当事者に寄り添うThreads用の温かい共感メッセージを140文字程度で1つ生成してください。').text.strip()
no = client.models.generate_content(model='gemini-2.5-flash', contents='うつ病当事者に寄り添うnote用の丁寧なエッセイ記事を「タイトル：」から作成してください。').text.strip()
with open("README.md", "w", encoding="utf-8") as f:
    f.write(f"# 🌿 メンタルサポート ({t})\n\n## 📱 Threads\n```text\n{th}\n```\n\n## 📝 note\n```text\n{no}\n```\n")
subprocess.run(["git", "add", "README.md"])
subprocess.run(["git", "commit", "-m", "update"])
subprocess.run(["git", "push"])
print("✨ 完了しました！")
