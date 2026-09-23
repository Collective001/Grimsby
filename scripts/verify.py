"""Verify published content, links, privacy, and mirrored Pages outputs."""
import json, pathlib, re
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
ROOT=pathlib.Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]; self.ids=set(); self.words=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        for key in ('src','href'):
            if key in a:self.links.append(a[key])
    def handle_data(self,data):self.words.append(data)
pages={}
for p in [ROOT/'index.html',ROOT/'archive.html',*(ROOT/'journal').glob('*.html')]:
    parsed=Page();parsed.feed(p.read_text());pages[p.resolve()]=parsed
    mirror=ROOT/'docs'/p.relative_to(ROOT)
    assert p.read_bytes()==mirror.read_bytes(),f'Mirror mismatch: {p}'
for p,parsed in pages.items():
    for link in parsed.links:
        u=urlsplit(link)
        if u.scheme or u.netloc:continue
        target=(p.parent/unquote(u.path)).resolve() if u.path else p
        assert target.exists(),f'Broken link {p}: {link}'
        if u.fragment and target in pages: assert u.fragment in pages[target].ids,f'Missing anchor: {link}'
entries=json.loads((ROOT/'content/journals.json').read_text())
normalize=lambda s:re.sub(r'\s+',' ',s).strip()
for e in entries:
    path=ROOT/'journal'/f'entry-{e["number"]:02d}.html'
    if not e['published']:
        assert not path.exists();continue
    parsed=pages[path.resolve()]
    actual=normalize(' '.join(parsed.words))
    for paragraph in e['text'].split('\n\n'):
        expected=normalize(re.sub(r'^- ','',paragraph,flags=re.M))
        assert expected in actual,f'Altered journal text: Entry {e["roman"]}'
    assert e['date'] in actual
home=(ROOT/'index.html').read_text()
assert 'October 24, 2026' in home and 'Seven in the Evening' in home
assert 'Covington, Kentucky' in home
assert 'type="password"' not in home
assert all(x not in home for x in ['PARIS','REVITALIZE','POLYMER','[date]'])
print(f'PASS: {len(pages)} pages, local links, journal fidelity, launch scope, and mirrored output.')
