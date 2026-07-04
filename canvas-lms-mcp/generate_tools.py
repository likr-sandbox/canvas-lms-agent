import os
import re
import json

# Paths
WORKSPACE_DIR = "/home/likr/work/likr/canvas-lms-agent"
DOCS_DIR = os.path.join(WORKSPACE_DIR, "docs/services/canvas/resources")
TOOLS_DIR = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/tools")
TESTS_DIR = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/tests")

def get_segment_abbr(seg):
    if seg == 'current': return 'cur'
    if seg == 'completed': return 'cmp'
    if seg.startswith(':') or seg.startswith('{') or seg.startswith('*'):
        name = re.sub(r'[:{}*]', '', seg)
        return name[0] if name else ''
    else:
        words = re.split(r'[_\-]', seg)
        return ''.join([w[0] for w in words if w])

def clean_tool_name(method, path):
    cleaned = path
    for prefix in ['/api/v1', '/api/lti', '/api']:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):]
            break
            
    parts = [p for p in cleaned.split('/') if p]
    if not parts: return method.lower()
    
    last_literal_idx = -1
    for i in range(len(parts)-1, -1, -1):
        if not (parts[i].startswith(':') or parts[i].startswith('{') or parts[i].startswith('*')):
            last_literal_idx = i
            break
            
    if last_literal_idx == -1:
        prefix_parts = []
        suffix_parts = parts
    else:
        prefix_parts = parts[:last_literal_idx]
        suffix_parts = parts[last_literal_idx:]
        
    prefix_abbr = ''
    for p in prefix_parts:
        prefix_abbr += get_segment_abbr(p)
        
    cleaned_suffix = []
    for p in suffix_parts:
        p = re.sub(r':[a-zA-Z0-9_]+', lambda m: m.group(0)[1:], p)
        p = re.sub(r'\{([a-zA-Z0-9_]+)\}', r'\1', p)
        p = re.sub(r'\*([a-zA-Z0-9_]+)', r'\1', p)
        p = re.sub(r'[^a-zA-Z0-9_]', '_', p)
        p = re.sub(r'_+', '_', p).strip('_')
        cleaned_suffix.append(p)
        
    suffix_str = '_'.join(cleaned_suffix)
    
    if prefix_abbr:
        return f"{method.lower()}_{prefix_abbr}_{suffix_str}"
    else:
        return f"{method.lower()}_{suffix_str}"

def get_safe_var_name(category):
    # Replace hyphens/dots etc with underscore, ensure it's a valid JS identifier
    safe = re.sub(r'[^a-zA-Z0-9_]', '_', category)
    # Suffix to prevent conflict with local variables (like 'result') and JS keywords
    return f"{safe}Module"

