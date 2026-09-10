import streamlit as st
import os
from google import genai
import streamlit.components.v1 as components
from dotenv import load_dotenv

load_dotenv()

components.html("""
<script>
    document.documentElement.lang = 'ja';
    document.documentElement.classList.add('notranslate');
</script>
""", height=0)

st.set_page_config(page_title="副業note有料記事自動生成ツール", page_icon="✍️", layout="centered")

# サイドバーにAPIキー入力欄を設置（各自のキーで利用できるようにする）
st.sidebar.header("⚙️ 設定・APIキー")
user_api_key = st.sidebar.text_input("Gemini APIキーを入力", type="password", value="", help="ご自身のGoogle AI Studioで取得したAPIキーを入力してください。未入力の場合は環境変数が使用されます。")

st.title("✍️ 副業note有料記事自動生成ツール")
st.write("ワンタップで読者の心に刺さり、購入まで繋がる副業ノウハウ・マインド系の有料記事を自動生成します。")

theme = st.text_input("作成したい副業のテーマやジャンルを入力してください", placeholder="例：スキマ時間で月5万円稼ぐスマホライティング術")

if "generated_article" not in st.session_state:
    st.session_state.generated_article = ""

if st.button("🚀 ワンタップで記事を生成する", type="primary"):
    active_api_key = user_api_key if user_api_key else os.getenv("GEMINI_API_KEY")
    
    if not active_api_key:
        st.error("Gemini APIキーが入力されていません。サイドバーにAPIキーを入力するか、環境変数を設定してください。")
    elif not theme:
        st.warning("テーマやジャンルを入力してください。")
    else:
        with st.spinner("記事を自動生成中..."):
            try:
                client = genai.Client(api_key=active_api_key)
                prompt = f"以下のテーマに基づき、読者の心に刺さり、購入まで繋がる副業noteの有料記事（構成案・本文含む）をマークダウン形式で作成してください。\n\nテーマ: {theme}"
                response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=prompt,
                )
                st.session_state.generated_article = response.text
                st.success("記事の生成が完了しました！")
            except Exception as e:
                st.error(f"エラーが発生しました: {e}")

if st.session_state.generated_article:
    st.markdown("---")
    st.subheader("📝 生成された記事")
    st.text_area("内容の確認・編集", value=st.session_state.generated_article, height=250)

    st.markdown("---")
    st.subheader("✏️ noteへ投稿・保存する")
    st.write("1. 以下の枠内右上の**コピーボタン**をタップして全文をコピーします。")
    st.code(st.session_state.generated_article, language="markdown")
    st.write("2. 以下のボタンからnoteの新規投稿画面を開き、貼り付けて保存してください。")
    st.link_button("🚀 note投稿画面を開く", "https://note.com/notes/new", type="primary")
