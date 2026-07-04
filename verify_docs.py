import os
import json
import re
import urllib.parse

DOCS_DIR = "docs"
SITE_INDEX_FILE = "site-index.json"

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

def check_pages_exist(page_pathnames):
    missing_files = []
    for pathname in page_pathnames:
        local_path = get_local_path(pathname)
        if not os.path.exists(local_path):
            missing_files.append((pathname, local_path))
    return missing_files

def verify_links_consistency(page_pathnames, page_id_map):
    broken_links = []
    external_docs_links = []
    
    # MD link pattern
    md_link_re = re.compile(r'\[([^\]]*)\]\(([^)]*)\)')
    # HTML link pattern
    html_href_re = re.compile(r'href=(["\'])(.*?)\1')
    
    for pathname in page_pathnames:
        local_path = get_local_path(pathname)
        if not os.path.exists(local_path):
            continue
            
        try:
            with open(local_path, "r", encoding="utf-8") as f:
                raw_content = f.read()
        except Exception as e:
            print(f"Error reading file {local_path}: {e}")
            continue
            
        # Clean out code blocks to avoid scanning false links in code blocks
        cleaned_content = re.sub(r'```.*?```|`.*?`', ' ', raw_content, flags=re.DOTALL)
        
        urls = []
        for match in md_link_re.finditer(cleaned_content):
            urls.append(match.group(2).strip())
        for match in html_href_re.finditer(cleaned_content):
            urls.append(match.group(2).strip())
        
        source_dir = os.path.dirname(local_path)
        
        for url in urls:
            # Clean URL
            url_clean = url.replace(r'\_', '_')
            
            # Parse URL
            try:
                parsed = urllib.parse.urlparse(url_clean)
            except Exception:
                continue
                
            # Ignore non-http/s and non-relative schemes
            if parsed.scheme not in ('', 'http', 'https'):
                continue
                
            # Check if the URL is on developerdocs.instructure.com or relative
            if parsed.netloc and parsed.netloc != 'developerdocs.instructure.com':
                continue
                
            if parsed.netloc == 'developerdocs.instructure.com':
                external_docs_links.append((local_path, url))
                continue
                
            # If it's an anchor-only link, it refers to the same file
            if not parsed.path:
                continue
                
            # Resolve relative URL path to absolute pathname on the site
            # (using pathname of the current page as source_pathname)
            if not parsed.path.startswith('/'):
                absolute_pathname = urllib.parse.urljoin(pathname, parsed.path)
            else:
                absolute_pathname = parsed.path
                
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
            
            # Check if target file exists
            # Ignore cover images/assets from remote server (since they are 404 on live site too)
            if target_local_path.replace(os.path.sep, '/').startswith('docs/files/'):
                continue
            if not os.path.exists(target_local_path):
                broken_links.append((local_path, url, target_local_path))
                
    return broken_links, external_docs_links

def main():
    if not os.path.exists(SITE_INDEX_FILE):
        print(f"Error: {SITE_INDEX_FILE} not found.")
        return
        
    with open(SITE_INDEX_FILE, "r", encoding="utf-8") as f:
        site_index = json.load(f)
        
    page_pathnames = get_page_pathnames(site_index)
    page_id_map = get_page_id_map(site_index)
    print(f"Verifying {len(page_pathnames)} pages...")
    
    missing = check_pages_exist(page_pathnames)
    if missing:
        print(f"FAIL: {len(missing)} missing files!")
        for pathname, local_path in missing:
            print(f" - Missing: {pathname} -> {local_path}")
    else:
        print("PASS: All pages from site index exist locally.")
        
    broken, non_rewritten = verify_links_consistency(page_pathnames, page_id_map)
    
    if broken:
        print(f"\nFAIL: Found {len(broken)} broken local links!")
        # Print top 20 broken links
        for src, url, target in broken[:20]:
            print(f" - in {src}: link '{url}' resolves to non-existent '{target}'")
        if len(broken) > 20:
            print(f"   ... and {len(broken) - 20} more.")
    else:
        print("PASS: No broken local links found.")
        
    if non_rewritten:
        print(f"\nWARNING: Found {len(non_rewritten)} links to developerdocs.instructure.com that were not rewritten!")
        for src, url in non_rewritten[:10]:
            print(f" - in {src}: '{url}'")
        if len(non_rewritten) > 10:
            print(f"   ... and {len(non_rewritten) - 10} more.")
    else:
        print("PASS: All developerdocs links were successfully rewritten.")

if __name__ == "__main__":
    main()
