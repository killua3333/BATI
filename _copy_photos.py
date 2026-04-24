from pathlib import Path
import re
import shutil
import unicodedata

src = Path(r"c:\Users\31882\Desktop\BATI\photo")
dst = Path(r"c:\Users\31882\Desktop\BATI\web\public\photo")
dst.mkdir(parents=True, exist_ok=True)

for p in src.glob("*.jpeg"):
    name = unicodedata.normalize("NFKD", p.stem)
    name = "".join(ch for ch in name if not unicodedata.combining(ch))
    name = name.lower().replace("'", "").replace(" ", "")
    name = re.sub(r"[^a-z0-9]+", "", name)
    out = dst / f"{name}.jpeg"
    shutil.copy2(p, out)
    print(f"{p.name} -> {out.name}")
