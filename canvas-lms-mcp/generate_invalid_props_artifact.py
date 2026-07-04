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

with open('/home/likr/.gemini/antigravity-ide/brain/3ed4e76c-7c85-4878-ac4b-9163a28dc9a5/invalid_properties.md', 'w') as out:
    out.write('# Invalid Property Keys\n\n')
    out.write('The following property keys violate the MCP regex `^[a-zA-Z0-9_.-]{1,64}$`.\n')
    out.write('None of them exceed 64 characters; the error is caused by invalid characters like `[`, `]`, `:`, and `/`.\n\n')
    out.write('| Tool Name | Invalid Property Key |\n')
    out.write('| --------- | -------------------- |\n')
    for t, p in invalid_props:
        out.write(f'| `{t}` | `{p}` |\n')

