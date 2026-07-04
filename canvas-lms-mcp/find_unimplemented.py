import os
import re

# 1. Get implemented endpoints from API_STATUS.md
implemented_endpoints = set()
api_status_path = "/home/likr/src/likr-sandbox/canvas-lms-agent/canvas-lms-mcp/API_STATUS.md"

with open(api_status_path, "r", encoding="utf-8") as f:
    for line in f:
        # Parse table row. e.g. | 1 | get_current_user | ... | GET /api/v1/users/self | ...
        if line.startswith("|") and not "Tool Name" in line and not "---" in line:
            parts = [p.strip() for p in line.split("|")]
            if len(parts) > 4:
                # 4th column is API Endpoint. `GET /api/...`
                endpoint = parts[4].replace("`", "").strip()
                if endpoint:
                    # Sometimes there may be multiple endpoints separated by space or comma, but let's assume one per row.
                    # Handle possible multiple endpoints in a single cell (e.g. if separated by <br> or newlines)
                    for sub_ep in re.split(r'<br\s*/?>|\n', endpoint):
                        sub_ep = sub_ep.replace("`", "").strip()
                        if sub_ep:
                            implemented_endpoints.add(sub_ep)

print(f"Implemented endpoints count: {len(implemented_endpoints)}")

# 2. Get endpoints defined in docs/services/canvas/resources/*.md
resources_dir = "/home/likr/src/likr-sandbox/canvas-lms-agent/docs/services/canvas/resources"
all_doc_endpoints = {}

# Regex for endpoint. e.g. #### `GET /api/v1/courses/:id`
endpoint_re = re.compile(r'^####\s+`(GET|POST|PUT|DELETE)\s+([^`]+)`')

for filename in os.listdir(resources_dir):
    if not filename.endswith(".md"):
        continue
    filepath = os.path.join(resources_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            match = endpoint_re.match(line.strip())
            if match:
                method = match.group(1)
                path = match.group(2).strip()
                full_endpoint = f"{method} {path}"
                if filename not in all_doc_endpoints:
                    all_doc_endpoints[filename] = []
                all_doc_endpoints[filename].append(full_endpoint)

# 3. Compare by normalizing placeholders
def normalize_path(path):
    # e.g., "/api/v1/courses/:course_id/assignments/:id" -> "/api/v1/courses/:placeholder/assignments/:placeholder"
    # Also replaces something like {course_id} or :id
    normalized = re.sub(r':[a-zA-Z0-9_]+', ':placeholder', path)
    normalized = re.sub(r'\{[a-zA-Z0-9_]+\}', ':placeholder', normalized)
    # Remove trailing slash
    normalized = normalized.rstrip('/')
    return normalized

def normalize_endpoint(endpoint):
    parts = endpoint.split(" ")
    if len(parts) < 2:
        return endpoint
    method = parts[0]
    path = parts[1]
    return f"{method} {normalize_path(path)}"

normalized_implemented = {normalize_endpoint(ep) for ep in implemented_endpoints}

unimplemented = {}
total_doc_endpoints = 0
for filename, endpoints in all_doc_endpoints.items():
    for ep in endpoints:
        total_doc_endpoints += 1
        norm_ep = normalize_endpoint(ep)
        if norm_ep not in normalized_implemented:
            if filename not in unimplemented:
                unimplemented[filename] = []
            unimplemented[filename].append(ep)

print(f"Total endpoints found in docs: {total_doc_endpoints}")

# Print output
total_unimplemented = 0
print("\n## Unimplemented Endpoints by Document:")
for filename, eps in sorted(unimplemented.items()):
    print(f"\n### {filename}")
    for ep in eps:
        print(f" - {ep}")
        total_unimplemented += 1

print(f"\nTotal unimplemented: {total_unimplemented}")
