import os
import re
import json

# Paths
WORKSPACE_DIR = "/home/likr/src/likr-sandbox/canvas-lms-agent"
UNIMPLEMENTED_FILE = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/unimplemented_endpoints.txt")
DOCS_DIR = os.path.join(WORKSPACE_DIR, "docs/services/canvas/resources")
OUTPUT_FILE = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/tools/auto_generated.js")

def clean_tool_name(method, path):
    # Remove prefix /api/v1, /api/lti, /api
    cleaned = path
    for prefix in ["/api/v1", "/api/lti", "/api"]:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):]
            break
    
    # Replace parameter patterns :param, {param}, *param
    cleaned = re.sub(r':[a-zA-Z0-9_]+', lambda m: m.group(0)[1:], cleaned)
    cleaned = re.sub(r'\{([a-zA-Z0-9_]+)\}', r'\1', cleaned)
    cleaned = re.sub(r'\*([a-zA-Z0-9_]+)', r'\1', cleaned)
    
    # Replace non-alphanumeric chars with underscore
    cleaned = re.sub(r'[^a-zA-Z0-9_]', '_', cleaned)
    
    # Remove multiple underscores and leading/trailing underscores
    cleaned = re.sub(r'_+', '_', cleaned).strip('_')
    
    return f"auto_{method.lower()}_{cleaned}"

