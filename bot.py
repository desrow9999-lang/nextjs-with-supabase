import os
import feedparser
import tweepy

API_KEY = os.environ.get("X_API_KEY")
API_SECRET = os.environ.get("X_API_SECRET")
ACCESS_TOKEN = os.environ.get("X_ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.environ.get("X_ACCESS_TOKEN_SECRET")

NOTE_RSS_URL = "https://note.com/agile_lemur2260/rss"
HISTORY_FILE = "posted.txt"

def get_latest_article():
    feed = feedparser.parse(NOTE_RSS_URL)
    if not feed.entries:
        return None
    latest = feed.entries[0]
    return {"title": latest.title, "link": latest.link}

def load_posted_link():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    return ""

def save_posted_link(link):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        f.write(link)

def main():
    article = get_latest_article()
    if not article:
        print("記事が見つかりませんでした。")
        return

    latest_link = article["link"]
    last_posted = load_posted_link()

    if latest_link == last_posted:
        print("新しい記事はありません。")
        return

    message = f"新しいnoteを投稿しました！\n\n{article['title']}\n{latest_link}"

    client = tweepy.Client(
        consumer_key=API_KEY,
        consumer_secret=API_SECRET,
        access_token=ACCESS_TOKEN,
        access_token_secret=ACCESS_TOKEN_SECRET
    )

    try:
        client.create_tweet(text=message)
        print(f"Xへの投稿が成功しました: {article['title']}")
        save_posted_link(latest_link)
    except Exception as e:
        print(f"投稿に失敗しました: {e}")

if __name__ == "__main__":
    main()
