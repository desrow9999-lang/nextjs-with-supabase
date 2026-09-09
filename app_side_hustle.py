import streamlit as st
from google import genai

# ページ設定（ホーム画面追加時のアイコンやアプリ名を最適化）
st.set_page_config(
    page_title="副業note自動生成プロ",
    page_icon="✍️",
    layout="centered",
    initial_sidebar_state="expanded"
)

# タイトル
st.title("✍️ 副業note有料記事 自動生成ツール")
st.markdown("ワンタップで読者の心に刺さり、購入へと繋がる副業ノウハウ・マインド系の有料記事を自動生成します。")

# サイドバー設定（お客様ご自身のAPIキーを入力してもらう仕様）
with st.sidebar:
    st.header("⚙️ ご利用設定")
    st.markdown("ご利用にはご自身の **Gemini APIキー** が必要です。")
    api_key = st.text_input("Gemini API Key", type="password")
    
    st.markdown("---")
    st.markdown("### 💡 記事の仕様")
    st.markdown("- **ターゲット**: 副業を始めたい初心者")
    st.markdown("- **読了時間**: 3〜5分程度")
    st.markdown("- **構成**: 共感 ➔ 解決策 ➔ ステップ ➔ 有料誘導")

# メイン入力エリア
theme_input = st.text_input(
    "作成したい副業のテーマやジャンルを入力してください",
    placeholder="例：スキマ時間で月5万円稼ぐスマホライティング術"
)

# 生成ボタン
if st.button("🚀 ワンタップで記事を自動生成する", type="primary"):
    if not api_key:
        st.error("左側のサイドバーに Gemini API Key を入力してください。")
    elif not theme_input:
        st.warning("副業のテーマを入力してください。")
    else:
        with st.spinner("プロのWebライターが記事を執筆中..."):
            try:
                # Geminiクライアント初期化
                client = genai.Client(api_key=api_key)
                
                # プロンプトの構築
                prompt = """
あなたはnoteで累計数千部を売り上げるプロのWebライター兼マーケターです。読者の行動を促し、「有料部分を読んでみたい」と思わせる魅力的な副業ノウハウ・解説記事を作成してください。

以下のテーマに沿って、noteの有料記事の骨子・本体を生成してください。

- テーマ: {theme}（会社員・初心者向けに、再現性が高く実践しやすい内容）
- ターゲット: 現状の収入に不安があり、何から始めればいいか悩んでいる人
- 読了時間: 3〜5分程度でサクッと読めるボリューム
- 構成: 
  1. 共感と問題提起（読者の現在の悩みや痛みに寄り添う）
  2. 解決策の提示（具体的な副業の手段やアプローチ）
  3. 実践のためのファーストステップ（今日からできる具体的な行動）
  4. 有料部分への魅力的な誘導（さらに深い裏技や効率化のコツがあることを匂わせる）

以下の出力フォーマットを厳守してください。

【タイトル】
（※クリック率が高く、思わず読みたくなる魅力的なタイトルを1つ）

【導入】
（※読者の悩みに共感し、この記事で得られるメリットを提示する文章）

【本文】
（※具体的な副業のノウハウやコツを分かりやすく箇条書きや段落で解説）

【まとめ・有料部分への案内】
（※ここから先でしか読めない具体的な裏技やテンプレートがあることを伝え、購入を促すメッセージ）
""".format(theme=theme_input)

                response = client.models.generate_content(
                    model='gemini-3.6-flash',
                    contents=prompt,
                )
                
                article_output = response.text
                
                st.success("✨ 記事の生成が完了しました！")
                
                # 出力結果の表示
                st.markdown("### 📄 生成された記事")
                st.text_area("以下の枠内をコピーしてnoteに貼り付けてください", article_output, height=400)
                
                # コピー用コードブロック
                st.code(article_output, language="markdown")
                
            except Exception as e:
                st.error(f"エラーが発生しました: {e}")
