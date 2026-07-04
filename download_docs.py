import os
import re
import json
import ssl
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://developerdocs.instructure.com"
DOCS_DIR = "docs"
SITE_INDEX_FILE = "site-index.json"

ssl_context = ssl.create_default_context()

def fetch_url(url, retries=3, delay=2):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = urllib.request.Request(url, headers=headers)
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
                return response.read()
        except Exception as e:
            if attempt == retries - 1:
                print(f"Failed to fetch {url} after {retries} attempts. Error: {e}")
                return None
            time.sleep(delay * (2 ** attempt))
    return None

def download_site_index():
    if os.path.exists(SITE_INDEX_FILE):
        print(f"Using local {SITE_INDEX_FILE}")
        with open(SITE_INDEX_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
            
    print("Downloading site index...")
    url = f"{BASE_URL}/~gitbook/site-index"
    content = fetch_url(url)
    if content:
        data = json.loads(content.decode("utf-8"))
        with open(SITE_INDEX_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return data
    else:
        raise Exception("Could not download site index.")

def get_page_pathnames(site_index):
    pathnames = set()
    for page in site_index.get("pages", []):
        pathnames.add(page.get("pathname"))
    return pathnames

def get_page_id_map(site_index):
    id_map = {}
    for page in site_index.get("pages", []):
        page_id = page.get("id")
        pathname = page.get("pathname")
        if page_id and pathname:
            id_map[page_id] = pathname
    return id_map

def get_local_path(pathname):
    pathname = urllib.parse.unquote(pathname)
    if pathname == '/':
        return os.path.join(DOCS_DIR, "README.md")
    rel_path = pathname.lstrip('/')
    return os.path.join(DOCS_DIR, f"{rel_path}.md")

def rewrite_url(url, source_pathname, source_local_path, page_pathnames, page_id_map):
    # Clean URL (remove escaped underscores and extra spaces)
    url = url.strip().replace(r'\_', '_')
    if not url:
        return url
        
    try:
        parsed = urllib.parse.urlparse(url)
    except Exception:
        return url
        
    # Ignore non-http/s and non-relative schemes
    if parsed.scheme not in ('', 'http', 'https'):
        return url
        
    # Check if the URL is on developerdocs.instructure.com or is a relative path on the same site
    if parsed.netloc not in ('', 'developerdocs.instructure.com'):
        return url
        
    path = parsed.path
    if not path:
        # It's an anchor-only link like #section
        return url
        
    # Resolve relative URL path to absolute pathname on the site
    if not path.startswith('/'):
        # Resolve against the source page's pathname
        absolute_pathname = urllib.parse.urljoin(source_pathname, path)
    else:
        absolute_pathname = path
        
    # Decode percent encoding
    normalized_path = urllib.parse.unquote(absolute_pathname)
    
    # Check if it points to a page ID (e.g. /pages/ID)
    match_id = re.search(r'pages/([a-zA-Z0-9]+)', normalized_path)
    if match_id:
        page_id = match_id.group(1)
        if page_id in page_id_map:
            normalized_path = page_id_map[page_id]
            
    # Normalize trailing slash and .md extension
    if normalized_path != '/':
        normalized_path = normalized_path.rstrip('/')
    if normalized_path.endswith('.md'):
        normalized_path = normalized_path[:-3]
        
    # Normalize readme/README paths to /
    if normalized_path.lower().strip('/') == 'readme':
        normalized_path = '/'
        
    # Map normalized_path to local target path
    if normalized_path == '/':
        target_local_path = os.path.join(DOCS_DIR, "README.md")
    elif normalized_path in page_pathnames:
        target_local_path = os.path.join(DOCS_DIR, f"{normalized_path.lstrip('/')}.md")
    elif normalized_path == '/llms.txt':
        target_local_path = os.path.join(DOCS_DIR, 'llms.txt')
    elif normalized_path.startswith('/files/'):
        target_local_path = os.path.join(DOCS_DIR, normalized_path.lstrip('/'))
    else:
        # Not in page pathnames. Preserve other extensions or assume standard format
        _, ext = os.path.splitext(normalized_path)
        if ext:
            target_local_path = os.path.join(DOCS_DIR, normalized_path.lstrip('/'))
        else:
            target_local_path = os.path.join(DOCS_DIR, f"{normalized_path.lstrip('/')}.md")
            
    # Compute relative path from the directory of source_local_path
    source_dir = os.path.dirname(source_local_path)
    rel_path = os.path.relpath(target_local_path, source_dir)
    
    # Re-append query and fragment
    query = f'?{parsed.query}' if parsed.query else ''
    fragment = f'#{parsed.fragment}' if parsed.fragment else ''
    
    # Ensure forward slashes for relative path in markdown
    rel_path = rel_path.replace(os.path.sep, '/')
    
    return rel_path + query + fragment

def process_markdown_except_code(content, process_func):
    # Regex to match code blocks (```...```) or inline code (`...`)
    pattern = re.compile(r'(```.*?```|`.*?`)', re.DOTALL)
    parts = pattern.split(content)
    for i in range(len(parts)):
        # If it's even-indexed, it's plain text (outside code blocks)
        # If it's odd-indexed, it's code (inside code blocks)
        if i % 2 == 0:
            parts[i] = process_func(parts[i])
    return ''.join(parts)

def rewrite_content_links(content, source_pathname, source_local_path, page_pathnames, page_id_map):
    def rewrite_links_in_text(text):
        # Regex to match markdown links [label](url)
        def repl_md(match):
            label = match.group(1)
            url = match.group(2)
            new_url = rewrite_url(url, source_pathname, source_local_path, page_pathnames, page_id_map)
            return f'[{label}]({new_url})'
        
        text = re.sub(r'\[([^\]]*)\]\(([^)]*)\)', repl_md, text)
        
        # Regex to match HTML href="url"
        def repl_href(match):
            quote = match.group(1)
            url = match.group(2)
            new_url = rewrite_url(url, source_pathname, source_local_path, page_pathnames, page_id_map)
            return f'href={quote}{new_url}{quote}'
            
        text = re.sub(r'href=(["\'])(.*?)\1', repl_href, text)
        return text

    return process_markdown_except_code(content, rewrite_links_in_text)

def download_page(pathname, page_pathnames, page_id_map):
    local_path = get_local_path(pathname)
    
    # Determine the remote markdown URL
    if pathname == '/':
        remote_url = f"{BASE_URL}/readme.md"
    else:
        # Ensure it doesn't end with .md
        clean_pathname = pathname
        if clean_pathname.endswith('.md'):
            clean_pathname = clean_pathname[:-3]
        remote_url = f"{BASE_URL}{clean_pathname}.md"
        
    print(f"Downloading: {pathname} -> {local_path}")
    raw_content = fetch_url(remote_url)
    if not raw_content:
        return pathname, False
        
    try:
        content = raw_content.decode("utf-8")
    except UnicodeDecodeError:
        print(f"Decoding failed for {pathname}. Saving raw bytes.")
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, "wb") as f:
            f.write(raw_content)
        return pathname, True
        
    # Rewrite links inside the content
    processed_content = rewrite_content_links(content, pathname, local_path, page_pathnames, page_id_map)
    
    # Create parent directories
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    with open(local_path, "w", encoding="utf-8") as f:
        f.write(processed_content)
        
    return pathname, True

def main():
    start_time = time.time()
    
    # Create docs directory
    os.makedirs(DOCS_DIR, exist_ok=True)
    
    # 1. Download site index
    site_index = download_site_index()
    page_pathnames = get_page_pathnames(site_index)
    page_id_map = get_page_id_map(site_index)
    print(f"Found {len(page_pathnames)} pages in site index.")
    
    # 2. Download llms.txt if possible
    print("Downloading llms.txt...")
    llms_content = fetch_url(f"{BASE_URL}/llms.txt")
    if llms_content:
        local_llms_path = os.path.join(DOCS_DIR, "llms.txt")
        try:
            llms_text = llms_content.decode("utf-8")
            processed_llms = rewrite_content_links(llms_text, "/llms.txt", local_llms_path, page_pathnames, page_id_map)
            with open(local_llms_path, "w", encoding="utf-8") as f:
                f.write(processed_llms)
        except Exception as e:
            with open(local_llms_path, "wb") as f:
                f.write(llms_content)
            print(f"Saved raw llms.txt due to error: {e}")
            
    # 3. Download all pages concurrently
    success_count = 0
    fail_count = 0
    failed_pages = []
    
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_page, pathname, page_pathnames, page_id_map): pathname for pathname in page_pathnames}
        for future in as_completed(futures):
            pathname = futures[future]
            try:
                path, success = future.result()
                if success:
                    success_count += 1
                else:
                    fail_count += 1
                    failed_pages.append(pathname)
            except Exception as e:
                print(f"Exception downloading {pathname}: {e}")
                fail_count += 1
                failed_pages.append(pathname)
                
    # 4. Retry failed pages once
    if failed_pages:
        print(f"\nRetrying {len(failed_pages)} failed pages...")
        retried_failed = []
        for pathname in failed_pages:
            try:
                time.sleep(1)
                path, success = download_page(pathname, page_pathnames, page_id_map)
                if success:
                    success_count += 1
                    fail_count -= 1
                else:
                    retried_failed.append(pathname)
            except Exception as e:
                print(f"Exception retrying {pathname}: {e}")
                retried_failed.append(pathname)
        failed_pages = retried_failed
        
    elapsed = time.time() - start_time
    print(f"\nDownload completed in {elapsed:.2f} seconds.")
    print(f"Successfully downloaded: {success_count}")
    print(f"Failed to download: {fail_count}")
    if failed_pages:
        print("List of failed pathnames:")
        for p in failed_pages:
            print(f" - {p}")
            
if __name__ == "__main__":
    main()
