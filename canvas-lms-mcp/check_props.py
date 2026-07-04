import json
import os
import glob
import re

tools_dir = '/home/likr/work/likr/canvas-lms-agent/canvas-lms-mcp/tools'
files = glob.glob(os.path.join(tools_dir, '*.js'))

long_props = []

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
                        if len(p) > 64:
                            long_props.append((d['name'], p, len(p)))
            except Exception as e:
                print(f"Error parsing {f}: {e}")

if not long_props:
    print("No long properties found!")
else:
    for tool_name, prop, length in long_props:
        print(f"Tool: {tool_name}, Property: {prop}, Length: {length}")
