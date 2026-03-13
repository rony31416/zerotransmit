import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE_URL = "http://asp.portal.gov.bd/"
visited = set()
docs_content = []

def is_valid_url(url):
    parsed = urlparse(url)
    # Ensure it stays within the portal and isn't a media/document file
    return "asp.portal.gov.bd" in parsed.netloc and not any(ext in parsed.path.lower() for ext in ['.pdf', '.jpg', '.png', '.doc', '.docx', '.xlsx', '.xls', '.mp3', '.mp4', '.zip', '.rar'])

def scrape(url, depth=0, max_depth=2):
    if depth > max_depth or url in visited:
        return
    visited.add(url)
    
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser', from_encoding='utf-8')
        
        # BD Govt portals usually wrap main content in an element with class or id containing 'content'
        main_content = soup.find('div', id='main-content') or soup.find('div', class_='col-md-9') or soup.find('body')
        if main_content:
            # Clean up scripts and styles before extracting text
            for script in main_content(["script", "style"]):
                script.extract()
            text = main_content.get_text(separator='\n', strip=True)
            # Filter out boilerplate blocks if possible, but keep it simple
            if len(text) > 150:
                docs_content.append(f"--- Information from {url} ---\n{text}\n")
        
        for a in soup.find_all('a', href=True):
            next_url = urljoin(BASE_URL, a['href'])
            if is_valid_url(next_url):
                scrape(next_url, depth + 1, max_depth)
                
    except Exception as e:
        print(f"Skipping {url} due to error: {e}")

print("Starting deep scrape of asp.portal.gov.bd...")
scrape(BASE_URL)
print(f"Successfully scraped {len(docs_content)} pages.")

docs_path = os.path.join(os.path.dirname(__file__), "app", "docs.txt")
with open(docs_path, "a", encoding="utf-8") as f:
    f.write("\n\n=== বাংলাদেশ সরকার জাতীয় এইডস/এসটিডি কন্ট্রোল (NASC) ওয়েবসাইট থেকে অতিরিক্ত তথ্য ===\n\n")
    for content in docs_content:
        f.write(content + "\n")
print(f"Done appending to {docs_path}.")
