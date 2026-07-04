import os
import re
import json

# Paths
WORKSPACE_DIR = "/home/likr/work/likr/canvas-lms-agent"
DOCS_DIR = os.path.join(WORKSPACE_DIR, "docs/services/canvas/resources")
TOOLS_DIR = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/tools")
TESTS_DIR = os.path.join(WORKSPACE_DIR, "canvas-lms-mcp/tests")

def clean_tool_name(method, path):
    # Remove prefix /api/v1, /api/lti, /api
    cleaned = path
    for prefix in ["/api/v1", "/api/lti", "/api"]:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):]
            break
    
    # Replace parameter patterns :param, {param}, *param (removing symbol, leaving param name)
    cleaned = re.sub(r':[a-zA-Z0-9_]+', lambda m: m.group(0)[1:], cleaned)
    cleaned = re.sub(r'\{([a-zA-Z0-9_]+)\}', r'\1', cleaned)
    cleaned = re.sub(r'\*([a-zA-Z0-9_]+)', r'\1', cleaned)
    
    # Replace non-alphanumeric chars with underscore
    cleaned = re.sub(r'[^a-zA-Z0-9_]', '_', cleaned)
    
    # Remove multiple underscores and leading/trailing underscores
    cleaned = re.sub(r'_+', '_', cleaned).strip('_')
    
    return f"{method.lower()}_{cleaned}"

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
    for name, prop in info["properties"].items():
        if name not in path_params:
            ptype = prop.get("type", "string")
            if ptype == "number":
                other_params[name] = 123
            elif ptype == "boolean":
                other_params[name] = True
            elif ptype == "array":
                other_params[name] = ["test_val"]
            else:
                other_params[name] = "test_val"
            break
            
    all_args = {**args_dict, **other_params}
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

  const result = await handler(mockClient, {json.dumps(all_args)});

  assert.strictEqual(calledConfig.method, "{method_lower}");
  assert.strictEqual(calledConfig.url, "{expected_url}");
  assert.deepStrictEqual(calledConfig.{config_field}, {json.dumps(other_params)});
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
        
        for (method, path), info in parsed.items():
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
