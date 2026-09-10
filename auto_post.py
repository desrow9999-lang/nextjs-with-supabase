import streamlit as st
import os
from google import genai

st.set_page_config(page_title="副業note有料記事自動生成ツール", page_icon="✍️", layout="centered")

st.title("✍️ 副業note有料記事自動生成ツール")
st.write("ワンタップで読者の心に刺さり、購入まで繋がる副業ノウハウ・マインド系の有料記事を自動生成します。")

theme = st.text_input("作成したい副業のテーマやジャンルを入力してください", "例：スキマ時間で月5万円稼ぐスマホライティング術")

api_key = os.getenv("GEMINI_API_KEY")

if st.button("🚀 ワンタップで記事を生成する", type="primary"):
    if not api_key:
        st.error("GEMINI_API_KEYが設定されていません。環境変数を確認してください。")
    elif not theme:
        st.warning("テーマやジャンルを入力してください。")
    else:
        with st.spinner("記事を自動生成中..."):
            try:
                client = genai.Client(api_key=api_key)
                prompt = f"以下のテーマに基づき、読者の心に刺さり、購入まで繋がる副業noteの有料記事（構成案・本文含む）をマークダウン形式で作成してください。\n\nテーマ: {theme}"
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                st.success("記事の生成が完了しました！")
                st.markdown(response.text)
            except Exception as e:
                st.error(f"エラーが発生しました: {e}")
