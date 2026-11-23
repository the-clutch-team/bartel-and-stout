const products = [
  {name: 'Lens cleaning tissue', price: 8},
  {name: 'Microscope slides', price: 16},
  {name: 'Microscope dust cover', price: 24}
];
const dialog = document.querySelector('#dialog');
const panel = document.querySelector('#panel');
const back = document.querySelector('#back');
const cartButton = document.querySelector('[data-cart]');
function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('bs-shop'));
    if (Array.isArray(saved)) return products.map((_, i) => Number.isInteger(saved[i]) ? Math.max(0, Math.min(99, saved[i])) : 0);
  } catch {}
  return products.map(() => 0);
}
let cart = readCart();
function syncCart() {
  cartButton.textContent = 'View cart (' + cart.reduce((a,b) => a+b, 0) + ')';
  try { localStorage.setItem('bs-shop', JSON.stringify(cart)); } catch {}
}
function show(title, content, previous) {
  panel.innerHTML = '<h2 id="dialogTitle">' + title + '</h2>' + content;
  back.hidden = !previous;
  back.onclick = previous || null;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
function orderLines(editable) {
  return products.map((product,i) => {
    if (!cart[i]) return '';
    const quantity = editable
      ? '<div class="quantity"><button class="small" aria-label="Decrease '+product.name+' quantity" data-index="'+i+'" data-step="-1">−</button><span>'+cart[i]+'</span><button class="small" aria-label="Increase '+product.name+' quantity" data-index="'+i+'" data-step="1">+</button></div>'
      : '<span>Qty '+cart[i]+'</span>';
    return '<div class="row"><div><h3>'+product.name+'</h3><p>$'+product.price+' each</p></div>'+quantity+'<strong>$'+product.price*cart[i]+'</strong></div>';
  }).join('');
}
function subtotal() {
  const amount = products.reduce((sum,p,i) => sum + cart[i]*p.price, 0);
  return '<div class="summary"><strong>Sample subtotal</strong><strong>$'+amount+'</strong></div>';
}
function basket() {
  const content = cart.some(Boolean) ? orderLines(true)+subtotal()+'<button class="btn" data-review>Continue to checkout</button>' : '<p>Your cart is empty.</p><button class="btn" data-dismiss>Browse accessories</button>';
  show('Your cart',content);
}
function checkout() {
  show('Review your order','<p>This demo uses sample prices. Completing it clears the preview cart without taking payment.</p>'+orderLines(false)+subtotal()+'<button class="btn" data-complete>Complete demo order</button>',basket);
}
cartButton.onclick = basket;
document.querySelector('#close').onclick = () => dialog.close();
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if ('add' in data) {
    const i = Number(data.add);
    cart[i] = Math.min(99,cart[i]+1);
    syncCart();
    document.querySelector('#status').textContent = cart[i]+' '+products[i].name+' in cart';
    button.textContent = 'In cart ('+cart[i]+') · Add another';
  } else if ('step' in data) {
    const index = Number(data.index);
    cart[index] = Math.max(0,Math.min(99,cart[index]+Number(data.step)));
    syncCart();
    basket();
    (panel.querySelector('[data-index="'+index+'"][data-step="'+data.step+'"]') || panel.querySelector('button'))?.focus();
  } else if ('review' in data) checkout();
  else if ('dismiss' in data) dialog.close();
  else if ('complete' in data) {
    cart = products.map(() => 0);
    syncCart();
    show('Demo order complete','<p>For current availability and pricing, contact the sales team.</p><a class="btn" href="contact.html">Contact sales</a>');
  }
});
dialog.addEventListener('close', () => document.querySelectorAll('[data-add]').forEach(b => b.textContent='Add to cart'));
syncCart();
