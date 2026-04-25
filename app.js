/* ============================================================
   Build-A-Burger — recreation matching original 4food UX
   ============================================================ */

(function() {
  'use strict';

  /* ----------------------------------------------------------
     Catalog: 34 ingredients across 6 categories
     ---------------------------------------------------------- */

  const CATEGORIES = {
    bun: {
      label: 'Bun',
      title: 'Choose a Bun',
      max: 1,
      allowNone: false,
      options: [
        { id: 'brioche',    name: 'Brioche',    img: 'bun-Brioche.png' },
        { id: 'focaccia',   name: 'Focaccia',   img: 'bun-Focaccia.png' },
        { id: 'multigrain', name: 'Multigrain', img: 'bun-Multigrain.png' },
        { id: 'rice',       name: 'Pressed Rice', img: 'bun-Rice.png' },
      ],
    },
    condiment: {
      label: 'Condiments',
      title: 'Choose your Condiments',
      hint: '',
      max: 8,
      multiSelect: true,
      options: [
        { id: 'barbecue',     name: 'Barbecue',    img: 'cond-Barbecue.png' },
        { id: 'basil-pesto',  name: 'Basil Pesto', img: 'cond-BasilPesto.png' },
        { id: 'chipotle',     name: 'Chipotle',    img: 'cond-Chipotle.png' },
        { id: 'garlic-mayo',  name: 'Garlic Mayo', img: 'cond-GarlicMayo.png' },
        { id: 'hummus',       name: 'Hummus',      img: 'cond-Hummus.png' },
        { id: 'ketchup',      name: 'Ketchup',     img: 'cond-Ketchup.png' },
        { id: 'mayonnaise',   name: 'Mayonnaise',  img: 'cond-Mayonaisse.png' },
        { id: 'mustard',      name: 'Mustard',     img: 'cond-Mustard.png' },
      ],
    },
    slice: {
      label: 'Slice',
      title: 'Choose a Slice',
      max: 1,
      allowNone: true,
      options: [
        { id: 'avocado',  name: 'Avocado',  img: 'slice-Avocado.png' },
        { id: 'pancetta', name: 'Pancetta', img: 'slice-Pancetta.png' },
        { id: 'shiitake', name: 'Shiitake', img: 'slice-Shiitake.png' },
      ],
    },
    cheese: {
      label: 'Cheese',
      title: 'Choose a Cheese',
      max: 1,
      allowNone: true,
      options: [
        { id: 'cheddar',    name: 'Cheddar',    img: 'cheese-Cheddar.png' },
        { id: 'manchego',   name: 'Manchego',   img: 'cheese-Manchego.png' },
        { id: 'mozzarella', name: 'Mozzarella', img: 'cheese-Mozzarella.png' },
        { id: 'provolone',  name: 'Provolone',  img: 'cheese-Provolone.png' },
        { id: 'swiss',      name: 'Swiss',      img: 'cheese-Swiss.png' },
      ],
    },
    scoop: {
      label: 'Scoop',
      title: 'Choose a Scoop',
      max: 1,
      allowNone: true,
      options: [
        { id: 'avocado',         name: 'Avocado',                img: 'scoop-Avocado.png' },
        { id: 'cheddar-grits',   name: 'Cheddar & Scallion Grits', img: 'scoop-CheddarScallionGrits.png' },
        { id: 'chipotle-hominy', name: 'Chipotle Hominy',        img: 'scoop-ChipotleHominy.png' },
        { id: 'edamame',         name: 'Edamame',                img: 'scoop-Edamame.png' },
        { id: 'mac-cheese',      name: 'Mac & Cheese',           img: 'scoop-MacAndCheese.png' },
        { id: 'mushroom-onion',  name: 'Mushroom & Onion',       img: 'scoop-MushroomAndOnions.png' },
        { id: 'chorizo-hash',    name: 'Potato Chorizo Hash',    img: 'scoop-PotatoChorizoHash.png' },
        { id: 'roasted-pepper',  name: 'Roasted Pepper',         img: 'scoop-RoastedPepper.png' },
      ],
    },
    protein: {
      label: 'Protein',
      title: 'Choose a Protein',
      max: 1,
      allowNone: false,
      options: [
        { id: 'beef',    name: 'Grass-Fed Beef', img: 'protein-GrassFedBeef.png' },
        { id: 'chicken', name: 'Chicken',        img: 'protein-Chicken.png' },
        { id: 'lamb',    name: 'Pasture Lamb',   img: 'protein-PastureLamb.png' },
        { id: 'salmon',  name: 'Salmon',         img: 'protein-Salmon.png' },
        { id: 'turkey',  name: 'Turkey',         img: 'protein-Turkey.png' },
        { id: 'veggie',  name: 'Veggie',         img: 'protein-Veggie.png' },
      ],
    },
  };

  // Stack order top-to-bottom (canonical 4food (W)holeburger structure)
  const STACK_ORDER = ['bun-top', 'condiment', 'slice', 'cheese', 'scoop', 'protein', 'bun-bottom'];

  /* ----------------------------------------------------------
     State — start with a default burger so it's never empty
     ---------------------------------------------------------- */

  const DEFAULT_STATE = {
    bun:        'brioche',
    slice:      'pancetta',
    scoop:      'mushroom-onion',
    cheese:     'manchego',
    condiment:  ['ketchup', 'garlic-mayo'],
    protein:    'beef',
  };

  let state = cloneState(DEFAULT_STATE);
  let activeCategory = 'bun'; // bun picker open by default — matches original

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
    wrap.className = 'bb-layer';
    // Only the top bun shows the active highlight (avoids two boxes)
    if (activeCategory === 'bun' && slot === 'bun-top') wrap.classList.add('is-active');
    wrap.dataset.category = 'bun';
    wrap.setAttribute('aria-label', `Bun: ${opt ? opt.name : 'none'} (tap to change)`);

    const img = document.createElement('img');
    img.className = 'bb-layer__img';
    if (slot === 'bun-bottom') img.classList.add('bb-layer__img--bun-bottom');
    img.alt = '';
    img.src = imgPath(opt ? opt.img : 'bun-Brioche.png');
    wrap.appendChild(img);

    if (slot === 'bun-top') {
      const label = document.createElement('span');
      label.className = 'bb-layer__label';
      label.textContent = opt ? opt.name : 'No Bun';
      wrap.appendChild(label);
    }

    wrap.addEventListener('click', () => openCategory('bun'));
    return wrap;
  }

  function createSimpleLayer(category) {
    const opt = findOption(category, state[category]);
    const cat = CATEGORIES[category];
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'bb-layer';
    if (activeCategory === category) wrap.classList.add('is-active');
    wrap.dataset.category = category;
    wrap.setAttribute('aria-label', `${cat.label}: ${opt ? opt.name : 'none'} (tap to change)`);

    if (opt) {
      const img = document.createElement('img');
      img.className = 'bb-layer__img';
      img.alt = '';
      img.src = imgPath(opt.img);
      wrap.appendChild(img);

      const label = document.createElement('span');
      label.className = 'bb-layer__label';
      label.textContent = opt.name;
      wrap.appendChild(label);
    } else {
      const ph = document.createElement('div');
      ph.className = 'bb-layer__placeholder';
      ph.textContent = `No ${cat.label}`;
      wrap.appendChild(ph);
    }

    wrap.addEventListener('click', () => openCategory(category));
    return wrap;
  }

  function createCondimentLayer() {
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'bb-layer';
    if (activeCategory === 'condiment') wrap.classList.add('is-active');
    wrap.dataset.category = 'condiment';

    const conds = (state.condiment || []).map(id => findOption('condiment', id)).filter(Boolean);
    wrap.setAttribute('aria-label', `Condiments: ${conds.length} selected (tap to change)`);

    const row = document.createElement('div');
    row.className = 'bb-layer__condiments';
    if (conds.length === 0) {
      const placeholder = document.createElement('span');
      placeholder.className = 'bb-layer__placeholder';
      placeholder.textContent = 'No Condiments';
      row.appendChild(placeholder);
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
    label.className = 'bb-layer__label';
    label.textContent = `${conds.length} Condiment${conds.length === 1 ? '' : 's'}`;
    wrap.appendChild(label);

    wrap.addEventListener('click', () => openCategory('condiment'));
    return wrap;
  }

  /* ----------------------------------------------------------
     Render: picker (vertical scrolling list)
     ---------------------------------------------------------- */

  function openCategory(category) {
    activeCategory = category;
    renderAll();
  }

  function renderPicker() {
    const cat = CATEGORIES[activeCategory];
    const titleEl = document.getElementById('picker-title');
    const listEl = document.getElementById('picker-list');

    // Title with optional condiment hint
    titleEl.innerHTML = '';
    titleEl.appendChild(document.createTextNode(cat.title));
    if (activeCategory === 'condiment') {
      const hint = document.createElement('span');
      hint.className = 'bb-picker__hint';
      hint.textContent = '(click to add or remove)';
      titleEl.appendChild(hint);
    }

    // Options list
    listEl.innerHTML = '';
    cat.options.forEach(opt => {
      const row = createOptionRow(activeCategory, opt, cat);
      listEl.appendChild(row);
    });

    // "None" button (No Cheese, No Scoop, etc.) — original behavior for optional layers
    if (cat.allowNone) {
      const noneWrap = document.createElement('div');
      noneWrap.className = 'bb-none';
      const noneBtn = document.createElement('button');
      noneBtn.type = 'button';
      noneBtn.className = 'bb-none__btn';
      noneBtn.textContent = `No ${cat.label}`;
      noneBtn.addEventListener('click', () => {
        if (cat.multiSelect) {
          state[activeCategory] = [];
        } else {
          state[activeCategory] = null;
        }
        renderAll();
      });
      noneWrap.appendChild(noneBtn);
      listEl.appendChild(noneWrap);
    }

    // For multi-select condiments, show "No Condiments" button
    if (cat.multiSelect) {
      const noneWrap = document.createElement('div');
      noneWrap.className = 'bb-none';
      const noneBtn = document.createElement('button');
      noneBtn.type = 'button';
      noneBtn.className = 'bb-none__btn';
      noneBtn.textContent = `No ${cat.label}`;
      noneBtn.addEventListener('click', () => {
        state[activeCategory] = [];
        renderAll();
      });
      noneWrap.appendChild(noneBtn);
      listEl.appendChild(noneWrap);
    }
  }

  function createOptionRow(category, opt, cat) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'bb-option';
    row.setAttribute('role', 'option');

    const isSelected = cat.multiSelect
      ? (state[category] || []).includes(opt.id)
      : state[category] === opt.id;

    if (isSelected) row.classList.add('is-selected');
    row.setAttribute('aria-selected', isSelected ? 'true' : 'false');

    // Checkbox indicator (visible always for condiments — original behavior)
    if (cat.multiSelect) {
      const check = document.createElement('span');
      check.className = 'bb-option__check';
      check.setAttribute('aria-hidden', 'true');
      row.appendChild(check);
    }

    // Image
    const img = document.createElement('img');
    img.className = 'bb-option__img';
    img.alt = '';
    img.src = imgPath(opt.img);
    row.appendChild(img);

    // Name
    const name = document.createElement('span');
    name.className = 'bb-option__name';
    name.textContent = opt.name;
    row.appendChild(name);

    row.addEventListener('click', () => selectOption(category, opt.id, cat));
    return row;
  }

  /* ----------------------------------------------------------
     Selection logic
     ---------------------------------------------------------- */

  function selectOption(category, optionId, cat) {
    if (cat.multiSelect) {
      const arr = state[category] || [];
      const idx = arr.indexOf(optionId);
      if (idx >= 0) {
        arr.splice(idx, 1); // toggle off
      } else {
        if (arr.length >= cat.max) return;
        arr.push(optionId);
      }
      state[category] = arr;
    } else {
      state[category] = optionId;
    }
    renderAll();
  }

  /* ----------------------------------------------------------
     Render orchestrator
     ---------------------------------------------------------- */

  function renderAll() {
    renderStack();
    renderPicker();
  }

  /* ----------------------------------------------------------
     Boot — auto-open bun picker on load (matches original behavior)
     ---------------------------------------------------------- */

  function init() {
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