def parse_unimplemented_endpoints():
    endpoints = {}
    current_doc = None
    
    if not os.path.exists(UNIMPLEMENTED_FILE):
        print(f"Error: {UNIMPLEMENTED_FILE} not found.")
        return endpoints

    with open(UNIMPLEMENTED_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("### "):
                current_doc = line[4:].strip()
            elif line.startswith("- ") and current_doc:
                # Format: - METHOD PATH
                parts = line[2:].strip().split(" ", 1)
                if len(parts) == 2:
                    method, path = parts
                    if current_doc not in endpoints:
                        endpoints[current_doc] = []
                    endpoints[current_doc].append((method.strip(), path.strip()))
    return endpoints

def parse_markdown_doc(doc_name, target_endpoints):
    doc_path = os.path.join(DOCS_DIR, doc_name)
    if not os.path.exists(doc_path):
        return {}

    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split content by markdown headers of endpoints (#### `METHOD PATH`)
    # We want to keep the headers so we split but preserve
    pattern = r'(####\s+`(?:GET|POST|PUT|DELETE)\s+[^`]+`)'
    sections = re.split(pattern, content)
    
    parsed_endpoints = {}
    
    # sections will be: [header_info, header_match, body, header_match, body, ...]
    for i in range(1, len(sections), 2):
        header = sections[i]
        body = sections[i+1] if i+1 < len(sections) else ""
        
        # Extract method and path
        match = re.search(r'`(GET|POST|PUT|DELETE)\s+([^`]+)`', header)
        if not match:
            continue
        method = match.group(1)
        path = match.group(2).strip()
        
        # Check if this endpoint is in our target list
        # Normalize paths for matching
        is_target = False
        for target_method, target_path in target_endpoints:
            if target_method == method and target_path == path:
                is_target = True
                break
        
        if not is_target:
            continue
            
        # Parse description (paragraphs before parameters table or next section)
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
                    # End of parameters table
                    in_params = False
                elif stripped.startswith("|") or stripped == "":
                    if stripped.startswith("|"):
                        param_lines.append(stripped)
                    continue
            
            # If not in params, it's description
            if not in_params and not stripped.startswith("#"):
                desc_lines.append(line)
        
        description = "\n".join(desc_lines).strip()
        # Clean description HTML/Markdown
        description = re.sub(r'<[^>]+>', '', description) # remove html tags
        description = re.sub(r'\s+', ' ', description) # normalize whitespace
        if len(description) > 500:
            description = description[:497] + "..."
        if not description:
            description = f"Canvas API endpoint: {method} {path}"

        # Parse parameters
        properties = {}
        required = []
        
        # Path parameters are always required
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
                
        # Parse table parameters
        # Table format: | Parameter | Type | Description |
        # Skip headers: separator line "| --- | --- | --- |" and header line "| Parameter | Type |"
        for pline in param_lines:
            pline = pline.strip()
            if "Parameter" in pline or "---" in pline:
                continue
            parts = [p.strip() for p in pline.split("|")]
            if len(parts) >= 4:
                pname = parts[1].replace("`", "").strip()
                ptype_raw = parts[2].replace("`", "").strip()
                pdesc = parts[3].strip()
                
                # Check required
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
                    
        parsed_endpoints[(method, path)] = {
            "description": description,
            "properties": properties,
            "required": required
        }
        
    return parsed_endpoints

def main():
    print("Parsing unimplemented endpoints list...")
    unimplemented = parse_unimplemented_endpoints()
    
    definitions = []
    handlers_code = []
    
    total_parsed = 0
    for doc_name, targets in unimplemented.items():
        print(f"Parsing document {doc_name} for {len(targets)} targets...")
        doc_parsed = parse_markdown_doc(doc_name, targets)
        
        for (method, path), info in doc_parsed.items():
            tool_name = clean_tool_name(method, path)
            
            # Construct definition
            definition = {
                "name": tool_name,
                "description": info["description"],
                "inputSchema": {
                    "type": "object",
                    "properties": info["properties"],
                }
            }
            if info["required"]:
                definition["inputSchema"]["required"] = info["required"]
                
            definitions.append(definition)
            
            # Construct handler code
            handlers_code.append(
                f'  {tool_name}: async (client, args) => {{\n'
                f'    return genericHandler(client, "{method}", "{path}", args);\n'
                f'  }}'
            )
            total_parsed += 1

    print(f"Successfully parsed {total_parsed} tools.")
    
    # Write the output file
    handlers_joined = ",\n".join(handlers_code)
    js_content = f"""// Auto-generated MCP Tools for Canvas LMS API
// Generated by generate_tools.py - DO NOT EDIT MANUALLY

const genericHandler = async (client, method, pathPattern, args) => {{
  let url = pathPattern;
  const pathParams = [];
  
  // Replace path parameters (e.g. :user_id, {{user_id}}, *path)
  url = url.replace(/:([a-zA-Z0-9_]+)/g, (match, p1) => {{
    pathParams.push(p1);
    if (args[p1] !== undefined && args[p1] !== null) {{
      return encodeURIComponent(args[p1]);
    }}
    throw new Error(`Missing required path parameter: ${{p1}}`);
  }});
  
  url = url.replace(/\\{{([a-zA-Z0-9_]+)\\}}/g, (match, p1) => {{
    pathParams.push(p1);
    if (args[p1] !== undefined && args[p1] !== null) {{
      return encodeURIComponent(args[p1]);
    }}
    throw new Error(`Missing required path parameter: ${{p1}}`);
  }});

  url = url.replace(/\\*([a-zA-Z0-9_]+)/g, (match, p1) => {{
    pathParams.push(p1);
    if (args[p1] !== undefined && args[p1] !== null) {{
      // For wildcard paths, we might not want to URL encode slashes
      return args[p1];
    }}
    throw new Error(`Missing required path parameter: ${{p1}}`);
  }});

  const payload = {{}};
  for (const key in args) {{
    if (!pathParams.includes(key)) {{
      payload[key] = args[key];
    }}
  }}

  const config = {{
    method: method.toLowerCase(),
    url: url
  }};

  if (config.method === 'get' || config.method === 'delete') {{
    config.params = payload;
  }} else {{
    config.data = payload;
  }}

  const response = await client(config);
  return response.data;
}};

const definitions = {json.dumps(definitions, indent=2)};

const handlers = {{
{handlers_joined}
}};

module.exports = {{
  definitions,
  handlers
}};
"""
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Generated {OUTPUT_FILE} successfully.")

if __name__ == "__main__":
    main()
