
const input=document.querySelector('#search'), box=document.querySelector('#results');
input.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase('ru');box.replaceChildren();if(!q)return;
for(const page of window.DOC_PAGES.filter(p=>(p.title+' '+p.url).toLocaleLowerCase('ru').includes(q)).slice(0,30)){
const a=document.createElement('a');a.href=window.DOC_ROOT+page.url;a.textContent=page.title+' · '+page.url;box.appendChild(a)}
if(!box.children.length)box.textContent='Ничего не найдено';});
