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
    // Generated from logo-and-products.md and the photo filenames by .claude/tools/sync_products.py; do not edit by hand.
    // Photos live in assets/img/products/<CATEGORY>/ as "<Product name> x <pieces>.jpg"; products without one use the placeholder.
    var PRODUCTS = [
        { id:1,   name:'Faani Frz. Grated Coconut 400g',               category:'Frozen',  packing:'18 per carton', popular:true, rank:2, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Frz.%20Grated%20Coconut%20400g%20x%2018.jpg' },
        { id:2,   name:'Faani Frz. Grated Coconut 400g',               category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:false,
          img:'assets/img/products/placeholder.svg' },
        { id:3,   name:'Faani Frz. Grated Coconut 1kg',                category:'Frozen',  packing:'12 per carton', popular:true, rank:4, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Frz.%20Grated%20Coconut%201kg%20x%2012.jpg' },
        { id:4,   name:'Faani Frz tapioca slice 700g',                 category:'Frozen',  packing:'20 per carton', popular:true, rank:5, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Frz%20tapioca%20slice%20700g%20x%2020.jpg' },
        { id:5,   name:'Faani Tapioca Slice 2.5kg',                    category:'Frozen',  packing:'6 per carton', popular:true, rank:3, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Tapioca%20Slice%202.5kg%20x%206.jpg' },
        { id:6,   name:'Faani Frz tapioca whole 700g',                 category:'Frozen',  packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Frz%20tapioca%20whole%20700g%20x%2020.jpg' },
        { id:7,   name:'Faani Froz Jackfruit Ripe 300g',               category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Froz%20Jackfruit%20Ripe%20300g%20x%2012.jpg' },
        { id:8,   name:'Faani Frozen Tender Mango 250g',               category:'Frozen',  packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Frozen%20Tender%20Mango%20250g%20x%2024.jpg' },
        { id:9,   name:'Faani Frozen Tender mango 500g',               category:'Frozen',  packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Frozen%20Tender%20mango%20500g%20x%2024.jpg' },
        { id:10,  name:'Fni Frz Jackfruit Seed Slice 250g',            category:'Frozen',  packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Fni%20Frz%20Jackfruit%20Seed%20Slice%20250g%20x24.jpg' },
        { id:11,  name:'Faani Chilli Parotta 350g',                    category:'Frozen',  packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Chilli%20Parotta%20350g%20x%2024.jpg' },
        { id:12,  name:'Faani Malabar restaurant Parotta 1.5Kg',       category:'Frozen',  packing:'4 per carton', popular:true, rank:1, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Malabar%20restaurant%20Parotta%201.5Kg%20x%204.jpg' },
        { id:13,  name:'Faani Aloo Parotta 350g',                      category:'Frozen',  packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Aloo%20Parotta%20350g%20x%2024.jpg' },
        { id:14,  name:'Faani Coin Parotta 350g',                      category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:false,
          img:'assets/img/products/placeholder.svg' },
        { id:15,  name:'Faani Kothu Parotta 350g',                     category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:false,
          img:'assets/img/products/placeholder.svg' },
        { id:16,  name:'Faani Roll Parotta 350g',                      category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:false,
          img:'assets/img/products/placeholder.svg' },
        { id:17,  name:'Forfoods Kothu Porotta Restaurant Pack 1Kg',   category:'Frozen',  packing:'16 per carton', popular:true, rank:0, photo:false,
          img:'assets/img/products/placeholder.svg' },
        { id:18,  name:'Faani Puttu White 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Puttu%20White%20350g%20x%2012.jpg' },
        { id:19,  name:'Faani Puttu Brown 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Puttu%20Brown%20350g%20x%2012.jpg' },
        { id:20,  name:'Faani Idiyappam White 350g',                   category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Idiyappam%20White%20350g%20x%2012.jpg' },
        { id:21,  name:'Faani Idiyappam Brown 350g',                   category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Idiyappam%20Brown%20350g%20x%2012.jpg' },
        { id:22,  name:'Faani Vellayappam 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Vellayappam%20350g%20x%2012.jpg' },
        { id:23,  name:'Faani Masala Dosa 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Masala%20Dosa%20350g%20x%2012.jpg' },
        { id:24,  name:'Faani Idli Sambar 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Idli%20Sambar%20350g%20x%2012.jpg' },
        { id:25,  name:'Fni Vegetable Mini Samosa 1Kg (ready to fry)', category:'Frozen',  packing:'5 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Fni%20Vegetable%20Mini%20Samosa%201Kg%20%28ready%20to%20fry%29%20x%205.jpg' },
        { id:26,  name:'Fni Vegetable Mini Samosa 350g (ready to fry)',category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Fni%20Vegetable%20Mini%20Samosa%20350g%20%28ready%20to%20fry%29%20x%2012.jpg' },
        { id:27,  name:'Fni Vegetable Spring Roll 1Kg (ready to fry)', category:'Frozen',  packing:'5 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Fni%20Vegetable%20Spring%20Roll%201Kg%20%28ready%20to%20fry%29%20x%205.jpg' },
        { id:28,  name:'Faani Sukian 350g',                            category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Sukian%20350g%20x%2012.jpg' },
        { id:29,  name:'Faani Vattayappam 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Vattayappam%20350g%20x%2012.jpg' },
        { id:30,  name:'Faani Banana Roast 350g',                      category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Banana%20Roast%20350g%20x%2012.jpg' },
        { id:31,  name:'Faani Unniappam 350g',                         category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Unniappam%20350g%20x%2012.jpg' },
        { id:32,  name:'Faani Neyyappam 350g',                         category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Neyyappam%20350g%20x%2012.jpg' },
        { id:33,  name:'Faani Parippuvada 350g',                       category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Parippuvada%20350g%20x%2012.jpg' },
        { id:34,  name:'Faani Elayada 350g',                           category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Elayada%20350g%20x%2012.jpg' },
        { id:35,  name:'Faani Breaded Veg. Cutlet 350g',               category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Breaded%20Veg.%20Cutlet%20350g%20x%2012.jpg' },
        { id:36,  name:'Faani Idiyappam White 1KG',                    category:'Frozen',  packing:'4 per carton', popular:true, rank:6, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Idiyappam%20White%201KG%20x%204.jpg' },
        { id:37,  name:'Faani Paruppu vada 1Kg',                       category:'Frozen',  packing:'5 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/Faani%20Paruppu%20vada%201Kg%20x%205.jpg' },
        { id:38,  name:'FAANI Banana Fry 1 Kg',                        category:'Frozen',  packing:'5 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/FAANI%20Banana%20Fry%201%20Kg%20x%205.jpg' },
        { id:39,  name:'FAANI Unnakai 1kg',                            category:'Frozen',  packing:'5 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/FAANI%20Unnakai%201kg%20x%205.jpg' },
        { id:40,  name:'TrueFroot F.Blend Tender Coconut 1L',          category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/TrueFroot%20F.Blend%20Tender%20Coconut%201L%20x%2012.jpg' },
        { id:41,  name:'TrueFroot F.Blend Chikku 1L',                  category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/TrueFroot%20F.Blend%20Chikku%201L%20x%2012.jpg' },
        { id:42,  name:'TrueFroot F.Blend Mango 1L',                   category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/TrueFroot%20F.Blend%20Mango%201L%20x%2012.jpg' },
        { id:43,  name:'TrueFroot F.Blend PassionFrut 1L',             category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/TrueFroot%20F.Blend%20PassionFrut%201L%20x%2012.jpg' },
        { id:44,  name:'TrueFroot F.Blend Guava 1L',                   category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/TrueFroot%20F.Blend%20Guava%201L%20x%2012.jpg' },
        { id:45,  name:'TrueFroot F.Blend Shamam 1L',                  category:'Frozen',  packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/FROZEN/TrueFroot%20F.Blend%20Shamam%201L%20x%2012.jpg' },
        { id:46,  name:'Ajwa Dates 300g',                              category:'Dates',   packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/DATES/Ajwa%20Dates%20300g%20x%2024.jpg' },
        { id:47,  name:'Mabroom Dates 300g',                           category:'Dates',   packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/DATES/Mabroom%20Dates%20300g%20x%2024.jpg' },
        { id:48,  name:'Medjool Dates 450g',                           category:'Dates',   packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/DATES/Medjool%20Dates%20450g%20x%2010.jpg' },
        { id:49,  name:'Medjool Dates 900g',                           category:'Dates',   packing:'8 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/DATES/Medjool%20Dates%20900g%20x%208.jpg' },
        { id:50,  name:'Suquei Dates 400g',                            category:'Dates',   packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/DATES/Suquei%20Dates%20400g%20x%2010.jpg' },
        { id:51,  name:'Safawi Dates 450g',                            category:'Dates',   packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/DATES/Safawi%20Dates%20450g%20x%2010.jpg' },
        { id:52,  name:'Aahaa Bhakharwadi 200g',                       category:'Ambient', packing:'25 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Aahaa%20Bhakharwadi%20200g%20x%2025.jpg' },
        { id:53,  name:'Aahaa Bhujia Munchy Masti 200g',               category:'Ambient', packing:'25 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Aahaa%20Bhujia%20Munchy%20Masti%20200g%20x%2025.jpg' },
        { id:54,  name:'Aahaa Bikaner Bujiya 200g',                    category:'Ambient', packing:'25 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Aahaa%20Bikaner%20Bujiya%20200g%20x%2025.jpg' },
        { id:55,  name:'Aahaa Farali Chiwda 200g',                     category:'Ambient', packing:'25 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Aahaa%20Farali%20Chiwda%20200g%20x%2025.jpg' },
        { id:56,  name:'Aahaa Masala Boondi 200g',                     category:'Ambient', packing:'25 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Aahaa%20Masala%20Boondi%20200g%20x%2025.jpg' },
        { id:57,  name:'Aahaa Salted Moong Dal 200g',                  category:'Ambient', packing:'25 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Aahaa%20Salted%20Moong%20Dal%20200g%20x%2025.jpg' },
        { id:58,  name:'Faani Andhra Mixture 200g',                    category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Andhra%20Mixture%20200g%20x%2024.jpg' },
        { id:59,  name:'Faani Banana Chips 200g',                      category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Banana%20Chips%20200g%20x%2024.jpg' },
        { id:60,  name:'Faani Banana Chips Pepper 200g',               category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Banana%20Chips%20Pepper%20200g%20x%2024.jpg' },
        { id:61,  name:'Faani Banana Chips Ripen.200g',                category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Banana%20Chips%20Ripen.200g%20x%2024.jpg' },
        { id:62,  name:'Faani Banana Chips Spicy 200g',                category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Banana%20Chips%20Spicy%20200g%20x%2024.jpg' },
        { id:63,  name:'Faani BananaChips Fourcut 200g',               category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20BananaChips%20Fourcut%20200g%20x%2024.jpg' },
        { id:64,  name:'Faani BananaChips Jaggery 200g',               category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20BananaChips%20Jaggery%20200g%20x%2024.jpg' },
        { id:65,  name:'Faani Gingelly Oil 1L',                        category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Gingelly%20Oil%201L%20x%2012.jpg' },
        { id:66,  name:'Faani Ginger Sarbath 500ml',                   category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Ginger%20Sarbath%20500ml%20x%2020.jpg' },
        { id:67,  name:'Faani Grape Sarbath 500ml',                    category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Grape%20Sarbath%20500ml%20x%2020.jpg' },
        { id:68,  name:'Faani Jackfruit Chips 200g',                   category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Jackfruit%20Chips%20200g%20x%2024.jpg' },
        { id:69,  name:'Faani Jaggery Cubes 1kg',                      category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Jaggery%20Cubes%201kg%20x%2010.jpg' },
        { id:70,  name:'Faani Kerala Mixture 200g',                    category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Kerala%20Mixture%20200g%20x%2024.jpg' },
        { id:71,  name:'Faani Kerala Mixture Spicy 200g',              category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Kerala%20Mixture%20Spicy%20200g%20x%2024.jpg' },
        { id:72,  name:'Faani Kudampuli 200g',                         category:'Ambient', packing:'50 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Kudampuli%20200g%20x%2050.jpg' },
        { id:73,  name:'Faani Madras Mixture 200g',                    category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Madras%20Mixture%20200g%20x%2024.jpg' },
        { id:74,  name:'Faani Masala Peanut 200g',                     category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Masala%20Peanut%20200g%20x%2024.jpg' },
        { id:75,  name:'Faani Murukku Long 200g',                      category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Murukku%20Long%20200g%20x%2024.jpg' },
        { id:76,  name:'Faani Murukku Round 200g',                     category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Murukku%20Round%20200g%20x%2024.jpg' },
        { id:77,  name:'Faani Nannari Sarbath 500ml',                  category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Nannari%20Sarbath%20500ml%20x%2020.jpg' },
        { id:78,  name:'Faani Nutmeg Sarbath 500ml',                   category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Nutmeg%20Sarbath%20500ml%20x%2020.jpg' },
        { id:79,  name:'Faani Palada Payasam Mix 200g',                category:'Ambient', packing:'50 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Palada%20Payasam%20Mix%20200g%20x%2050.jpg' },
        { id:80,  name:'Faani Pasionfrut Sarbath 500ml',               category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Pasionfrut%20Sarbath%20500ml%20x%2020.jpg' },
        { id:81,  name:'Faani Rice Flakes-Aval 500gm',                 category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Rice%20Flakes-Aval%20500gm%20x%2020.jpg' },
        { id:82,  name:'Faani Roasted Vermicelli 180g',                category:'Ambient', packing:'20 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Roasted%20Vermicelli%20180g%20x%2020.jpg' },
        { id:83,  name:'Faani Semiya Payasam Mix 200g',                category:'Ambient', packing:'50 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Semiya%20Payasam%20Mix%20200g%20x%2050.jpg' },
        { id:84,  name:'Faani Sweet Mixture 200g',                     category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Sweet%20Mixture%20200g%20x%2024.jpg' },
        { id:85,  name:'Faani Tamarind Seedless 200g',                 category:'Ambient', packing:'50 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Tamarind%20Seedless%20200g%20x%2050.jpg' },
        { id:86,  name:'Faani Tapioca Chips 100g',                     category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Tapioca%20Chips%20100g%20x%2024.jpg' },
        { id:87,  name:'Faani Tapioca Chips Spicy 100g',               category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Tapioca%20Chips%20Spicy%20100g%20x%2024.jpg' },
        { id:88,  name:'Faani Tapioca Sticks 200g',                    category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Tapioca%20Sticks%20200g%20x%2024.jpg' },
        { id:89,  name:'Faani Tapioca Sticks Spicy200g',               category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faani%20Tapioca%20Sticks%20Spicy200g%20x%2024.jpg' },
        { id:90,  name:'Faash Coconut Oil 1L',                         category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faash%20Coconut%20Oil%201L%20x%2012.jpg' },
        { id:91,  name:'Faash Coconut Oil 2L',                         category:'Ambient', packing:'8 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Faash%20Coconut%20Oil%202L%20x%208.jpg' },
        { id:92,  name:'Fani Rice Palada Paysm Mix 200g',              category:'Ambient', packing:'50 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fani%20Rice%20Palada%20Paysm%20Mix%20200g%20x%2050.jpg' },
        { id:93,  name:'Fira Dosa Powder 1kg',                         category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Dosa%20Powder%201kg%20x%2010.jpg' },
        { id:94,  name:'Fira Goosbry BE.Chili Syrp 500ml',             category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Goosbry%20BE.Chili%20Syrp%20500ml%20x%2012.jpg' },
        { id:95,  name:'Fira Idiyapam Powder White 1kg',               category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Idiyapam%20Powder%20White%201kg%20x%2010.jpg' },
        { id:96,  name:'Fira Idly Powder 1kg',                         category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Idly%20Powder%201kg%20x%2010.jpg' },
        { id:97,  name:'Fira Knthri.Mango Chamanti 400g',              category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Knthri.Mango%20Chamanti%20400g%20x%2012.jpg' },
        { id:98,  name:'Fira Paalappam Powder 1kg',                    category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Paalappam%20Powder%201kg%20x%2010.jpg' },
        { id:99,  name:'Fira Rice Powder 1kg',                         category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:false,
          img:'assets/img/products/placeholder.svg' },
        { id:100, name:'Fira Steamed RicePuttu Powder 1Kg',            category:'Ambient', packing:'10 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Steamed%20RicePuttu%20Powder%201Kg%20x%2010.jpg' },
        { id:101, name:'Fira Synthetic Vinegar 500ml',                 category:'Ambient', packing:'24 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Fira%20Synthetic%20Vinegar%20500ml%20x%2024.jpg' },
        { id:102, name:'Tholur Garlic Pickle 300g',                    category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Tholur%20Garlic%20Pickle%20300g%20x%2012.jpg' },
        { id:103, name:'Tholur Ginger Garlic Paste 300g',              category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Tholur%20Ginger%20Garlic%20Paste%20300g%20x%2012.jpg' },
        { id:104, name:'Tholur Lime Pickle 300g',                      category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Tholur%20Lime%20Pickle%20300g%20x%2012.jpg' },
        { id:105, name:'Tholur Mango Pickle 300g',                     category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Tholur%20Mango%20Pickle%20300g%20x%2012.jpg' },
        { id:106, name:'Tholur Mix Veg Pickle 300g',                   category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Tholur%20Mix%20Veg%20Pickle%20300g%20x%2012.jpg' },
        { id:107, name:'Tholur Tender Mango Pickle 300g',              category:'Ambient', packing:'12 per carton', popular:true, rank:0, photo:true,
          img:'assets/img/products/AMBIENT/Tholur%20Tender%20Mango%20Pickle%20300g%20x%2012.jpg' }
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

        // Ranked products first ("★ 1", "★ 2"... in logo-and-products.md), then starred products
        // with a photo, then the rest, filling two rows of three.
        var popular=PRODUCTS.filter(function(product){ return product.popular; });
        var featured=popular.filter(function(p){ return p.rank; }).sort(function(a,b){ return a.rank-b.rank; })
            .concat(popular.filter(function(p){ return !p.rank && p.photo; }))
            .concat(popular.filter(function(p){ return !p.rank && !p.photo; }))
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

