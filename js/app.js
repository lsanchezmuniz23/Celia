(() => {
  'use strict';
  const data = window.CELIA_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const openedFlowers = new Set(JSON.parse(localStorage.getItem('celia-opened-flowers') || '[]'));
  const openedEnvelopes = new Set(JSON.parse(localStorage.getItem('celia-opened-envelopes') || '[]'));
  let lightboxIndex = 0;
  let toastTimer;

  const toast = (text) => {
    const el = $('#toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  };

  const petals = (count=45) => {
    const wrap = document.createElement('div');
    wrap.className = 'petals';
    const colors = ['#ff4f9b','#ffd84a','#9edaae','#c99be3','#ff8ec1'];
    for (let i=0;i<count;i++) {
      const p=document.createElement('i');
      p.className='petal';
      p.style.left=Math.random()*100+'vw';
      p.style.background=colors[i%colors.length];
      p.style.setProperty('--fall',(2.6+Math.random()*2.7)+'s');
      p.style.setProperty('--drift',(-90+Math.random()*180)+'px');
      p.style.animationDelay=(Math.random()*.6)+'s';
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(()=>wrap.remove(),5800);
  };

  // Scroll progress.
  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    $('.page-progress span').style.width=(max>0 ? scrollY/max*100 : 0)+'%';
  };
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  // Start button.
  $('#start-journey').addEventListener('click',()=>{
    petals(38);
    $('#bienvenida').scrollIntoView({behavior:'smooth'});
  });

  // Mobile nav.
  const toggle=$('.nav-toggle'), links=$('#nav-links');
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    links.classList.toggle('open',!open);
  });
  $$('#nav-links a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));

  // Reveal elements.
  const revealObserver = new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}});
  },{threshold:.12});
  $$('.reveal').forEach(el=>revealObserver.observe(el));

  // Flower reasons.
  const flowerGrid=$('#flower-grid');
  const flowerColors=['#ff5eaa','#ffd84a','#a3dfb3','#c99be3','#ff8bbb'];
  data.reasons.forEach((reason,i)=>{
    const b=document.createElement('button');
    b.className='flower-button';
    b.type='button';
    b.style.setProperty('--flower',flowerColors[i%flowerColors.length]);
    b.setAttribute('aria-label',`Razón ${i+1}: ${reason}`);
    b.innerHTML=`<span class="bloom" aria-hidden="true"></span><span class="core">${i+1}</span>`;
    if(openedFlowers.has(i)) b.classList.add('opened');
    b.addEventListener('click',()=>{
      const first=!openedFlowers.has(i);
      openedFlowers.add(i); b.classList.add('opened');
      localStorage.setItem('celia-opened-flowers',JSON.stringify([...openedFlowers]));
      updateFlowerCounter();
      toast(reason);
      if(first && openedFlowers.size===30){petals(70);setTimeout(()=>toast('Has abierto las 30 flores. El jardín ya es tuyo. ✿'),400);}
    });
    flowerGrid.appendChild(b);
  });
  const updateFlowerCounter=()=>{$('#flowers-opened').textContent=openedFlowers.size;}; updateFlowerCounter();

  // Message modal.
  const modal=$('#message-modal');
  const closeMessage=()=>modal.close();
  $('.modal__close',modal).addEventListener('click',closeMessage);
  modal.addEventListener('click',e=>{if(e.target===modal)closeMessage();});
  const openMessage=(m)=>{
    $('#message-symbol').textContent=m.symbol;
    $('#message-author').textContent=m.author;
    $('#message-title').textContent=m.title;
    $('#message-body').textContent=m.body;
    modal.showModal();
    document.body.classList.add('modal-open');
  };
  modal.addEventListener('close',()=>document.body.classList.remove('modal-open'));

  // Envelopes.
  const envColors=['#dbc0eb','#ffd1e3','#c9ead2','#ffe99c','#e3ccf0','#ffd2df','#c5e4cf','#e8d3f3'];
  const envGrid=$('#envelope-grid'), dotWrap=$('#envelope-dots');
  data.messages.forEach((m,i)=>{
    const card=document.createElement('button');
    card.type='button'; card.className='envelope-card reveal';
    card.style.setProperty('--env',envColors[i%envColors.length]);
    card.setAttribute('aria-label',`Abrir mensaje: ${m.title}`);
    card.innerHTML=`<span class="envelope"><span class="letter-preview"><span class="symbol" aria-hidden="true">${m.symbol}</span><h3>${m.title}</h3><p>${m.preview}</p></span><span class="envelope-seal" aria-hidden="true">C</span></span>`;
    if(openedEnvelopes.has(i)) card.classList.add('opened');
    card.addEventListener('click',()=>{
      const first=!openedEnvelopes.has(i);
      openedEnvelopes.add(i); card.classList.add('opened');
      localStorage.setItem('celia-opened-envelopes',JSON.stringify([...openedEnvelopes]));
      updateEnvelopeProgress();
      setTimeout(()=>openMessage(m),first?420:80);
      if(first && openedEnvelopes.size===data.messages.length) setTimeout(()=>petals(55),650);
    });
    envGrid.appendChild(card); revealObserver.observe(card);
    const d=document.createElement('i'); d.setAttribute('aria-hidden','true'); dotWrap.appendChild(d);
  });
  const updateEnvelopeProgress=()=>{
    $('#envelopes-opened').textContent=`${openedEnvelopes.size} de ${data.messages.length} sobres abiertos`;
    $$('#envelope-dots i').forEach((d,i)=>d.classList.toggle('on',openedEnvelopes.has(i)));
  }; updateEnvelopeProgress();

  // Gallery + lightbox.
  const gallery=$('#gallery'), lightbox=$('#lightbox'), lbImage=$('#lightbox-image');
  data.photos.forEach((p,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='gallery-item reveal';
    b.setAttribute('aria-label',`Abrir fotografía ${i+1} de ${data.photos.length}`);
    b.innerHTML=`<img src="${p.thumb}" data-full="${p.src}" alt="${p.alt}" loading="lazy" decoding="async" width="640" height="640">`;
    b.addEventListener('click',()=>showPhoto(i)); gallery.appendChild(b); revealObserver.observe(b);
  });
  const showPhoto=(i)=>{
    lightboxIndex=(i+data.photos.length)%data.photos.length;
    const p=data.photos[lightboxIndex]; lbImage.src=p.src; lbImage.alt=p.alt;
    $('#lightbox-title').textContent=`Recuerdo ${lightboxIndex+1} de ${data.photos.length}`;
    if(!lightbox.open) lightbox.showModal();
    document.body.classList.add('modal-open');
  };
  const closeLightbox=()=>lightbox.close();
  $('.lightbox__close').addEventListener('click',closeLightbox);
  $('.lightbox__prev').addEventListener('click',()=>showPhoto(lightboxIndex-1));
  $('.lightbox__next').addEventListener('click',()=>showPhoto(lightboxIndex+1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
  lightbox.addEventListener('close',()=>document.body.classList.remove('modal-open'));
  addEventListener('keydown',e=>{
    if(lightbox.open && e.key==='ArrowLeft')showPhoto(lightboxIndex-1);
    if(lightbox.open && e.key==='ArrowRight')showPhoto(lightboxIndex+1);
  });

  // Final bloom.
  let bloomed=false;
  $('#bloom-button').addEventListener('click',()=>{
    if(!bloomed){
      bloomed=true; const garden=$('#final-garden'); const colors=['#ff4f9b','#ffd84a','#9edaae','#c99be3','#ff8ec1'];
      for(let i=0;i<38;i++){
        const f=document.createElement('i'); f.className='final-flower';
        f.style.left=(1+Math.random()*98)+'%'; f.style.setProperty('--h',(55+Math.random()*145)+'px');
        f.style.setProperty('--c',colors[i%colors.length]); f.style.animationDelay=(Math.random()*.8)+'s';
        garden.appendChild(f);
      }
    }
    petals(90); toast('Feliz 30 cumpleaños, Celia. 💜');
  });
})();