def parse_markdown_doc(doc_path):
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split content by markdown headers of endpoints (#### `METHOD PATH`)
    pattern = r'(####\s+`(?:GET|POST|PUT|DELETE)\s+[^`]+`)'
    sections = re.split(pattern, content)
    
    parsed_endpoints = {}
    
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
        if len(description) > 500:
            description = description[:497] + "..."
        if not description:
            description = f"Canvas API endpoint: {method} {path}"

        properties = {}
        required = []
        prop_mappings = {}
        
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
                
                schema_pname = pname
                if len(pname) > 64:
                    import hashlib
                    h = hashlib.md5(pname.encode()).hexdigest()[:8]
                    # Try to create a readable short name
                    p_parts = pname.replace(']', '').split('[')
                    if len(p_parts) > 1:
                        prefix = ''.join([get_segment_abbr(px) for px in p_parts[:-1]])
                        schema_pname = f"{prefix}_{p_parts[-1]}"
                    if len(schema_pname) > 64:
                        schema_pname = f"prop_{h}"
                    prop_mappings[schema_pname] = pname
                
                properties[schema_pname] = {
                    "type": ptype,
                    "description": pdesc if pdesc else f"Parameter {pname}"
                }
                if is_req and schema_pname not in required:
                    required.append(schema_pname)
                    
        if method == "GET":
            properties["fetch_all_pages"] = {
                "type": "boolean",
                "description": "Optional: Set to true to automatically paginate and return all pages of results. Default is false."
            }

        parsed_endpoints[(method, path)] = {
            "description": description,
            "properties": properties,
            "required": required,
            "prop_mappings": prop_mappings
        }
        
    return parsed_endpoints

def make_test_case(category_var, tool_name, method, path, info):
    path_params = re.findall(r':([a-zA-Z0-9_]+)', path)
    path_params += re.findall(r'\{([a-zA-Z0-9_]+)\}', path)
    path_params += re.findall(r'\*([a-zA-Z0-9_]+)', path)
    
    args_dict = {}
    expected_url = path
    for p in path_params:
        val = f"test_{p}"
        args_dict[p] = val
        expected_url = expected_url.replace(f":{p}", val)
        expected_url = expected_url.replace(f"{{{p}}}", val)
        expected_url = expected_url.replace(f"*{p}", val)
        
    other_params = {}
    mapped_other_params = {}
    for schema_name, prop in info["properties"].items():
        if schema_name not in path_params and schema_name != "fetch_all_pages":
            ptype = prop.get("type", "string")
            if ptype == "number":
                val = 123
            elif ptype == "boolean":
                val = True
            elif ptype == "array":
                val = ["test_val"]
            else:
                val = "test_val"
                
            args_dict[schema_name] = val
            
            real_name = info.get("prop_mappings", {}).get(schema_name, schema_name)
            mapped_other_params[real_name] = val
            break
            
    method_lower = method.lower()
    config_field = "params" if method_lower in ["get", "delete"] else "data"
    
    return f"""test("{tool_name} calls correct endpoint", async () => {{
  let calledConfig = null;
  const mockClient = async (config) => {{
    calledConfig = config;
    return {{ data: {{ success: true }} }};
  }};

  const handler = {category_var}.handlers.{tool_name};
  assert.ok(handler, "Handler {tool_name} should be defined");

  const result = await handler(mockClient, {json.dumps(args_dict)});

  assert.strictEqual(calledConfig.method, "{method_lower}");
  assert.strictEqual(calledConfig.url, "{expected_url}");
  assert.deepStrictEqual(calledConfig.{config_field}, {json.dumps(mapped_other_params)});
  assert.deepStrictEqual(result, {{ success: true }});
}});"""

def main():
    print("Scanning documentation directory...")
    categories = []
    
    for filename in sorted(os.listdir(DOCS_DIR)):
        if not filename.endswith(".md"):
            continue
            
        doc_path = os.path.join(DOCS_DIR, filename)
        category = filename[:-3] # remove .md
        
        parsed = parse_markdown_doc(doc_path)
        if not parsed:
            continue
            
        categories.append(category)
        category_var = get_safe_var_name(category)
        
        definitions = []
        handlers_code = []
        tests_code = []
        
        seen_tools = set()
        for (method, path), info in parsed.items():
            tool_name = clean_tool_name(method, path)
            
            # Skip duplicates (e.g. find_recipients)
            if tool_name in seen_tools:
                continue
            seen_tools.add(tool_name)
            
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
            prop_mappings = info.get("prop_mappings", {})
            if prop_mappings:
                map_code = "    const mappedArgs = { ...args };\n"
                for short_n, full_n in prop_mappings.items():
                    map_code += f'    if ("{short_n}" in mappedArgs) {{\n'
                    map_code += f'      mappedArgs["{full_n}"] = mappedArgs["{short_n}"];\n'
                    map_code += f'      delete mappedArgs["{short_n}"];\n'
                    map_code += f'    }}\n'
                args_var = "mappedArgs"
            else:
                map_code = ""
                args_var = "args"

            handlers_code.append(
                f'  {tool_name}: async (client, args) => {{\n'
                f'{map_code}'
                f'    return genericHandler(client, "{method}", "{path}", {args_var});\n'
                f'  }}'
            )
            
            # Construct test case code
            tests_code.append(make_test_case(category_var, tool_name, method, path, info))
            
        # Write Category JS file
        js_path = os.path.join(TOOLS_DIR, f"{category}.js")
        handlers_joined = ",\n".join(handlers_code)
        js_content = f"""// Auto-generated MCP Tools for Canvas LMS API
// Generated by generate_tools.py - DO NOT EDIT MANUALLY

const {{ genericHandler }} = require("./helper");

const definitions = {json.dumps(definitions, indent=2)};

const handlers = {{
{handlers_joined}
}};

module.exports = {{
  definitions,
  handlers
}};
"""
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        # Write Category Test file
        test_path = os.path.join(TESTS_DIR, f"{category}.test.js")
        tests_joined = "\n\n".join(tests_code)
        test_content = f"""// Auto-generated tests for {category}
// Generated by generate_tools.py - DO NOT EDIT MANUALLY

const test = require("node:test");
const assert = require("node:assert");
const {category_var} = require("../tools/{category}");

{tests_joined}
"""
        with open(test_path, "w", encoding="utf-8") as f:
            f.write(test_content)
            
        print(f"Generated tools and tests for: {category} (var: {category_var})")

    # Write index.js for tools
    requires_code = []
    merges_code = []
    
    for category in categories:
        category_var = get_safe_var_name(category)
        requires_code.append(f'const {category_var} = require("./{category}");')
        merges_code.append(f'  ...{category_var}.definitions,')
        
    handlers_merges_code = [f'  ...{get_safe_var_name(category)}.handlers,' for category in categories]
    
    requires_joined = "\n".join(requires_code)
    merges_joined = "\n".join(merges_code)
    handlers_merges_joined = "\n".join(handlers_merges_code)
    
    index_content = f"""// Auto-generated MCP Tools Index
// Generated by generate_tools.py - DO NOT EDIT MANUALLY

{requires_joined}

const allDefinitions = [
{merges_joined}
];

const allHandlers = {{
{handlers_merges_joined}
}};

module.exports = {{
  allDefinitions,
  allHandlers,
}};
"""
    index_path = os.path.join(TOOLS_DIR, "index.js")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(index_content)
        
    print(f"Successfully generated index.js with {len(categories)} categories.")

if __name__ == "__main__":
    main()
