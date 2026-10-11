const menuButton=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
const searchButton=document.querySelector('.search-toggle');
const searchPanel=document.querySelector('.search-panel');
const searchInput=document.querySelector('.search-form input');
const searchResults=document.querySelector('.search-results');
const bagButton=document.querySelector('.bag-toggle');
const bagDrawer=document.querySelector('.bag-drawer');
const bagBackdrop=document.querySelector('.drawer-backdrop');
const bagContent=document.querySelector('.bag-content');
const bagSummary=document.querySelector('.bag-summary');
const bagTotal=document.querySelector('.bag-total strong');
const bagCount=document.querySelector('.bag-count');
const toast=document.querySelector('.toast');
const products=new Map();
let toastTimer;

function closeMenu(){navLinks.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu')}
function setSearch(open){searchPanel.classList.toggle('is-open',open);searchPanel.setAttribute('aria-hidden',String(!open));searchButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('search-open',open);if(open)window.setTimeout(()=>searchInput.focus(),80);else{searchInput.value='';renderSearch('')}}
function setBag(open){bagDrawer.classList.toggle('is-open',open);bagBackdrop.classList.toggle('is-open',open);bagDrawer.setAttribute('aria-hidden',String(!open));bagBackdrop.setAttribute('aria-hidden',String(!open));bagButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('drawer-open',open)}
function showToast(message){toast.textContent=message;toast.classList.add('is-visible');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>toast.classList.remove('is-visible'),2200)}

function renderBag(){
  const items=[...products.entries()];
  const count=items.reduce((total,[,item])=>total+item.quantity,0);
  const subtotal=items.reduce((total,[,item])=>total+item.price*item.quantity,0);
  bagCount.textContent=count?String(count):'';
  bagContent.replaceChildren();
  bagSummary.hidden=!count;
  if(!count){const empty=document.createElement('div');empty.className='empty-bag';empty.innerHTML='<strong>Your bag is empty.</strong>Let’s find something wonderful.';bagContent.append(empty);return}
  for(const [name,item] of items){
    const row=document.createElement('div');row.className='bag-item';
    const label=document.createElement('strong');label.textContent=`${name} · ${item.quantity}`;
    const price=document.createElement('span');price.textContent=`$${(item.price*item.quantity).toLocaleString('en-US')}`;
    const remove=document.createElement('button');remove.type='button';remove.className='remove-item';remove.textContent='Remove';
    remove.addEventListener('click',()=>{products.delete(name);renderBag()});row.append(label,price,remove);bagContent.append(row);
  }
  bagTotal.textContent=`$${subtotal.toLocaleString('en-US')}`;
}
function addToBag(button){const {product,price}=button.dataset;const item=products.get(product)||{price:Number(price),quantity:0};item.quantity+=1;products.set(product,item);renderBag();showToast(`${product} added to your bag`)}
function renderSearch(query){
  searchResults.replaceChildren();const normalized=query.trim().toLowerCase();
  if(!normalized){searchResults.classList.remove('has-results');return}
  const matches=[...document.querySelectorAll('main h1,main h2,main h3')].filter((heading)=>heading.textContent.toLowerCase().includes(normalized));
  searchResults.classList.add('has-results');
  if(!matches.length){searchResults.textContent='No results found. Try another search.';return}
  for(const heading of matches){const link=document.createElement('a');link.href=`#${heading.closest('section,article').id||'top'}`;link.textContent=heading.textContent;link.addEventListener('click',()=>setSearch(false));searchResults.append(link)}
}

menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');navLinks.classList.toggle('is-open',open);if(open)setSearch(false)});
navLinks.addEventListener('click',(event)=>{if(event.target.closest('a'))closeMenu()});
searchButton.addEventListener('click',()=>{const open=!searchPanel.classList.contains('is-open');closeMenu();setSearch(open)});
document.querySelector('.search-close').addEventListener('click',()=>setSearch(false));
searchInput.addEventListener('input',()=>renderSearch(searchInput.value));
document.querySelector('.search-form').addEventListener('submit',(event)=>event.preventDefault());
bagButton.addEventListener('click',()=>setBag(true));
document.querySelector('.drawer-close').addEventListener('click',()=>setBag(false));
bagBackdrop.addEventListener('click',()=>setBag(false));
document.querySelectorAll('.add-button').forEach((button)=>button.addEventListener('click',()=>addToBag(button)));
document.querySelector('.checkout-button').addEventListener('click',()=>showToast('Checkout is a demo in this storefront'));
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){closeMenu();setSearch(false);setBag(false)}});
renderBag();