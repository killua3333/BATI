import json
import re
from pathlib import Path

root = Path(r'c:\Users\31882\Desktop\BATI')
web_data = root / 'web' / 'src' / 'data'

b1 = (root / 'b1_questions.txt').read_text(encoding='utf-8')
b3 = (root / 'b3_player_traits.txt').read_text(encoding='utf-8')

block_pattern = re.compile(r"(?m)^(\d+)\.\s*\n([^\n]+)\n\s*\(([^\n]+)\)\n馃弨\s*\n鐞冮锛歕s*\n([^\n]+)\n馃懁\s*\n浜烘牸锛歕s*\n([^\n]+(?:\n(?!\d+\.\s*$|鐞冩槦鐗瑰緛鍚戦噺鎬昏〃).+)*)")
blocks = {}
for m in block_pattern.finditer(b3):
    idx = int(m.group(1))
    blocks[idx] = {
        'name': m.group(2).strip(),
        'enName': m.group(3).strip(),
        'style': m.group(4).strip(),
        'personality': m.group(5).replace('\n', ' ').strip(),
    }

vector_pattern = re.compile(
    r"xml:space=\"preserve\">(\d+)\n"
    r".*?xml:space=\"preserve\">([^\n<]+)\n"
    r".*?xml:space=\"preserve\">([123])\n"
    r".*?xml:space=\"preserve\">([123])\n"
    r".*?xml:space=\"preserve\">([123])\n"
    r".*?xml:space=\"preserve\">([123])\n"
    r".*?xml:space=\"preserve\">([123])\n"
    r".*?xml:space=\"preserve\">([123])",
    re.S,
)

vectors = {}
for m in vector_pattern.finditer(b3):
    idx = int(m.group(1))
    if 1 <= idx <= 30 and idx not in vectors:
        vectors[idx] = {
            'usage': int(m.group(3)),
            'range': int(m.group(4)),
            'physical': int(m.group(5)),
            'playmaking': int(m.group(6)),
            'defense': int(m.group(7)),
            'temperament': int(m.group(8)),
        }

slug = lambda s: re.sub(r"[^a-z0-9]+", '-', s.lower()).strip('-')
characters = []
for i in range(1, 31):
    if i in blocks and i in vectors:
        b = blocks[i]
        characters.append({
            'id': slug(b['enName']),
            'index': i,
            'name': b['name'],
            'enName': b['enName'],
            'vector': vectors[i],
            'style': b['style'],
            'personality': b['personality'],
        })

# parse 20 base questions
dim_by_id = {1:'usage',2:'usage',3:'usage',4:'range',5:'range',6:'range',7:'physical',8:'physical',9:'physical',10:'playmaking',11:'playmaking',12:'playmaking',13:'defense',14:'defense',15:'defense',16:'temperament',17:'temperament',18:'temperament',19:'temperament',20:'temperament'}
questions = []

def compact(s):
    return re.sub(r"\s+", '', s).strip(' :')

for i in range(1, 20):
    block_re = re.compile(rf"绗琝s*{i}\s*棰?.*?)(?=绗琝s*{i+1}\s*棰榺闅愯棌瑙﹀彂棰橈紙绗琝s*20\s*棰橈級)", re.S)
    m = block_re.search(b1)
    if not m:
        continue
    qa = re.search(r"(.*?)A\.\s*(.*?)B\.\s*(.*?)C\.\s*(.*)", m.group(1), re.S)
    if not qa:
        continue
    questions.append({
        'id': i,
        'dimension': dim_by_id[i],
        'prompt': compact(qa.group(1)),
        'options': [
            {'key':'A','text':compact(qa.group(2)),'score':1},
            {'key':'B','text':compact(qa.group(3)),'score':2},
            {'key':'C','text':compact(qa.group(4)),'score':3},
        ],
    })

m20 = re.search(r"闅愯棌瑙﹀彂棰橈紙绗琝s*20\s*棰橈級(.*?)(?=棰樼洰鎬昏)", b1, re.S)
if m20:
    qa = re.search(r"(.*?)A\.\s*(.*?)B\.\s*(.*?)C\.\s*(.*)", m20.group(1), re.S)
    if qa:
        questions.append({
            'id': 20,
            'dimension': 'temperament',
            'hiddenTrigger': True,
            'prompt': compact(qa.group(1)),
            'options': [
                {'key':'A','text':compact(qa.group(2)),'score':1},
                {'key':'B','text':compact(qa.group(3)),'score':3},
                {'key':'C','text':compact(qa.group(4)),'score':3,'triggers':'keyboard-warrior'},
            ],
        })

extra_dims = ['usage','range','physical','playmaking','defense','temperament']
for i in range(21, 40):
    d = extra_dims[(i - 21) % len(extra_dims)]
    questions.append({
        'id': i,
        'dimension': d,
        'prompt': f'Extended {i}: In high pressure game moments, what do you prefer?',
        'options': [
            {'key':'A','text':'Play safe and stable','score':1},
            {'key':'B','text':'Balance risk and reward','score':2},
            {'key':'C','text':'Take over aggressively','score':3},
        ],
    })

questions = sorted(questions, key=lambda x: x['id'])[:39]

(web_data / 'characters.json').write_text(json.dumps(characters, ensure_ascii=False, indent=2), encoding='utf-8')
(web_data / 'questions.json').write_text(json.dumps(questions, ensure_ascii=False, indent=2), encoding='utf-8')

visuals = {c['id']: {'theme': ['gold','blue','purple','emerald','red'][c['index'] % 5]} for c in characters}
prob = {c['id']: round(1 / len(characters), 6) for c in characters}
(web_data / 'characterVisuals.json').write_text(json.dumps(visuals, ensure_ascii=False, indent=2), encoding='utf-8')
(web_data / 'characterProbabilities.json').write_text(json.dumps(prob, ensure_ascii=False, indent=2), encoding='utf-8')

print('characters', len(characters), 'questions', len(questions))
