import re
import ssl
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

BASE = "https://searchdatabench.com"
TIMEOUT = 20
errors = []

def check(condition, message):
    print(("PASS" if condition else "FAIL") + ": " + message)
    if not condition:
        errors.append(message)

def get(url):
    request = urllib.request.Request(url, headers={"User-Agent": "SearchDataBench-ProductionQA/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT, context=ssl.create_default_context()) as response:
            return response.status, response.url, response.read(2_000_000).decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.url, exc.read(100_000).decode("utf-8", "replace")

class Headings(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = []
        self.h1 = []
        self.canonical = []
        self.robots = []
        self.state = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("title", "h1"):
            self.state = tag
        if tag == "link" and "canonical" in a.get("rel", "").lower().split():
            self.canonical.append(a.get("href", ""))
        if tag == "meta" and a.get("name", "").lower() == "robots":
            self.robots.append(a.get("content", ""))
    def handle_endtag(self, tag):
        if tag == self.state:
            self.state = None
    def handle_data(self, data):
        if self.state == "title":
            self.title.append(data)
        if self.state == "h1":
            self.h1.append(data)

try:
    status, final_url, html = get(BASE + "/")
    check(status == 200, f"HTTPS home status is 200 (got {status})")
    check(final_url == BASE + "/", f"HTTPS ends at canonical URL (got {final_url})")
    page = Headings()
    page.feed(html)
    check(bool("".join(page.title).strip()), "nonempty HTML title")
    check(bool("".join(page.h1).strip()), "nonempty H1")
    check(len(page.canonical) == 1 and urljoin(final_url, page.canonical[0]) == BASE + "/",
          f"one correct canonical (got {page.canonical})")
    check(not any("noindex" in value.lower() for value in page.robots), f"no robots noindex (got {page.robots})")
except Exception as exc:
    check(False, f"HTTPS home request: {type(exc).__name__}: {exc}")

try:
    status, final_url, body = get("http://searchdatabench.com/")
    check(status == 200 and final_url == BASE + "/",
          f"HTTP redirects to HTTPS canonical and resolves 200 (got {status}, {final_url})")
except Exception as exc:
    check(False, f"HTTP redirect request: {type(exc).__name__}: {exc}")

try:
    status, _, robots = get(BASE + "/robots.txt")
    check(status == 200, f"robots.txt status 200 (got {status})")
    check(not re.search(r"(?im)^\s*Disallow:\s*/\s*$", robots), "robots.txt does not block the whole site")
except Exception as exc:
    check(False, f"robots.txt request: {type(exc).__name__}: {exc}")

try:
    status, _, xml = get(BASE + "/sitemap-index.xml")
    check(status == 200, f"sitemap-index.xml status 200 (got {status})")
    root = ET.fromstring(xml)
    locations = [node.text for node in root.iter() if node.tag.endswith("loc") and node.text]
    check(bool(locations), "sitemap index contains locations")
    check(all(urlparse(loc).scheme == "https" and urlparse(loc).netloc == "searchdatabench.com"
              for loc in locations), f"sitemap locations use production origin (got {locations})")
except Exception as exc:
    check(False, f"sitemap request: {type(exc).__name__}: {exc}")

print(f"Live production QA: {'FAIL' if errors else 'PASS'} ({len(errors)} failures)")
sys.exit(1 if errors else 0)
