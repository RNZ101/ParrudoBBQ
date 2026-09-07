'use strict';

// Entrada unica por carregamento, no mesmo breakpoint do layout de celular.
(() => {
  const mobile = matchMedia('(max-width: 600px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!mobile.matches || reducedMotion.matches) return;

  const root = document.documentElement;
  root.classList.add('mobile-entry');
  function finishEntry(completed = false) {
    clearTimeout(entryTimer);
    root.classList.remove('mobile-entry');
    // Os spans flutuam apenas depois da entrada; o H1 continua independente.
    if (completed === true && mobile.matches && !reducedMotion.matches) {
      root.classList.add('mobile-hero-ambient');
    }
    mobile.removeEventListener('change', finishEntry);
    reducedMotion.removeEventListener('change', finishEntry);
    window.removeEventListener('pagehide', finishEntry);
  }
  // Remover a classe evita repeticao ao redimensionar ou voltar pelo historico.
  mobile.addEventListener('change', finishEntry);
  reducedMotion.addEventListener('change', finishEntry);
  window.addEventListener('pagehide', finishEntry, {once: true});
  // A sequencia termina em 1s; a margem permite concluir o ultimo frame.
  const entryTimer = setTimeout(() => finishEntry(true), 1100);
})();

// Altere o telefone e os produtos demonstrativos aqui.
const PHONE = '5522997343358';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site da PARRUDOBBQ BURGER e gostaria de fazer um pedido.';
const products = [
  { name: 'Parrudo Clássico', category: 'burgers', price: 24.90, image: 'burger-hero.jpg', description: 'Blend artesanal, queijo derretido, salada fresca e molho especial no pão dourado.' },
  { name: 'Parrudo Bacon', category: 'burgers', price: 29.90, image: 'burger-bacon.jpg', description: 'Blend artesanal, queijo, bacon crocante e cebola caramelizada. Uma combinação de respeito.' },
  { name: 'Duplo Parrudo', category: 'burgers', price: 36.90, image: 'burger-hero.jpg', description: 'Dois blends, queijo em dobro e molho especial. Para uma fome que não aceita pouco.' },
  { name: 'Parrudo BBQ', category: 'bbq', price: 32.90, image: 'burger-bacon.jpg', description: 'Burger, queijo, cebola e molho BBQ. Uma ideia intensa, com aquela pegada defumada.' },
  { name: 'Costela BBQ Burger', category: 'bbq', price: 36.90, image: 'burger-hero.jpg', description: 'Costela desfiada, queijo e molho BBQ no pão macio. Inspiração de brasa em cada mordida.' },
  { name: 'Brutão BBQ', category: 'bbq', price: 39.90, image: 'burger-bacon.jpg', description: 'Blend, costela desfiada, queijo e cebola. Uma combinação para quem pensa grande.' },
  { name: 'Combo Parrudo', category: 'combos', price: 39.90, image: 'burger-hero.jpg', description: 'Uma sugestão completa: burger clássico, porção de batatas e uma bebida para acompanhar.' },
  { name: 'Batata Parruda', category: 'acompanhamentos', price: 24.90, image: 'batatas.jpg', description: 'Batatas douradas e crocantes, com uma sugestão de molho cremoso para acompanhar.' },
  { name: 'Batata da Casa', category: 'acompanhamentos', price: 20.90, image: 'batatas.jpg', description: 'Uma porção de batatas com tempero especial. Simples na ideia, parruda na vontade.' },
  { name: 'Refresco da Casa', category: 'bebidas', price: 12.90, image: 'bebidas.jpg', description: 'Uma sugestão de bebida refrescante com frutas. O contraponto perfeito para o seu burger.' }
];
const categoryNames = {burgers: 'Burgers', bbq: 'BBQ', combos: 'Combos', acompanhamentos: 'Acompanhamentos', bebidas: 'Bebidas'};
const whatsappUrl = message => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('[data-whatsapp]').forEach(link => { link.href = whatsappUrl(DEFAULT_MESSAGE); });

const grid = document.querySelector('#products');
const currency = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
products.forEach(product => {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = product.category;
  // Estes dados são definidos localmente, sem conteúdo fornecido por visitantes.
  card.innerHTML = `<div class="product-photo"><img src="assets/images/${product.image}" alt="Imagem ilustrativa da categoria ${categoryNames[product.category]} — não representa o produto oficial" width="800" height="485" loading="lazy"><span class="product-category">${categoryNames[product.category].toUpperCase()}</span></div><div class="product-content"><h3>${product.name}</h3><p>${product.description}</p><div class="product-bottom"><div class="price">${currency.format(product.price)}<small>valor demonstrativo</small></div><a class="product-order" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${product.name} pelo WhatsApp">Pedir<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></div></div>`;
  card.querySelector('a').href = whatsappUrl(`Olá! Vi o ${product.name} no site demonstrativo da PARRUDOBBQ BURGER e gostaria de saber mais.`);
  grid.append(card);
});
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    document.querySelectorAll('.filter').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    grid.querySelectorAll('.product-card').forEach(card => {
      card.hidden = category !== 'todos' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'produto demonstrativo exibido' : 'produtos demonstrativos exibidos'}.`;
  });
});

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {if(event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);});
document.addEventListener('click', event => {if (!event.target.closest('.nav-wrap')) closeMenu();});
document.addEventListener('focusin', event => {if (!event.target.closest('.nav-wrap')) closeMenu();});
matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());
const header = document.querySelector('#header');
function updateHeader(){header.classList.toggle('scrolled', window.scrollY > 20);}
window.addEventListener('scroll', updateHeader, {passive:true});
updateHeader();

// A logo original é preservada; se for removida, o nome mantém o layout.
document.querySelectorAll('.brand img').forEach(img => {
  function fallback(){img.hidden = true; img.nextElementSibling.hidden = false;}
  img.addEventListener('error', fallback);
  if(img.complete && !img.naturalWidth) fallback();
});
if ('IntersectionObserver' in window) {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.remove('pending');revealObserver.unobserve(entry.target);}
    }), {threshold:0.08});
    document.querySelectorAll('.reveal').forEach(element => {element.classList.add('pending');revealObserver.observe(element);});
  }
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){navigation.querySelectorAll('a[href^="#"]').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));}
  }), {rootMargin:'-15% 0px -65% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
