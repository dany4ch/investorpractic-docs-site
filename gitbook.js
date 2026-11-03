
const nav = document.querySelector('#doc-nav');
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const root = window.DOC_ROOT || '';
const entries = window.DOC_NAV || [];
const current = decodeURIComponent(location.pathname);
const active = entries.findIndex(item => current.endsWith('/' + item.url));

function makeLink(item) {
  const link = document.createElement('a');
  link.href = root + item.url;
  link.textContent = item.title;
  if (current.endsWith('/' + item.url)) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
  return link;
}

const levels = [{depth: -1, container: nav}];
for (let i = 0; i < entries.length; i++) {
  const item = entries[i];
  while (levels.length > 1 && levels.at(-1).depth >= item.depth) levels.pop();
  const parent = levels.at(-1).container;
  const next = entries[i + 1];
  if (next && next.depth > item.depth) {
    const group = document.createElement('details');
    group.className = 'nav-group';
    const label = document.createElement('summary');
    label.append(makeLink(item));
    group.append(label);
    const children = document.createElement('div');
    children.className = 'nav-children';
    group.append(children);
    parent.append(group);
    if (active >= i && active > -1) {
      const end = entries.findIndex((other, j) => j > i && other.depth <= item.depth);
      if (end === -1 || active < end) group.open = true;
    }
    levels.push({depth: item.depth, container: children});
  } else {
    const link = makeLink(item);
    link.classList.add('nav-leaf');
    parent.append(link);
  }
}

function showResults() {
  const query = search.value.trim().toLocaleLowerCase('ru');
  results.replaceChildren();
  nav.hidden = Boolean(query);
  if (!query) return;
  const matched = window.DOC_PAGES.filter(page =>
    (page.title + ' ' + page.url).toLocaleLowerCase('ru').includes(query)
  ).slice(0, 50);
  for (const page of matched) {
    const link = document.createElement('a');
    link.href = root + page.url;
    link.textContent = page.title;
    results.append(link);
  }
  if (!matched.length) results.textContent = 'Ничего не найдено';
}
search.addEventListener('input', showResults);
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); search.focus(); search.select();
  }
  if (event.key === 'Escape' && document.activeElement === search) {
    search.value = ''; showResults(); search.blur();
  }
});

if (active >= 0) {
  const footer = document.createElement('footer');
  footer.className = 'page-neighbors';
  for (const [index, label] of [[active - 1, '← Назад'], [active + 1, 'Далее →']]) {
    if (index < 0 || index >= entries.length) continue;
    const link = makeLink(entries[index]);
    link.textContent = label + ' · ' + entries[index].title;
    footer.append(link);
  }
  document.querySelector('article').after(footer);
  nav.querySelector('[aria-current="page"]')?.scrollIntoView({block: 'center'});
}
