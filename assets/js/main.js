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

    // Product images live in assets/img/products/<CATEGORY>/ (filenames listed in logo-and-products.md).
    // A missing image falls back to PRODUCT_IMG_PLACEHOLDER.
    // Generated from logo-and-products.md by .claude/tools/sync_products.py; edit that file, not this list.
    // Product images live in assets/img/products/<CATEGORY>/; a missing image falls back to PRODUCT_IMG_PLACEHOLDER.
    var PRODUCTS = [
        { id:1,   name:'Faani Frz. Grated Coconut 400g',               category:'Frozen',  packing:'18 per carton', popular:true, photo:true,
          img:'assets/img/products/FROZEN/faani-frz-grated-coconut-400g.jpg' },
        { id:2,   name:'Faani Frz. Grated Coconut 1Kg',                category:'Frozen',  packing:'12 per carton', popular:true, photo:true,
          img:'assets/img/products/FROZEN/faani-frz-grated-coconut-1kg.jpg' },
        { id:3,   name:'Faani Frz tapioca slice 700g',                 category:'Frozen',  packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-frz-tapioca-slice-700g.jpg' },
        { id:4,   name:'Faani Tapioca Slice 2.5kg',                    category:'Frozen',  packing:'6 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-tapioca-slice-2-5kg.jpg' },
        { id:5,   name:'Faani Frz tapioca whole 700g',                 category:'Frozen',  packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-frz-tapioca-whole-700g.jpg' },
        { id:6,   name:'Faani Froz Jackfruit Ripe 300g',               category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-froz-jackfruit-ripe-300g.jpg' },
        { id:7,   name:'Faani Frozen Tender Mango 250g',               category:'Frozen',  packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-frozen-tender-mango-250g.jpg' },
        { id:8,   name:'Faani Frozen Tender mango 500g',               category:'Frozen',  packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-frozen-tender-mango-500g.jpg' },
        { id:9,   name:'Fni Frz JackfruitSeedSlice 250g',              category:'Frozen',  packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/fni-frz-jackfruitseedslice-250g.jpg' },
        { id:10,  name:'Faani Chilli Parotta 350g',                    category:'Frozen',  packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-chilli-parotta-350g.jpg' },
        { id:11,  name:'Faani Malabar Restaurant Parotta 1.5Kg',       category:'Frozen',  packing:'4 per carton', popular:true, photo:false,
          img:'assets/img/products/FROZEN/faani-malabar-restaurant-parotta-1-5kg.jpg' },
        { id:12,  name:'Faani Aloo Parotta 350g',                      category:'Frozen',  packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-aloo-parotta-350g.jpg' },
        { id:13,  name:'Faani Puttu White 350g',                       category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-puttu-white-350g.jpg' },
        { id:14,  name:'Faani Puttu Brown 350g',                       category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-puttu-brown-350g.jpg' },
        { id:15,  name:'Faani Idiyappam White 350g',                   category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-idiyappam-white-350g.jpg' },
        { id:16,  name:'Faani Idiyappam Brown 350g',                   category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-idiyappam-brown-350g.jpg' },
        { id:17,  name:'Faani Vellayappam 350g',                       category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-vellayappam-350g.jpg' },
        { id:18,  name:'Faani Masala Dosa 350g',                       category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-masala-dosa-350g.jpg' },
        { id:19,  name:'Faani Idli Sambar 350g',                       category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-idli-sambar-350g.jpg' },
        { id:20,  name:'Fni Vegetable Mini Samosa 1Kg (ready to fry)', category:'Frozen',  packing:'5 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/fni-vegetable-mini-samosa-1kg-ready-to-fry.jpg' },
        { id:21,  name:'Fni Vegetable Mini Samosa 350g (ready to fry)',category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/fni-vegetable-mini-samosa-350g-ready-to-fry.jpg' },
        { id:22,  name:'Fni Vegetable Spring Roll 1Kg (ready to fry)', category:'Frozen',  packing:'5 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/fni-vegetable-spring-roll-1kg-ready-to-fry.jpg' },
        { id:23,  name:'Faani Sukian 350g',                            category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-sukian-350g.jpg' },
        { id:24,  name:'Faani Vattayappam 350g',                       category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-vattayappam-350g.jpg' },
        { id:25,  name:'Faani Banana Roast 350g',                      category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-banana-roast-350g.jpg' },
        { id:26,  name:'Faani Unniappam 350gm',                        category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-unniappam-350gm.jpg' },
        { id:27,  name:'Faani Neyyappam 350gm',                        category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-neyyappam-350gm.jpg' },
        { id:28,  name:'Faani Parippuvada 350gm',                      category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-parippuvada-350gm.jpg' },
        { id:29,  name:'Faani Elayada 350gm',                          category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-elayada-350gm.jpg' },
        { id:30,  name:'Faani Breaded Veg. Cutlet 350g',               category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-breaded-veg-cutlet-350g.jpg' },
        { id:31,  name:'Faani Idiyappam White 1KG',                    category:'Frozen',  packing:'4 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-idiyappam-white-1kg.jpg' },
        { id:32,  name:'Faani Paruppu vada 1Kg',                       category:'Frozen',  packing:'5 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-paruppu-vada-1kg.jpg' },
        { id:33,  name:'Faani Banana Fry 1Kg',                         category:'Frozen',  packing:'5 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-banana-fry-1kg.jpg' },
        { id:34,  name:'Faani Unnakai 1kg',                            category:'Frozen',  packing:'5 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/faani-unnakai-1kg.jpg' },
        { id:35,  name:'TrueFroot F.Blend Tender Coconut 1L',          category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/truefroot-f-blend-tender-coconut-1l.jpg' },
        { id:36,  name:'TrueFroot F.Blend Chikku 1L',                  category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/truefroot-f-blend-chikku-1l.jpg' },
        { id:37,  name:'TrueFroot F.Blend Mango 1L',                   category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/truefroot-f-blend-mango-1l.jpg' },
        { id:38,  name:'TrueFroot F.Blend PassionFrut 1L',             category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/truefroot-f-blend-passionfrut-1l.jpg' },
        { id:39,  name:'TrueFroot F.Blend Guava 1L',                   category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/truefroot-f-blend-guava-1l.jpg' },
        { id:40,  name:'TrueFroot F.Blend Shamam 1L',                  category:'Frozen',  packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/FROZEN/truefroot-f-blend-shamam-1l.jpg' },
        { id:41,  name:'Ajwa Dates 300g',                              category:'Dates',   packing:'24 per carton', popular:true, photo:true,
          img:'assets/img/products/DATES/ajwa-dates-300g.jpg' },
        { id:42,  name:'Mabroom Dates 300g',                           category:'Dates',   packing:'24 per carton', popular:true, photo:true,
          img:'assets/img/products/DATES/mabroom-dates-300g.jpg' },
        { id:43,  name:'Medjool Dates 450g',                           category:'Dates',   packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/DATES/medjool-dates-450g.jpg' },
        { id:44,  name:'Medjool Dates 900g',                           category:'Dates',   packing:'8 per carton', popular:false, photo:false,
          img:'assets/img/products/DATES/medjool-dates-900g.jpg' },
        { id:45,  name:'Suqei Dates 400g',                             category:'Dates',   packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/DATES/suqei-dates-400g.jpg' },
        { id:46,  name:'Safawi Dates 450g',                            category:'Dates',   packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/DATES/safawi-dates-450g.jpg' },
        { id:47,  name:'Aahaa Bhakharwadi 200g',                       category:'Ambient', packing:'25 per carton', popular:true, photo:true,
          img:'assets/img/products/AMBIENT/aahaa-bhakharwadi-200g.jpg' },
        { id:48,  name:'Aahaa Bhujia Munchy Masti 200g',               category:'Ambient', packing:'25 per carton', popular:true, photo:true,
          img:'assets/img/products/AMBIENT/aahaa-bhujia-munchy-masti-200g.jpg' },
        { id:49,  name:'Aahaa Bikaner Bujiya 200gm',                   category:'Ambient', packing:'25 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/aahaa-bikaner-bujiya-200gm.jpg' },
        { id:50,  name:'Aahaa Farali Chiwda 200g',                     category:'Ambient', packing:'25 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/aahaa-farali-chiwda-200g.jpg' },
        { id:51,  name:'Aahaa Masala Boondi 200g',                     category:'Ambient', packing:'25 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/aahaa-masala-boondi-200g.jpg' },
        { id:52,  name:'Aahaa Salted Moong Dal 200g',                  category:'Ambient', packing:'25 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/aahaa-salted-moong-dal-200g.jpg' },
        { id:53,  name:'Faani Andhra Mixture 200g',                    category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-andhra-mixture-200g.jpg' },
        { id:54,  name:'Faani Banana Chips 200g',                      category:'Ambient', packing:'24 per carton', popular:true, photo:false,
          img:'assets/img/products/AMBIENT/faani-banana-chips-200g.jpg' },
        { id:55,  name:'Faani Banana Chips Pepper 200g',               category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-banana-chips-pepper-200g.jpg' },
        { id:56,  name:'Faani Banana Chips Ripen.200g',                category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-banana-chips-ripen-200g.jpg' },
        { id:57,  name:'Faani Banana Chips Spicy 200g',                category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-banana-chips-spicy-200g.jpg' },
        { id:58,  name:'Faani BananaChips Fourcut 200g',               category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-bananachips-fourcut-200g.jpg' },
        { id:59,  name:'Faani BananaChips Jaggery 200g',               category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-bananachips-jaggery-200g.jpg' },
        { id:60,  name:'Faani Gingelly Oil 1L',                        category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-gingelly-oil-1l.jpg' },
        { id:61,  name:'Faani Ginger Sarbath 500ml',                   category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-ginger-sarbath-500ml.jpg' },
        { id:62,  name:'Faani Grape Sarbath 500ml',                    category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-grape-sarbath-500ml.jpg' },
        { id:63,  name:'Faani Jackfruit Chips 200g',                   category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-jackfruit-chips-200g.jpg' },
        { id:64,  name:'Faani Jaggery Cubes 1kg',                      category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-jaggery-cubes-1kg.jpg' },
        { id:65,  name:'Faani Kerala Mixture 200g',                    category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-kerala-mixture-200g.jpg' },
        { id:66,  name:'Faani Kerala Mixture Spicy200g',               category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-kerala-mixture-spicy200g.jpg' },
        { id:67,  name:'Faani Kudampuli 200g',                         category:'Ambient', packing:'50 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-kudampuli-200g.jpg' },
        { id:68,  name:'Faani Madras Mixture 200g',                    category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-madras-mixture-200g.jpg' },
        { id:69,  name:'Faani Masala Peanut 200g',                     category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-masala-peanut-200g.jpg' },
        { id:70,  name:'Faani Murukku Long 200g',                      category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-murukku-long-200g.jpg' },
        { id:71,  name:'Faani Murukku Round 200g',                     category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-murukku-round-200g.jpg' },
        { id:72,  name:'Faani Nannari Sarbath 500ml',                  category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-nannari-sarbath-500ml.jpg' },
        { id:73,  name:'Faani Nutmeg Sarbath 500ml',                   category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-nutmeg-sarbath-500ml.jpg' },
        { id:74,  name:'Faani Palada Payasam Mix 200g',                category:'Ambient', packing:'50 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-palada-payasam-mix-200g.jpg' },
        { id:75,  name:'Faani Pasionfrut Sarbath 500ml',               category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-pasionfrut-sarbath-500ml.jpg' },
        { id:76,  name:'Faani Rice Flakes-Aval 500gm',                 category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-rice-flakes-aval-500gm.jpg' },
        { id:77,  name:'Faani Roasted Vermicelli 180g',                category:'Ambient', packing:'20 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-roasted-vermicelli-180g.jpg' },
        { id:78,  name:'Faani Semiya Payasam Mix 200g',                category:'Ambient', packing:'50 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-semiya-payasam-mix-200g.jpg' },
        { id:79,  name:'Faani Sweet Mixture 200g',                     category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-sweet-mixture-200g.jpg' },
        { id:80,  name:'Faani Tamarind Seedless 200g',                 category:'Ambient', packing:'50 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-tamarind-seedless-200g.jpg' },
        { id:81,  name:'Faani Tapioca Chips 100g',                     category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-tapioca-chips-100g.jpg' },
        { id:82,  name:'Faani Tapioca Chips Spicy 100g',               category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-tapioca-chips-spicy-100g.jpg' },
        { id:83,  name:'Faani Tapioca Sticks 200g',                    category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-tapioca-sticks-200g.jpg' },
        { id:84,  name:'Faani Tapioca Sticks Spicy200g',               category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faani-tapioca-sticks-spicy200g.jpg' },
        { id:85,  name:'Faash Coconut Oil 1L',                         category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faash-coconut-oil-1l.jpg' },
        { id:86,  name:'Faash Coconut Oil 2L',                         category:'Ambient', packing:'8 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/faash-coconut-oil-2l.jpg' },
        { id:87,  name:'Fani Rice Palada Paysm Mix200g',               category:'Ambient', packing:'50 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fani-rice-palada-paysm-mix200g.jpg' },
        { id:88,  name:'Fira Dosa Powder 1kg',                         category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-dosa-powder-1kg.jpg' },
        { id:89,  name:'Fira Goosbry BE.Chili Syrp500ml',              category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-goosbry-be-chili-syrp500ml.jpg' },
        { id:90,  name:'Fira Idiyapam Powder White 1kg',               category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-idiyapam-powder-white-1kg.jpg' },
        { id:91,  name:'Fira Idly Powder 1kg',                         category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-idly-powder-1kg.jpg' },
        { id:92,  name:'Fira Knthri.Mango Chamanti400g',               category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-knthri-mango-chamanti400g.jpg' },
        { id:93,  name:'Fira Paalappam Powder 1kg',                    category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-paalappam-powder-1kg.jpg' },
        { id:94,  name:'Fira Rice Powder 1kg',                         category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-rice-powder-1kg.jpg' },
        { id:95,  name:'Fira Steamed RicePuttu Powder 1Kg',            category:'Ambient', packing:'10 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-steamed-riceputtu-powder-1kg.jpg' },
        { id:96,  name:'Fira Synthetic Vinegar 500ml',                 category:'Ambient', packing:'24 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/fira-synthetic-vinegar-500ml.jpg' },
        { id:97,  name:'Tholur Garlic Pickle 300g',                    category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/tholur-garlic-pickle-300g.jpg' },
        { id:98,  name:'Tholur Ginger Garlic Paste 300g',              category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/tholur-ginger-garlic-paste-300g.jpg' },
        { id:99,  name:'Tholur Lime Pickle 300g',                      category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/tholur-lime-pickle-300g.jpg' },
        { id:100, name:'Tholur Mango Pickle 300g',                     category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/tholur-mango-pickle-300g.jpg' },
        { id:101, name:'Tholur Mix Veg Pickle 300g',                   category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/tholur-mix-veg-pickle-300g.jpg' },
        { id:102, name:'Tholur Tender Mango Pickle 300g',              category:'Ambient', packing:'12 per carton', popular:false, photo:false,
          img:'assets/img/products/AMBIENT/tholur-tender-mango-pickle-300g.jpg' }
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
    var PRODUCT_IMG_PLACEHOLDER = 'assets/img/products/placeholder.svg';
    var FEATURED_LIMIT = 6; // homepage "Featured products"; keep in sync with MAX_FEATURED in sync_products.py
    var IMG_FALLBACK = ' onerror="this.onerror=null;this.src=\''+PRODUCT_IMG_PLACEHOLDER+'\'"';

    function buildProductsGrid(items) {
        var grid=document.getElementById('products-grid');
        if (!grid) return;
        grid.innerHTML='';
        if (!items||!items.length){
            grid.innerHTML='<div class="products-empty">More products coming soon. Contact our trade desk for current availability.</div>';
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
                +'<img src="'+prod.img+'" alt="'+prod.name+'" loading="lazy" decoding="async"'+IMG_FALLBACK+'>'
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

        // Starred products with a photo first (keeping list order), filling two rows of three.
        var popular=PRODUCTS.filter(function(product){ return product.popular; });
        var featured=popular.filter(function(p){ return p.photo; })
            .concat(popular.filter(function(p){ return !p.photo; }))
            .slice(0, FEATURED_LIMIT);
        grid.innerHTML='';
        featured.forEach(function(product){
            var card=document.createElement('button');
            card.type='button';
            card.className='featured-product-card';
            card.setAttribute('aria-label', 'View ' + product.name + ' in the product catalogue');
            card.onclick=function(){ browseCategory(product.category); };
            card.innerHTML=
                '<span class="featured-product-img">'
                +'<img src="'+product.img+'" alt="'+product.name+'" loading="lazy" decoding="async"'+IMG_FALLBACK+'>'
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
    var FORM_ENDPOINT = 'https://api.web3forms.com/submit';

    function showToast(ok, heading, body, footer) {
        var container=document.getElementById('toast-container');
        var toast=document.createElement('div');
        toast.className='mc-toast'+(ok?'':' mc-toast-error');
        toast.setAttribute('role', ok?'status':'alert');
        toast.innerHTML=
            '<div class="mc-toast-head"><span>'+heading+'</span>'
            +(ok?'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#059669" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>':'')
            +'</div>'
            +'<div class="mc-toast-body">'+body+'</div>'
            +(footer?'<div class="mc-toast-pulse">'+footer+'</div>':'');
        container.appendChild(toast);
        gsap.fromTo(toast,{y:20,opacity:0},{y:0,opacity:1,duration:0.6,ease:'back.out(1.5)'});
        setTimeout(function(){
            gsap.to(toast,{y:-15,opacity:0,duration:0.45,ease:'power2.in',onComplete:function(){ toast.remove(); }});
        }, ok?6000:10000);
    }

    var FORM_TIMEOUT_MS = 20000;
    var CONTACT_FALLBACK = 'Please call <a href="tel:07539995333">07539 995333</a> or message us on <a href="https://wa.me/447539995333" target="_blank" rel="noopener noreferrer">WhatsApp</a>.';

    function showFormError(timedOut) {
        // A timed-out request may still have been delivered, so don't tell the visitor it definitely failed.
        showToast(false, timedOut ? 'No confirmation received' : 'Enquiry not sent',
            (timedOut
                ? 'We couldn’t confirm your enquiry was received. Your details are still in the form. '
                : 'Sorry, we couldn’t send your enquiry. Your details are still in the form. ')
            + CONTACT_FALLBACK);
    }

    window.mcFormSubmit = function(e, title) {
        e.preventDefault();
        var form=e.target;
        if (form.dataset.sending) return;
        var button=form.querySelector('[type="submit"]');

        if (!mcData.formKey || mcData.formKey.indexOf('YOUR_')===0) {
            if (window.console) console.warn('Metrocart: Web3Forms access key is not configured in index.html (mcFormKey).');
            showFormError(false);
            return;
        }

        var data=new FormData(form);
        data.append('access_key', mcData.formKey);
        data.append('subject', 'Website: '+title+' from '+(data.get('company')||data.get('name')));
        data.append('from_name', 'Metrocart website');

        var buttonText=button.innerHTML;
        form.dataset.sending='1';
        form.setAttribute('aria-busy','true');
        button.disabled=true;
        button.innerHTML='Sending…';

        var controller=window.AbortController ? new AbortController() : null;
        var timedOut=false;
        var timer=setTimeout(function(){
            timedOut=true;
            if (controller) controller.abort();
        }, FORM_TIMEOUT_MS);

        fetch(FORM_ENDPOINT, { method:'POST', body:data, headers:{ Accept:'application/json' }, signal:controller ? controller.signal : undefined })
            .then(function(res){ return res.json().then(function(json){ return res.ok && json.success === true; }); })
            .catch(function(){ return false; })
            .then(function(sent){
                clearTimeout(timer);
                delete form.dataset.sending;
                form.removeAttribute('aria-busy');
                button.disabled=false;
                button.innerHTML=buttonText;
                if (!sent || timedOut) { showFormError(timedOut); return; }
                form.reset();
                showToast(true, 'Enquiry sent', 'Thank you. We’ve received your <strong>'+title.toLowerCase()+'</strong>.', 'Our team will be in touch shortly.');
            });
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

