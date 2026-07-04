import os
import re
import json

# Paths
WORKSPACE_DIR = "/home/likr/work/likr/canvas-lms-agent"
DOCS_DIR = os.path.join(WORKSPACE_DIR, "docs/services/canvas/resources")
TOOLS_DIR = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/tools")

def parse_markdown_doc(doc_path):
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split content by markdown headers of endpoints (#### `METHOD PATH`)
    pattern = r'(####\s+`(?:GET|POST|PUT|DELETE)\s+[^`]+`)'
    sections = re.split(pattern, content)
    
    parsed_endpoints = []
    
    for i in range(1, len(sections), 2):
        header = sections[i]
        body = sections[i+1] if i+1 < len(sections) else ""
        
        match = re.search(r'`(GET|POST|PUT|DELETE)\s+([^`]+)`', header)
        if not match:
            continue
        method = match.group(1)
        path = match.group(2).strip()
        
        desc_lines = []
        body_lines = body.strip().split("\n")
        in_params = False
        param_lines = []
        
        for line in body_lines:
            stripped = line.strip()
            if stripped.startswith("#### Request Parameters:"):
                in_params = True
                continue
            if in_params:
                if stripped.startswith("###") or (stripped == "" and len(param_lines) > 0 and not stripped.startswith("|")):
                    in_params = False
                elif stripped.startswith("|") or stripped == "":
                    if stripped.startswith("|"):
                        param_lines.append(stripped)
                    continue
            
            if not in_params and not stripped.startswith("#"):
                desc_lines.append(line)
        
        description = "\n".join(desc_lines).strip()
        description = re.sub(r'<[^>]+>', '', description)
        description = re.sub(r'\s+', ' ', description)
        # Keep descriptions reasonably sized but no longer restricted by strict MCP limits
        if len(description) > 1000:
            description = description[:997] + "..."
        if not description:
            description = f"Canvas API endpoint: {method} {path}"

        properties = {}
        required = []
        
        path_params = re.findall(r':([a-zA-Z0-9_]+)', path)
        path_params += re.findall(r'\{([a-zA-Z0-9_]+)\}', path)
        path_params += re.findall(r'\*([a-zA-Z0-9_]+)', path)
        for p in path_params:
            properties[p] = {
                "type": "string",
                "description": f"Path parameter: {p}"
            }
            if p not in required:
                required.append(p)
                
        for pline in param_lines:
            pline = pline.strip()
            if "Parameter" in pline or "---" in pline:
                continue
            parts = [p.strip() for p in pline.split("|")]
            if len(parts) >= 4:
                pname = parts[1].replace("`", "").strip()
                ptype_raw = parts[2].replace("`", "").strip()
                pdesc = parts[3].strip()
                
                is_req = "Required" in ptype_raw
                ptype_lower = ptype_raw.lower()
                
                ptype = "string"
                if "integer" in ptype_lower or "number" in ptype_lower or "float" in ptype_lower:
                    ptype = "number"
                elif "boolean" in ptype_lower:
                    ptype = "boolean"
                elif "array" in ptype_lower:
                    ptype = "array"
                elif "object" in ptype_lower:
                    ptype = "object"
                
                properties[pname] = {
                    "type": ptype,
                    "description": pdesc if pdesc else f"Parameter {pname}"
                }
                if is_req and pname not in required:
                    required.append(pname)
                    
        parsed_endpoints.append({
            "method": method,
            "path": path,
            "description": description,
            "parameters": properties,
            "required": required
        })
        
    return parsed_endpoints

def main():
    print("Scanning documentation directory...")
    all_endpoints = []
    
    for filename in sorted(os.listdir(DOCS_DIR)):
        if not filename.endswith(".md"):
            continue
            
        doc_path = os.path.join(DOCS_DIR, filename)
        parsed = parse_markdown_doc(doc_path)
        if parsed:
            all_endpoints.extend(parsed)
            print(f"Parsed {len(parsed)} endpoints from {filename}")

    # Remove duplicates based on method and path
    unique_endpoints = []
    seen = set()
    for ep in all_endpoints:
        key = (ep["method"], ep["path"])
        if key not in seen:
            seen.add(key)
            unique_endpoints.append(ep)

    out_path = os.path.join(TOOLS_DIR, "endpoints.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(unique_endpoints, f, indent=2)
        
    print(f"Successfully generated endpoints.json with {len(unique_endpoints)} total endpoints.")

if __name__ == "__main__":
    main()
