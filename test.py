import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="テスト"
)
print("--- 応答結果 ---")
print(response.text)
