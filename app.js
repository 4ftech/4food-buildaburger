/* ============================================================
   Build-A-Burger — interactive logic
   ============================================================ */

(function() {
  'use strict';

  /* ----------------------------------------------------------
     Catalog: ingredients organized by layer category.
     Pricing follows the spirit of the original builder.py:
       - Base burger price
       - Premium ingredients add upcharge
       - First N condiments free, rest cost extra
     ---------------------------------------------------------- */

  const BASE_PRICE        = 8.00;  // base whole-burger price (period-appropriate)
  const FREE_CONDIMENTS   = 3;
  const CONDIMENT_OVERAGE = 0.50;

  // Layer categories, ordered top-to-bottom for visual stack
  // (bun-top is rendered separately as it shares the bun selection)
  const CATEGORIES = {
    bun: {
      label: 'Bun',
      helper: 'The foundation of your burger.',
      max: 1,
      options: [
        { id: 'brioche',    name: 'Brioche',    img: 'bun-Brioche.png',    upcharge: 0 },
        { id: 'focaccia',   name: 'Focaccia',   img: 'bun-Focaccia.png',   upcharge: 0 },
        { id: 'multigrain', name: 'Multigrain', img: 'bun-Multigrain.png', upcharge: 0 },
        { id: 'rice',       name: 'Pressed Rice', img: 'bun-Rice.png',     upcharge: 0.50 },
      ],
    },
    slice: {
      label: 'Slice',
      helper: 'A topping layer between bun and scoop.',
      max: 1,
      allowNone: true,
      options: [
        { id: 'avocado',  name: 'Avocado',  img: 'slice-Avocado.png',  upcharge: 1.00 },
        { id: 'pancetta', name: 'Pancetta', img: 'slice-Pancetta.png', upcharge: 1.00 },
        { id: 'shiitake', name: 'Shiitake', img: 'slice-Shiitake.png', upcharge: 0.50 },
      ],
    },
    scoop: {
      label: 'Scoop',
      helper: 'A flavorful scoop topping.',
      max: 1,
      allowNone: true,
      options: [
        { id: 'avocado',         name: 'Avocado',                img: 'scoop-Avocado.png',              upcharge: 1.00 },
        { id: 'cheddar-grits',   name: 'Cheddar & Scallion Grits', img: 'scoop-CheddarScallionGrits.png', upcharge: 0.50 },
        { id: 'chipotle-hominy', name: 'Chipotle Hominy',        img: 'scoop-ChipotleHominy.png',       upcharge: 0.50 },
        { id: 'edamame',         name: 'Edamame',                img: 'scoop-Edamame.png',              upcharge: 0 },
        { id: 'mac-cheese',      name: 'Mac & Cheese',           img: 'scoop-MacAndCheese.png',         upcharge: 0.50 },
        { id: 'mushroom-onion',  name: 'Mushroom & Onion',       img: 'scoop-MushroomAndOnions.png',    upcharge: 0 },
        { id: 'chorizo-hash',    name: 'Potato Chorizo Hash',    img: 'scoop-PotatoChorizoHash.png',    upcharge: 1.00 },
        { id: 'roasted-pepper',  name: 'Roasted Pepper',         img: 'scoop-RoastedPepper.png',        upcharge: 0 },
      ],
    },
    cheese: {
      label: 'Cheese',
      helper: 'Pick your cheese — or skip it.',
      max: 1,
      allowNone: true,
      options: [
        { id: 'cheddar',    name: 'Cheddar',    img: 'cheese-Cheddar.png',    upcharge: 0 },
        { id: 'manchego',   name: 'Manchego',   img: 'cheese-Manchego.png',   upcharge: 0.50 },
        { id: 'mozzarella', name: 'Mozzarella', img: 'cheese-Mozzarella.png', upcharge: 0 },
        { id: 'provolone',  name: 'Provolone',  img: 'cheese-Provolone.png',  upcharge: 0 },
        { id: 'swiss',      name: 'Swiss',      img: 'cheese-Swiss.png',      upcharge: 0 },
      ],
    },
    condiment: {
      label: 'Condiments',
      helper: 'First 3 free. Each additional condiment is $0.50.',
      max: 8,
      multiSelect: true,
      options: [
        { id: 'barbecue',     name: 'Barbecue',    img: 'cond-Barbecue.png',   upcharge: 0 },
        { id: 'basil-pesto',  name: 'Basil Pesto', img: 'cond-BasilPesto.png', upcharge: 0 },
        { id: 'chipotle',     name: 'Chipotle',    img: 'cond-Chipotle.png',   upcharge: 0 },
        { id: 'garlic-mayo',  name: 'Garlic Mayo', img: 'cond-GarlicMayo.png', upcharge: 0 },
        { id: 'hummus',       name: 'Hummus',      img: 'cond-Hummus.png',     upcharge: 0 },
        { id: 'ketchup',      name: 'Ketchup',     img: 'cond-Ketchup.png',    upcharge: 0 },
        { id: 'mayonnaise',   name: 'Mayonnaise',  img: 'cond-Mayonaisse.png', upcharge: 0 },
        { id: 'mustard',      name: 'Mustard',     img: 'cond-Mustard.png',    upcharge: 0 },
      ],
    },
    protein: {
      label: 'Protein',
      helper: 'The patty — the heart of the burger.',
      max: 1,
      options: [
        { id: 'beef',    name: 'Grass-Fed Beef', img: 'protein-GrassFedBeef.png', upcharge: 0 },
        { id: 'chicken', name: 'Chicken',        img: 'protein-Chicken.png',      upcharge: 0 },
        { id: 'lamb',    name: 'Pasture Lamb',   img: 'protein-PastureLamb.png',  upcharge: 1.00 },
        { id: 'salmon',  name: 'Salmon',         img: 'protein-Salmon.png',       upcharge: 1.00 },
        { id: 'turkey',  name: 'Turkey',         img: 'protein-Turkey.png',       upcharge: 0 },
        { id: 'veggie',  name: 'Veggie',         img: 'protein-Veggie.png',       upcharge: 0 },
      ],
    },
  };

  // Visual stack order: top to bottom
  // (canonical 4food (W)holeburger order, per the exploded reference image:
  //  bun-top → condiment → slice → cheese → scoop → protein → bun-bottom)
  const STACK_ORDER = ['bun-top', 'condiment', 'slice', 'cheese', 'scoop', 'protein', 'bun-bottom'];

  /* ----------------------------------------------------------
     State
     ---------------------------------------------------------- */

  // Default starter burger (matches the Wayback screenshot vibe)
  const DEFAULT_STATE = {
    bun:        'brioche',
    slice:      'pancetta',
    scoop:      'mushroom-onion',
    cheese:     'manchego',
    condiment:  ['ketchup', 'garlic-mayo'],
    protein:    'beef',
  };

  let state = loadStateFromURL() || cloneState(DEFAULT_STATE);
  let activeCategory = null;

  /* ----------------------------------------------------------
     Helpers
     ---------------------------------------------------------- */

  function cloneState(s) {
    return {
      bun: s.bun,
      slice: s.slice,
      scoop: s.scoop,
      cheese: s.cheese,
      condiment: Array.isArray(s.condiment) ? [...s.condiment] : [],
      protein: s.protein,
    };
  }

  function findOption(categoryKey, optionId) {
    if (!optionId) return null;
    const cat = CATEGORIES[categoryKey];
    if (!cat) return null;
    return cat.options.find(o => o.id === optionId) || null;
  }

  function imgPath(filename) {
    return `images/ingredients/${filename}`;
  }

  function formatPrice(n) {
    return '$' + n.toFixed(2);
  }

  /* ----------------------------------------------------------
     URL state — encode/decode
     ---------------------------------------------------------- */

  function loadStateFromURL() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('b')) return null;
      const decoded = JSON.parse(atob(params.get('b')));
      // Sanity-check: ensure shape is right
      if (typeof decoded !== 'object') return null;
      return {
        bun: decoded.bun || null,
        slice: decoded.slice || null,
        scoop: decoded.scoop || null,
        cheese: decoded.cheese || null,
        condiment: Array.isArray(decoded.condiment) ? decoded.condiment : [],
        protein: decoded.protein || null,
      };
    } catch (e) {
      return null;
    }
  }

  function buildShareURL() {
    const encoded = btoa(JSON.stringify(state));
    const url = new URL(window.location.href);
    url.searchParams.set('b', encoded);
    return url.toString();
  }

  /* ----------------------------------------------------------
     Pricing
     ---------------------------------------------------------- */

  function calculatePrice() {
    let price = BASE_PRICE;

    // Single-select layers (bun, slice, scoop, cheese, protein)
    ['bun', 'slice', 'scoop', 'cheese', 'protein'].forEach(cat => {
      const opt = findOption(cat, state[cat]);
      if (opt) price += opt.upcharge;
    });

    // Condiments: premium upcharges always apply, plus overage
    const conds = state.condiment || [];
    conds.forEach(id => {
      const opt = findOption('condiment', id);
      if (opt) price += opt.upcharge;
    });

    if (conds.length > FREE_CONDIMENTS) {
      price += (conds.length - FREE_CONDIMENTS) * CONDIMENT_OVERAGE;
    }

    return price;
  }

  /* ----------------------------------------------------------
     Render: stack on the left
     ---------------------------------------------------------- */

  function renderStack() {
    const stackEl = document.getElementById('stack');
    stackEl.innerHTML = '';

    STACK_ORDER.forEach(slot => {
      const layer = createLayerElement(slot);
      if (layer) stackEl.appendChild(layer);
    });
  }

  function createLayerElement(slot) {
    // Map stack slot -> category logic
    if (slot === 'bun-top' || slot === 'bun-bottom') {
      return createBunLayer(slot);
    }
    if (slot === 'condiment') {
      return createCondimentLayer();
    }
    return createSimpleLayer(slot);
  }

  function createBunLayer(slot) {
    const opt = findOption('bun', state.bun);
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'layer';
    if (activeCategory === 'bun') wrap.classList.add('is-active');
    wrap.dataset.category = 'bun';
    wrap.setAttribute('aria-label', `Bun: ${opt ? opt.name : 'none'} (tap to change)`);

    const img = document.createElement('img');
    img.className = 'layer__img';
    img.alt = '';
    img.src = imgPath(opt ? opt.img : 'bun-Brioche.png');
    if (slot === 'bun-bottom') {
      // The original bun PNGs aren't symmetric — instead of flipping them,
      // we render the bottom slightly smaller so it reads as the heel of the bun.
      img.style.transform = 'scaleY(0.55)';
      img.style.transformOrigin = 'top center';
      img.style.marginTop = '-10px';
    }
    wrap.appendChild(img);

    if (slot === 'bun-top') {
      const label = document.createElement('span');
      label.className = 'layer__label';
      label.textContent = opt ? opt.name : 'No Bun';
      wrap.appendChild(label);
    }

    wrap.addEventListener('click', () => openPicker('bun'));
    return wrap;
  }

  function createSimpleLayer(category) {
    const opt = findOption(category, state[category]);
    const cat = CATEGORIES[category];
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'layer';
    if (!opt) wrap.classList.add('is-empty');
    if (activeCategory === category) wrap.classList.add('is-active');
    wrap.dataset.category = category;
    wrap.setAttribute('aria-label', `${cat.label}: ${opt ? opt.name : 'none'} (tap to change)`);

    if (opt) {
      const img = document.createElement('img');
      img.className = 'layer__img';
      img.alt = '';
      img.src = imgPath(opt.img);
      wrap.appendChild(img);

      const label = document.createElement('span');
      label.className = 'layer__label';
      label.textContent = opt.name;
      if (opt.upcharge > 0) {
        const up = document.createElement('span');
        up.className = 'layer__upcharge';
        up.textContent = '+$' + opt.upcharge.toFixed(2);
        label.appendChild(up);
      }
      wrap.appendChild(label);
    } else {
      const label = document.createElement('span');
      label.className = 'layer__label';
      label.textContent = `+ Add ${cat.label}`;
      wrap.appendChild(label);
    }

    wrap.addEventListener('click', () => openPicker(category));
    return wrap;
  }

  function createCondimentLayer() {
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'layer';
    if (activeCategory === 'condiment') wrap.classList.add('is-active');
    wrap.dataset.category = 'condiment';

    const conds = (state.condiment || []).map(id => findOption('condiment', id)).filter(Boolean);
    wrap.setAttribute('aria-label', `Condiments: ${conds.length} selected (tap to change)`);

    const row = document.createElement('div');
    row.className = 'layer__condiments';
    if (conds.length === 0) {
      row.innerHTML = '<span style="font-size:0.78rem;color:var(--ink-muted);font-style:italic;">No condiments</span>';
    } else {
      conds.forEach(c => {
        const img = document.createElement('img');
        img.alt = '';
        img.src = imgPath(c.img);
        img.title = c.name;
        row.appendChild(img);
      });
    }
    wrap.appendChild(row);

    const label = document.createElement('span');
    label.className = 'layer__label';
    label.textContent = `${conds.length} Condiment${conds.length === 1 ? '' : 's'}`;
    wrap.appendChild(label);

    wrap.addEventListener('click', () => openPicker('condiment'));
    return wrap;
  }

  /* ----------------------------------------------------------
     Render: picker on the right
     ---------------------------------------------------------- */

  function openPicker(category) {
    activeCategory = category;
    renderPicker();
    renderStack(); // re-render to highlight active layer
  }

  function renderPicker() {
    const titleEl  = document.getElementById('picker-title');
    const helperEl = document.getElementById('picker-helper');
    const gridEl   = document.getElementById('picker-grid');

    if (!activeCategory) {
      titleEl.textContent = 'Tap a layer →';
      helperEl.textContent = 'Choose any layer of your burger to begin.';
      gridEl.className = 'picker__grid picker__grid--empty';
      gridEl.innerHTML = 'Your ingredient options will appear here.';
      return;
    }

    const cat = CATEGORIES[activeCategory];
    titleEl.textContent = cat.label;
    helperEl.textContent = cat.helper;
    gridEl.className = 'picker__grid';
    gridEl.innerHTML = '';

    // Optional "None" tile for layers that allow it (single-select only)
    if (cat.allowNone && !cat.multiSelect) {
      const noneEl = document.createElement('button');
      noneEl.type = 'button';
      noneEl.className = 'option option--none';
      if (!state[activeCategory]) noneEl.classList.add('is-selected');
      noneEl.setAttribute('role', 'option');
      noneEl.setAttribute('aria-selected', !state[activeCategory] ? 'true' : 'false');
      noneEl.innerHTML = `
        <div class="option__img" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;">∅</div>
        <span class="option__name">None</span>
      `;
      noneEl.addEventListener('click', () => selectOption(activeCategory, null));
      gridEl.appendChild(noneEl);
    }

    // Render each option
    cat.options.forEach(opt => {
      const optEl = document.createElement('button');
      optEl.type = 'button';
      optEl.className = 'option';
      optEl.setAttribute('role', 'option');

      const isSelected = cat.multiSelect
        ? (state[activeCategory] || []).includes(opt.id)
        : state[activeCategory] === opt.id;

      if (isSelected) optEl.classList.add('is-selected');
      optEl.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      const img = document.createElement('img');
      img.className = 'option__img';
      img.alt = '';
      img.src = imgPath(opt.img);
      optEl.appendChild(img);

      const name = document.createElement('span');
      name.className = 'option__name';
      name.textContent = opt.name;
      optEl.appendChild(name);

      if (opt.upcharge > 0) {
        const up = document.createElement('span');
        up.className = 'option__upcharge';
        up.style.background = opt.upcharge >= 1 ? 'var(--premium)' : 'var(--half)';
        up.textContent = opt.upcharge >= 1 ? '$' : '¢';
        up.title = `+ $${opt.upcharge.toFixed(2)} upcharge`;
        optEl.appendChild(up);
      }

      optEl.addEventListener('click', () => selectOption(activeCategory, opt.id));
      gridEl.appendChild(optEl);
    });
  }

  /* ----------------------------------------------------------
     Selection logic
     ---------------------------------------------------------- */

  function selectOption(category, optionId) {
    const cat = CATEGORIES[category];

    if (cat.multiSelect) {
      // Toggle in array
      const arr = state[category] || [];
      const idx = arr.indexOf(optionId);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        if (arr.length >= cat.max) return; // max reached
        arr.push(optionId);
      }
      state[category] = arr;
    } else {
      state[category] = optionId;
    }

    renderAll();
  }

  /* ----------------------------------------------------------
     Render everything
     ---------------------------------------------------------- */

  function renderAll() {
    renderStack();
    renderPicker();
    renderPrice();
  }

  function renderPrice() {
    document.getElementById('price').textContent = formatPrice(calculatePrice());
  }

  /* ----------------------------------------------------------
     Share + Reset
     ---------------------------------------------------------- */

  async function handleShare() {
    const url = buildShareURL();

    // Try clipboard API (modern browsers)
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        showToast('Link copied — share your burger.');
        return;
      }
    } catch (e) { /* fall through */ }

    // Fallback: prompt
    window.prompt('Copy your shareable burger link:', url);
  }

  function handleReset() {
    state = cloneState(DEFAULT_STATE);
    activeCategory = null;
    // Strip query params
    const url = new URL(window.location.href);
    url.searchParams.delete('b');
    window.history.replaceState({}, '', url);
    renderAll();
    showToast('Reset to default.');
  }

  let toastTimer = null;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2400);
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */

  function init() {
    document.getElementById('btn-share').addEventListener('click', handleShare);
    document.getElementById('btn-reset').addEventListener('click', handleReset);

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
