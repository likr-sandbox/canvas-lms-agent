import json
import os
import glob
import re

tools_dir = '/home/likr/work/likr/canvas-lms-agent/canvas-lms-mcp/tools'
files = glob.glob(os.path.join(tools_dir, '*.js'))

invalid_props = []

for f in files:
    if f.endswith('index.js') or f.endswith('helper.js'): continue
    with open(f, 'r') as fp:
        content = fp.read()
        match = re.search(r'const definitions = (\[.*?\]);\n\nconst handlers =', content, re.DOTALL)
        if match:
            try:
                defs = json.loads(match.group(1))
                for d in defs:
                    props = d.get('inputSchema', {}).get('properties', {})
                    for p in props.keys():
                        if not re.match(r'^[a-zA-Z0-9_.-]{1,64}$', p):
                            invalid_props.append((d['name'], p))
            except Exception as e:
                pass

if not invalid_props:
    print("No invalid properties found!")
else:
    for tool_name, prop in invalid_props:
        print(f"Tool: {tool_name}, Invalid Property: {prop}")
