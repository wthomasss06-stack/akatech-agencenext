from pathlib import Path
import re
for name in ['HomeClientDesktop.js','HomeClientMobile.js']:
 p=Path('/home/ubuntu/akatech-work/app')/name
 s=p.read_text()
 s=s.replace("text=t('", "text={t('")
 s=re.sub(r"text=\{t\('([^']+)'\)\}", r"text={t('\1')}", s)
 s=re.sub(r"text=\{t\('([^']+)'\)(\s*/?>)", r"text={t('\1')}\2", s)
 p.write_text(s)
