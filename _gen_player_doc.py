import json
from pathlib import Path

root = Path(r"c:\Users\31882\Desktop\BATI\web")
chars = json.loads((root / "src" / "data" / "characters.json").read_text(encoding="utf-8"))

dim_explain = [
    ("\u7403\u6743\uff08usage\uff09", "\u4ece\u65e0\u7403\u7ec8\u7ed3\u5230\u9ad8\u6301\u7403\u4e3b\u5bfc"),
    ("\u533a\u57df\uff08range\uff09", "\u4ece\u5185\u7ebf\u7ec8\u7ed3\u5230\u5916\u7ebf\u6295\u5c04"),
    ("\u5bf9\u6297\uff08physical\uff09", "\u4ece\u56de\u907f\u8eab\u4f53\u63a5\u89e6\u5230\u5f3a\u786c\u5bf9\u6297"),
    ("\u6218\u672f\uff08playmaking\uff09", "\u4ece\u7ec8\u7ed3\u70b9\u5230\u7ec4\u7ec7\u53d1\u8d77\u70b9"),
    ("\u9632\u5b88\uff08defense\uff09", "\u4ece\u4f4e\u6295\u5165\u5230\u9ad8\u5f3a\u5ea6\u9632\u5b88"),
    ("\u60c5\u7eea\uff08temperament\uff09", "\u4ece\u51b7\u9759\u514b\u5236\u5230\u9ad8\u6fc0\u60c5\u5916\u653e"),
]

lines = []
lines.append("# BATI \u7403\u661f\u98ce\u683c\u4e0e\u8bc4\u5206\u6807\u51c6\n")
lines.append("## \u4e00\u3001\u8bc4\u5206\u6807\u51c6\uff08\u516d\u7ef4\uff09\n")
lines.append("- \u516d\u4e2a\u7ef4\u5ea6\uff1a\u7403\u6743\uff08usage\uff09\u3001\u533a\u57df\uff08range\uff09\u3001\u5bf9\u6297\uff08physical\uff09\u3001\u6218\u672f\uff08playmaking\uff09\u3001\u9632\u5b88\uff08defense\uff09\u3001\u60c5\u7eea\uff08temperament\uff09")
lines.append("- \u8bc4\u5206\u91c7\u7528 1~3 \u5206\uff1a")
lines.append("  - `1` = \u4f4e\uff08L\uff09")
lines.append("  - `2` = \u4e2d\uff08M\uff09")
lines.append("  - `3` = \u9ad8\uff08H\uff09\n")
lines.append("### \u7ef4\u5ea6\u89e3\u91ca\n")
for k,v in dim_explain:
    lines.append(f"- `{k}`\uff1a{v}")

lines.append("\n## \u4e8c\u3001\u7403\u661f\u5bf9\u5e94\u98ce\u683c\u4e0e\u8bc4\u5206\n")
lines.append("| \u7f16\u53f7 | \u7403\u661f | \u7403\u98ce | \u7403\u6743 | \u533a\u57df | \u5bf9\u6297 | \u6218\u672f | \u9632\u5b88 | \u60c5\u7eea |")
lines.append("|---|---|---|---:|---:|---:|---:|---:|---:|")
for c in chars:
    v = c["vector"]
    style = c["style"].replace("|", "\\|")
    lines.append(f"| {c['index']} | {c['name']} | {style} | {v['usage']} | {v['range']} | {v['physical']} | {v['playmaking']} | {v['defense']} | {v['temperament']} |")

lines.append("\n## \u4e09\u3001\u5feb\u901f\u4f7f\u7528\u8bf4\u660e\n")
lines.append("- \u5728\u5339\u914d\u903b\u8f91\u4e2d\uff0c\u53ef\u5c06\u7528\u6237\u516d\u7ef4\u5411\u91cf\u4e0e\u4e0a\u8868\u516d\u7ef4\u5206\u6570\u505a\u8ddd\u79bb\u8ba1\u7b97\uff08\u5982\u66fc\u54c8\u987f\u8ddd\u79bb\uff09")
lines.append("- \u8ddd\u79bb\u6700\u5c0f\u7684\u7403\u661f\u5373\u4e3a\u547d\u4e2d\u7ed3\u679c")
lines.append("- \u82e5\u9700\u53ef\u89e3\u91ca\u6027\u5c55\u793a\uff0c\u53ef\u91cd\u70b9\u8f93\u51fa\u5dee\u8ddd\u6700\u5c0f\u7684 2~3 \u4e2a\u7ef4\u5ea6\n")

out = root / "\u7403\u661f\u98ce\u683c\u4e0e\u8bc4\u5206\u6807\u51c6.md"
out.write_text("\n".join(lines), encoding="utf-8")
print(out)
