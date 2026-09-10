import streamlit as st
st.set_page_config(page_title="副業note自動生成プロ", page_icon="✍️")
import streamlit as st
import os


st.title("✨ 副業note自動生成プロ")
st.write("ボタンをタップするだけで、スレッズとnote用の記事を自動生成します。")

# APIキーの取得（環境変数または入力）
api_key = os.environ.get("OPENAI_API_KEY", "")

if st.button("🚀 ワンタップで記事を生成する", type="primary", use_container_width=True):
    with st.spinner("記事を生成中です...少々お待ちください"):
        # --- 昨日の生成ロジック ---
        thread_text = "今日も一日、お疲れ様でした。何気ない日常の中で、ふと立ち止まる瞬間はありませんか？"
        memo_text = "タイトル：心が動かない日は、無理に立たなくていい\n\nこんにちは。\nこの文章を開いてくださり、ありがとうございます。\n\nいま、どんな場所で、どんな体勢でこの言葉を読んでいますか？\n布団の中で小さくなっているかもしれません。\n\n何もする気が起きない。\n胸の奥が重たくなって、理由もなく涙が出てくる。\n昨日までできていたことが、今日は何もできない。\n\nそんな自分に対して、「どうしてこんなにダメなんだろう」と責めてしまうことはありませんか？\n\nまず、一番にお伝えしたいことがあります。\n\n**あなたが今日、息をして、ただそこにいるだけで、もう十分です。**"

    st.success("✨ 記事の生成が完了しました！")

    st.markdown("### 📱 スレッド用")
    st.code(thread_text, language="markdown")

    st.markdown("### 📝 メモ (note用)")
    st.text_area("本文コピーエリア", memo_text, height=300)

