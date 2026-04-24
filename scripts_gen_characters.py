import json
import re
from pathlib import Path

root = Path(r'c:\Users\31882\Desktop\BATI')
web_data = root / 'web' / 'src' / 'data'
text = (root / 'b3_player_traits.txt').read_text(encoding='utf-8')
lines = [ln.strip() for ln in text.splitlines()]

profiles = {}
i = 0
while i < len(lines):
    if re.match(r'^\d+\.$', lines[i] or ''):
        idx = int(lines[i][:-1])
        j = i + 1
        block = []
        while j < len(lines) and not re.match(r'^\d+\.$', lines[j] or '') and 'xml:space="preserve">1' not in lines[j]:
            block.append(lines[j])
            j += 1
        nonempty = [x for x in block if x]
        if nonempty:
            name = nonempty[0]
            en = ''
            desc = []
            for item in nonempty[1:]:
                if item.startswith('(') and item.endswith(')') and not en:
                    en = item.strip('() ')
                elif (len(item) > 8) and (not item.startswith('<w:')) and (':' not in item):
                    desc.append(item)
            if desc:
                profiles[idx] = {
                    'name': name,
                    'enName': en,
                    'style': desc[0],
                    'personality': ' '.join(desc[1:]).strip() if len(desc) > 1 else ''
                }
        i = j
        continue
    i += 1

vector_pattern = re.compile(r"xml:space=\"preserve\">(\d+)\n.*?xml:space=\"preserve\">([^\n<]+)\n.*?xml:space=\"preserve\">([123])\n.*?xml:space=\"preserve\">([123])\n.*?xml:space=\"preserve\">([123])\n.*?xml:space=\"preserve\">([123])\n.*?xml:space=\"preserve\">([123])\n.*?xml:space=\"preserve\">([123])", re.S)
vectors = {}
for m in vector_pattern.finditer(text):
    idx = int(m.group(1))
    if 1 <= idx <= 30 and idx not in vectors:
        vectors[idx] = {'usage': int(m.group(3)), 'range': int(m.group(4)), 'physical': int(m.group(5)), 'playmaking': int(m.group(6)), 'defense': int(m.group(7)), 'temperament': int(m.group(8))}

slug = lambda s: re.sub(r'[^a-z0-9]+','-', s.lower()).strip('-') if s else ''
characters = []
for idx in range(1,31):
    p = profiles.get(idx)
    v = vectors.get(idx)
    if p and v:
        cid = slug(p['enName']) or f'player-{idx}'
        characters.append({'id': cid, 'index': idx, 'name': p['name'], 'enName': p['enName'], 'vector': v, 'style': p['style'], 'personality': p['personality']})

(web_data / 'characters.json').write_text(json.dumps(characters, ensure_ascii=False, indent=2), encoding='utf-8')
print('profiles',len(profiles),'vectors',len(vectors),'characters',len(characters))
