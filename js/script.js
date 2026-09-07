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
      if(entry.isIntersecting){
        entry.target.classList.remove('pending');
        if (entry.target.matches('.experience-content')) entry.target.closest('.experience').classList.add('experience-entered');
        revealObserver.unobserve(entry.target);
      }
    }), {threshold:0.08});
    grid.querySelectorAll('.product-card').forEach((card, index) => {
      card.classList.add('reveal');
      card.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
    });
    document.querySelectorAll('.reveal').forEach(element => {
      const pieces = element.querySelectorAll('.eyebrow, h2, .hero-description, .about-copy > p:not(.eyebrow), .menu-intro, .featured-copy > p:not(.eyebrow), .featured-copy h3, .featured-photo, .review-score, .reviews-copy > p:not(.eyebrow), .order-inner > div > p:not(.eyebrow), .order-action, .location-copy > address, .location-copy > .hours, .experience-content > p:not(.eyebrow), .experience-details');
      if (pieces.length) {
        element.classList.add('reveal-group');
        pieces.forEach(piece => {
          piece.classList.add('reveal-piece');
          const stage = piece.matches('.eyebrow') ? 0 : piece.matches('h2,h3') ? 1 : piece.matches('p,address,.menu-intro') ? 2 : 3;
          piece.style.setProperty('--reveal-delay', `${stage * 90}ms`);
        });
      }
      if (element.matches('.experience-content')) element.closest('.experience').classList.add('experience-prepared');
      element.classList.add('pending');
      revealObserver.observe(element);
    });
    // Acessibilidade: foco e reducao de movimento nunca esperam pelo reveal.
    document.addEventListener('focusin', event => {
      const group = event.target.closest('.reveal.pending');
      if (group) { group.classList.remove('pending'); revealObserver.unobserve(group); }
    });
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
      if (!event.matches) return;
      revealObserver.disconnect();
      document.querySelectorAll('.reveal.pending').forEach(element => element.classList.remove('pending'));
      document.querySelector('.experience').classList.add('experience-entered');
    });
  }
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){navigation.querySelectorAll('a[href^="#"]').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));}
  }), {rootMargin:'-15% 0px -65% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

// Profundidade apenas com mouse em desktop; nenhum loop permanente em repouso.
(() => {
  const hero = document.querySelector('.hero');
  const burger = document.querySelector('.hero-burger');
  const experience = document.querySelector('.experience');
  const photo = document.querySelector('.experience-photo');
  const desktop = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0, depth = 0, targetDepth = 0;
  const enabled = () => desktop.matches && !reduced.matches && !navigator.maxTouchPoints && !document.hidden;
  function tick() {
    frame = 0;
    if (!enabled()) return;
    x += (targetX - x) * .12;
    y += (targetY - y) * .12;
    depth += (targetDepth - depth) * .12;
    burger.style.setProperty('--burger-x', `${x.toFixed(2)}px`);
    burger.style.setProperty('--burger-y', `${y.toFixed(2)}px`);
    photo.style.setProperty('--bbq-depth', `${depth.toFixed(2)}px`);
    if (Math.abs(targetX-x) + Math.abs(targetY-y) + Math.abs(targetDepth-depth) > .05) frame = requestAnimationFrame(tick);
  }
  function schedule() { if (enabled() && !frame) frame = requestAnimationFrame(tick); }
  hero.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    targetX = Math.max(-10, Math.min(10, ((event.clientX-rect.left)/rect.width-.5)*20));
    targetY = Math.max(-10, Math.min(10, ((event.clientY-rect.top)/rect.height-.5)*20));
    schedule();
  }, {passive:true});
  hero.addEventListener('pointerleave', () => {targetX = targetY = 0; schedule();});
  function onScroll() {
    if (!enabled()) return;
    const rect = experience.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    targetDepth = Math.max(-8, Math.min(8, (innerHeight/2-rect.top-rect.height/2)*.025));
    schedule();
  }
  function reset() {
    cancelAnimationFrame(frame); frame = 0;
    x = y = targetX = targetY = depth = targetDepth = 0;
    burger.style.removeProperty('--burger-x'); burger.style.removeProperty('--burger-y');
    photo.style.removeProperty('--bbq-depth');
    onScroll();
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  desktop.addEventListener('change', reset);
  reduced.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => entries.forEach(entry => {
      hero.classList.toggle('hero-offscreen', !entry.isIntersecting);
      if (!entry.isIntersecting) {targetX = targetY = 0; schedule();}
    })).observe(hero);
  }
})();
