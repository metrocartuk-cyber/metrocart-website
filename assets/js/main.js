/* Lightweight animation fallback keeps navigation usable if the GSAP CDN is unavailable. */
(function () {
    if (window.gsap) return;

    function targetsOf(target) {
        if (target === window || target instanceof Element) return [target];
        if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
        return target && typeof target.length === 'number' ? Array.from(target) : [];
    }

    function apply(target, vars) {
        targetsOf(target).forEach(function (element) {
            if (vars.scrollTo && element === window) {
                var destination = vars.scrollTo.y;
                var top = typeof destination === 'number'
                    ? destination
                    : destination.getBoundingClientRect().top + window.scrollY - (vars.scrollTo.offsetY || 0);
                window.scrollTo({ top: top, behavior: 'smooth' });
                return;
            }
            if (!element.style) return;
            if (vars.opacity !== undefined) element.style.opacity = vars.opacity;
            if (vars.width !== undefined) element.style.width = typeof vars.width === 'number' ? vars.width + 'px' : vars.width;
            if (vars.height !== undefined) element.style.height = typeof vars.height === 'number' ? vars.height + 'px' : vars.height;
            if (vars.borderColor !== undefined) element.style.borderColor = vars.borderColor;
            if (vars.backgroundColor !== undefined) element.style.backgroundColor = vars.backgroundColor;
            var transforms = [];
            if (vars.x !== undefined) transforms.push('translateX(' + vars.x + 'px)');
            if (vars.y !== undefined) transforms.push('translateY(' + vars.y + 'px)');
            if (vars.scale !== undefined) transforms.push('scale(' + vars.scale + ')');
            if (transforms.length) element.style.transform = transforms.join(' ');
        });
    }

    function animate(target, vars, initialDelay) {
        var delay = initialDelay || 0;
        var duration = Math.max(0, Number(vars.duration || 0) * 1000);
        window.setTimeout(function () { apply(target, vars); }, delay);
        if (typeof vars.onComplete === 'function') {
            window.setTimeout(vars.onComplete, delay + duration);
        }
    }

    window.ScrollToPlugin = window.ScrollToPlugin || {};
    window.gsap = {
        registerPlugin: function () {},
        set: function (target, vars) { apply(target, vars); },
        to: function (target, vars) { animate(target, vars); return target; },
        fromTo: function (target, fromVars, toVars) {
            apply(target, fromVars);
            animate(target, toVars);
            return target;
        },
        timeline: function () {
            var cursor = 0;
            var api = {
                to: function (target, vars) {
                    animate(target, vars, cursor);
                    cursor += Math.max(0, Number(vars.duration || 0) * 1000);
                    return api;
                },
                call: function (callback) {
                    window.setTimeout(callback, cursor);
                    return api;
                }
            };
            return api;
        }
    };
})();

