"""
制作実績ビルドスクリプト
======================
使い方:
  python build.py

portfolio-data.json を読み込んで index.html の制作実績部分を更新します。
"""

import json
import re

DATA_FILE = "portfolio-data.json"
HTML_FILE = "index.html"
START_MARKER = "<!-- PORTFOLIO_ITEMS_START -->"
END_MARKER   = "<!-- PORTFOLIO_ITEMS_END -->"

ITEM_TEMPLATE = """\
                  <div class="col-12 col-md-4 col-lg-4 d-block" data-tag="{tag}">
                    <a href="{url}" class="portfolio-item text-decoration-none px-5 pb-4">
                      <figure class="portfolio-item__image" style="aspect-ratio: 16/9">
                        <img src="{image}" class="w-100 h-100 object-fit-cover wp-post-image" alt="{title}" decoding="async" loading="lazy" />
                      </figure>
                      <div class="portfolio-item__content">
                        <h3 class="portfolio-item__title">{title}</h3>
                      </div>
                    </a>
                  </div>"""

def build():
    # JSON 読み込み
    with open(DATA_FILE, encoding="utf-8") as f:
        items = json.load(f)

    # HTML 生成
    html_items = "\n".join(
        ITEM_TEMPLATE.format(
            tag=item["tag"],
            url=item["url"],
            image=item["image"],
            title=item["title"],
        )
        for item in items
    )

    # index.html 読み込み
    with open(HTML_FILE, encoding="utf-8") as f:
        html = f.read()

    # マーカー間を置換
    pattern = re.compile(
        rf"{re.escape(START_MARKER)}.*?{re.escape(END_MARKER)}",
        re.DOTALL,
    )
    replacement = f"{START_MARKER}\n{html_items}\n                {END_MARKER}"

    if not pattern.search(html):
        print("エラー: index.html にマーカーが見つかりません。")
        print(f"  {START_MARKER}  と  {END_MARKER}  が正しく設置されているか確認してください。")
        return

    new_html = pattern.sub(replacement, html)

    # 書き出し
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"✅ 完了！ {len(items)} 件の制作実績を index.html に反映しました。")

if __name__ == "__main__":
    build()