/* ============================================================
   METROCART BUSINESS SERVICES — Main JS v1.1.3
   SPA navigation with cookie persistence for refresh support.
============================================================ */
(function () {
    'use strict';

    var currentPage    = 'portal';
    var activeCategory = 'All Products';
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var PRODUCTS = [
        { id:1,  name:'Faani Frz. Grated Coconut (400G)',  category:'Frozen',  packing:'18 per carton', popular:true,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:2,  name:'Faani Frz. Grated Coconut (1KG)',   category:'Frozen',  packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:3,  name:'Ajwa Dates (300G)',                  category:'Dates',   packing:'24 per carton', popular:true,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:4,  name:'Mabroom Dates (300G)',               category:'Dates',   packing:'24 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:5,  name:'Aahaa Bhakharwadi (200G)',           category:'Ambient', packing:'25 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80' },
        { id:6,  name:'Aahaa Bhujia Munchy Masti (200G)',   category:'Ambient', packing:'25 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80' },
        { id:7,  name:'Aahaa Roasted Moong Dal (200G)',     category:'Ambient', packing:'25 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80' },
        { id:8,  name:'Aahaa Special Mix Namkeen (200G)',   category:'Ambient', packing:'25 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:9,  name:'Faani Frz. Mixed Vegetables (400G)', category:'Frozen',  packing:'18 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:10, name:'Faani Frz. Green Peas (400G)',       category:'Frozen',  packing:'18 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:11, name:'Safawi Dates (500G)',                category:'Dates',   packing:'12 per carton', popular:true,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:12, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:13, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:14, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:15, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:16, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:17, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:18, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:19, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        { id:20, name:'Sukari Soft Dates (500G)',           category:'Dates',   packing:'12 per carton', popular:false,
          img:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' }
    ];

    // ── Cookie helpers ────────────────────────────────────────
    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var d = new Date();
            d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + d.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
        try { window.localStorage.setItem(name, value); } catch (error) {}
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        if (match) return decodeURIComponent(match[1]);
        try { return window.localStorage.getItem(name); } catch (error) { return null; }
    }

    // ── Init ──────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        gsap.registerPlugin(ScrollToPlugin);

        initBgCanvas();
        initCursor();
        initMobileMenu();
        initScrollReveal();
        buildProductsGrid(PRODUCTS);
        buildFeaturedProducts();
        setupHeroAnchorLinks();

        // PHP already read the cookie and passed it via mcData.startPage.
        // Use that as the authoritative start page — no JS guessing needed.
        var valid     = ['portal', 'food', 'products', 'consultancy', 'legal'];
        var savedPage = getCookie('mc_page');
        var requestedPage = savedPage || mcData.startPage;
        var startPage = (requestedPage && valid.indexOf(requestedPage) !== -1)
                        ? requestedPage : 'portal';
        setPage(startPage, true);
    });

    // ════════════════════════════════════════════════════════
    //  BACKGROUND CANVAS
    // ════════════════════════════════════════════════════════
    var bgCanvas, bgCtx, bgMouse = {x:null, y:null}, waveConfig = [], bgAnimationFrame = null;

    function initBgCanvas() {
        if (prefersReducedMotion) return;
        bgCanvas = document.getElementById('mc-bg-canvas');
        if (!bgCanvas) return;
        bgCtx = bgCanvas.getContext('2d');
        resizeBgCanvas();
        window.addEventListener('resize', resizeBgCanvas);
        window.addEventListener('mousemove', function(e){ bgMouse.x=e.clientX; bgMouse.y=e.clientY; });
        document.addEventListener('visibilitychange', function(){
            if (!document.hidden && bgCtx && bgAnimationFrame === null) animateBgWaves();
        });
        waveConfig = [
            {yOffset:0.35, amplitude:55, frequency:0.003, speed:0.012,  color:'rgba(124,58,237,0.08)',  phase:0},
            {yOffset:0.50, amplitude:75, frequency:0.002, speed:-0.008, color:'rgba(79,70,229,0.05)',   phase:Math.PI/3},
            {yOffset:0.65, amplitude:45, frequency:0.004, speed:0.015,  color:'rgba(219,39,119,0.04)', phase:Math.PI/1.5}
        ];
        animateBgWaves();
    }

    function resizeBgCanvas() {
        if (!bgCanvas) return;
        var p = bgCanvas.parentElement;
        bgCanvas.width  = p.clientWidth  || window.innerWidth;
        bgCanvas.height = p.clientHeight || window.innerHeight;
    }

    function animateBgWaves() {
        if (!bgCtx) return;
        if (document.hidden) {
            bgAnimationFrame=null;
            return;
        }
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        waveConfig.forEach(function(wave) {
            bgCtx.beginPath();
            for (var x=0; x<=bgCanvas.width; x+=15) {
                var y = Math.sin(x*wave.frequency + wave.phase)*wave.amplitude + (bgCanvas.height*wave.yOffset);
                if (bgMouse.x !== null) {
                    var dx=bgMouse.x-x, dy=bgMouse.y-y, dist=Math.sqrt(dx*dx+dy*dy);
                    if (dist < 220) y += Math.sin(wave.phase*2)*(1-dist/220)*35;
                }
                if (x===0) bgCtx.moveTo(x,y); else bgCtx.lineTo(x,y);
            }
            bgCtx.strokeStyle=wave.color; bgCtx.lineWidth=4; bgCtx.stroke();
            wave.phase += wave.speed;
        });
        bgAnimationFrame=requestAnimationFrame(animateBgWaves);
    }

    // ════════════════════════════════════════════════════════
    //  CUSTOM CURSOR
    // ════════════════════════════════════════════════════════
    function initCursor() {
        if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
        var dot=document.getElementById('mc-cursor'), ring=document.getElementById('mc-cursor-ring');
        if (!dot||!ring) return;
        window.addEventListener('mousemove', function(e){
            gsap.to(dot,  {x:e.clientX, y:e.clientY, duration:0.05});
            gsap.to(ring, {x:e.clientX, y:e.clientY, duration:0.25, ease:'power2.out'});
        });
        function addHover(el) {
            el.addEventListener('mouseenter', function(){
                gsap.to(ring,{width:55,height:55,borderColor:'#7c3aed',backgroundColor:'rgba(124,58,237,0.08)'});
                gsap.to(dot, {scale:1.8, backgroundColor:'#4c1d95'});
            });
            el.addEventListener('mouseleave', function(){
                gsap.to(ring,{width:32,height:32,borderColor:'rgba(124,58,237,0.5)',backgroundColor:'transparent'});
                gsap.to(dot, {scale:1, backgroundColor:'#7c3aed'});
            });
        }
        document.querySelectorAll('button,a,select,input,textarea,[onclick]').forEach(addHover);
    }

    // ════════════════════════════════════════════════════════
    //  MOBILE MENU
    // ════════════════════════════════════════════════════════
    function initMobileMenu() {
        var btn=document.getElementById('mc-menu-btn'), menu=document.getElementById('mc-mobile-menu');
        if (!btn||!menu) return;
        btn.addEventListener('click', function(){
            var open=menu.classList.toggle('open');
            btn.setAttribute('aria-expanded', open);
        });
        document.addEventListener('click', function(e){
            if (!menu.contains(e.target)&&!btn.contains(e.target)){
                menu.classList.remove('open');
                btn.setAttribute('aria-expanded',false);
            }
        });
    }

    // ════════════════════════════════════════════════════════
    //  SPA NAVIGATION
    // ════════════════════════════════════════════════════════
    window.navigateTo = function(targetPage, scrollTarget) {
        if (targetPage === currentPage && !scrollTarget) return;

        var mobileMenu = document.getElementById('mc-mobile-menu');
        if (mobileMenu) mobileMenu.classList.remove('open');

        var currentEl = document.getElementById('page-'+currentPage);
        var targetEl  = document.getElementById('page-'+targetPage);
        if (!targetEl) return;

        // Save to cookie — PHP will read this on next page load/refresh
        setCookie('mc_page', targetPage, 1);

        var tl = gsap.timeline();
        if (currentEl) {
            tl.to(currentEl, {opacity:0, y:-12, duration:0.25, ease:'power2.inOut',
                onComplete: function(){
                    currentEl.classList.remove('active');
                    currentEl.style.opacity=''; currentEl.style.transform='';
                }
            });
        }
        tl.call(function(){ setPage(targetPage,false); gsap.set(targetEl,{opacity:0,y:15}); });
        tl.to(targetEl, {opacity:1, y:0, duration:0.45, ease:'power3.out'});

        if (scrollTarget) {
            setTimeout(function(){
                var el=document.getElementById(scrollTarget);
                if (el) gsap.to(window,{duration:0.8,scrollTo:{y:el,offsetY:120},ease:'power2.out'});
            }, 350);
        } else {
            window.scrollTo({top:0, behavior:'smooth'});
        }
    };

    window.smoothScrollTo = function(id) {
        setTimeout(function(){
            var el=document.getElementById(id);
            if (el) gsap.to(window,{duration:0.8,scrollTo:{y:el,offsetY:120},ease:'power2.out'});
        }, 50);
    };

    function setPage(page, instant) {
        currentPage = page;

        var header=document.getElementById('mc-header');
        var footer=document.getElementById('mc-footer');
        var floats=document.getElementById('floating-contacts');
        var target=document.getElementById('page-'+page);

        if (page==='portal') {
            if (header) header.style.display='none';
            if (footer) footer.style.display='none';
            if (floats) floats.style.display='none';
        } else {
            if (header) header.style.display='block';
            if (footer) footer.style.display='block';
            if (floats) floats.style.display='flex';
        }

        document.querySelectorAll('.page-state').forEach(function(s){ s.classList.remove('active'); });
        if (target) target.classList.add('active');

        document.querySelectorAll('.mc-nav-link,.mc-mobile-link').forEach(function(btn){
            btn.classList.toggle('active', btn.dataset.page===page);
        });

        updatePageMetadata(page);

        if (page==='products') filterProducts();
        if (!instant) setTimeout(initScrollReveal, 200);
    }

    function setupHeroAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(function(a){
            a.addEventListener('click', function(e){
                e.preventDefault();
                smoothScrollTo(this.getAttribute('href').replace('#',''));
            });
        });
    }

    // ════════════════════════════════════════════════════════
    //  PRODUCTS GRID
    // ════════════════════════════════════════════════════════
    function buildProductsGrid(items) {
        var grid=document.getElementById('products-grid');
        if (!grid) return;
        grid.innerHTML='';
        if (!items||!items.length){
            grid.innerHTML='<div class="products-empty">No products found.</div>';
            return;
        }
        items.forEach(function(prod){
            var card=document.createElement('button');
            card.type='button';
            card.className='product-card';
            card.setAttribute('aria-label', 'Enquire about ' + prod.name);
            card.onclick=function(){ navigateTo('food','foodInquiry'); };
            card.innerHTML=
                '<div class="product-img-wrap">'
                +'<img src="'+prod.img+'" alt="'+prod.name+'" loading="lazy" decoding="async" onerror="this.src=\'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80\'">'
                +'<span class="product-badge-cat">'+prod.category+'</span>'
                +(prod.popular?'<span class="product-badge-pop">Popular</span>':'')
                +'</div>'
                +'<div class="product-body">'
                +'<div class="product-name">'+prod.name+'</div>'
                +(prod.packing?'<div class="product-packing">'+prod.packing+'</div>':'')
                +'</div>';
            grid.appendChild(card);
        });
    }

    window.setActiveCategory = function(cat) {
        activeCategory=cat;
        document.querySelectorAll('.cat-tab').forEach(function(t){ t.classList.remove('active'); });
        var el=document.getElementById('tab-'+cat.replace(/\s+/g,''));
        if (el) el.classList.add('active');
        filterProducts();
    };

    window.browseCategory = function(cat) {
        activeCategory=cat;
        document.querySelectorAll('.cat-tab').forEach(function(t){ t.classList.remove('active'); });
        var tab=document.getElementById('tab-'+cat.replace(/\s+/g,''));
        if (tab) tab.classList.add('active');
        filterProducts();
        navigateTo('products');
    };

    function filterProducts() {
        var filtered=PRODUCTS.filter(function(p){
            if (activeCategory==='All Products') return true;
            if (activeCategory==='Popular') return p.popular;
            return p.category.toLowerCase()===activeCategory.toLowerCase();
        });
        var grid=document.getElementById('products-grid');
        if (!grid) return;
        gsap.to(grid,{opacity:0,y:10,duration:0.2,onComplete:function(){
            buildProductsGrid(filtered);
            gsap.to(grid,{opacity:1,y:0,duration:0.35,ease:'power2.out'});
        }});
    }

    function buildFeaturedProducts() {
        var grid=document.getElementById('featured-products-grid');
        if (!grid) return;

        var featured=PRODUCTS.filter(function(product){ return product.popular; }).slice(0,4);
        grid.innerHTML='';
        featured.forEach(function(product){
            var card=document.createElement('button');
            card.type='button';
            card.className='featured-product-card';
            card.setAttribute('aria-label', 'View ' + product.name + ' in the product catalogue');
            card.onclick=function(){ browseCategory(product.category); };
            card.innerHTML=
                '<span class="featured-product-img">'
                +'<img src="'+product.img+'" alt="'+product.name+'" loading="lazy" decoding="async">'
                +'<span class="featured-product-tag">Popular</span>'
                +'</span>'
                +'<span class="featured-product-copy">'
                +'<small>'+product.category+'</small>'
                +'<strong>'+product.name+'</strong>'
                +'<em>'+product.packing+' <b>&rarr;</b></em>'
                +'</span>';
            grid.appendChild(card);
        });
    }

    function updatePageMetadata(page) {
        var metadata={
            portal: {
                title:'Metrocart Business Services | Choose a Division',
                description:'Choose Metrocart food distribution, business consultancy, or legal support services.'
            },
            food: {
                title:'B2B Ethnic Food Distribution | Metrocart',
                description:'Explore Metrocart’s UK trade food distribution service for retailers, wholesalers, and food-service operators.'
            },
            products: {
                title:'Wholesale Ethnic Food Catalogue | Metrocart',
                description:'Browse Metrocart’s frozen, dates, and ambient grocery catalogue for UK trade customers.'
            },
            consultancy: {
                title:'Business Consultancy Services | Metrocart',
                description:'Practical business consultancy for market expansion, operating systems, supply networks, and commercial growth.'
            },
            legal: {
                title:'Business Legal Support Services | Metrocart',
                description:'Coordinated business legal support for company setup, contracts, compliance, and brand protection.'
            }
        };
        var current=metadata[page] || metadata.portal;
        document.title=current.title;
        var description=document.querySelector('meta[name="description"]');
        if (description) description.setAttribute('content', current.description);
    }

    // ════════════════════════════════════════════════════════
    //  FORM TOASTS
    // ════════════════════════════════════════════════════════
    window.mcFormSubmit = function(e, title) {
        e.preventDefault();
        var container=document.getElementById('toast-container');
        var toast=document.createElement('div');
        toast.className='mc-toast';
        toast.innerHTML=
            '<div class="mc-toast-head"><span>Transmission Successful</span>'
            +'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#059669" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>'
            +'<div class="mc-toast-body">Data securely logged for: <strong>'+title+'</strong>.</div>'
            +'<div class="mc-toast-pulse">Vetting response within 24 Hours.</div>';
        container.appendChild(toast);
        gsap.fromTo(toast,{y:20,opacity:0},{y:0,opacity:1,duration:0.6,ease:'back.out(1.5)'});
        e.target.reset();
        setTimeout(function(){
            gsap.to(toast,{y:-15,opacity:0,duration:0.45,ease:'power2.in',onComplete:function(){ toast.remove(); }});
        }, 6000);
    };

    // ════════════════════════════════════════════════════════
    //  SCROLL REVEAL
    // ════════════════════════════════════════════════════════
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.aos').forEach(function(el){ el.classList.add('visible'); });
            return;
        }
        var obs=new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (entry.isIntersecting){ entry.target.classList.add('visible'); obs.unobserve(entry.target); }
            });
        },{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
        document.querySelectorAll('.aos:not(.visible)').forEach(function(el){ obs.observe(el); });
    }

    // ════════════════════════════════════════════════════════
    //  STICKY HEADER SHADOW
    // ════════════════════════════════════════════════════════
    window.addEventListener('scroll', function(){
        var h=document.getElementById('mc-header');
        if (h) h.style.boxShadow=window.scrollY>10?'0 2px 20px rgba(124,58,237,0.1)':'';
    },{passive:true});

})();

