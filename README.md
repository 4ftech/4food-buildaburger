# Build-A-Burger — 4food memorial widget

A modern, static reconstruction of the original 4food.com Build-A-Burger
experience. Pure HTML/CSS/JS — no backend, no build step, no dependencies.

## Live demo

Once deployed: `https://your-vercel-url.vercel.app`

To embed in another site (e.g. Webflow):

```html
<iframe
  src="https://your-vercel-url.vercel.app"
  width="100%"
  height="900"
  frameborder="0"
  scrolling="no"
  title="Build-A-Burger">
</iframe>
```

## Structure

```
buildaburger/
├── index.html              # Markup
├── style.css               # All styling (CSS custom properties, mobile-first)
├── app.js                  # Catalog + state + interaction
├── vercel.json             # Cache headers + iframe-friendly headers
├── images/
│   └── ingredients/        # 34 PNG ingredient layers (150px wide, transparent)
└── README.md
```

## Features

- **Visual layered burger** — 7-layer stack (bun-top, slice, scoop, cheese, condiments, protein, bun-bottom)
- **Ingredient picker** — tap any layer to swap; condiments are multi-select
- **Live pricing** — base + premium upcharges + condiment overage (matches original `builder.py` logic)
- **Share via URL** — share button copies a shareable link encoding the entire burger config
- **Mobile-responsive** — stacks vertically on phones, side-by-side on desktop
- **Accessible** — keyboard navigable, ARIA labels, respects `prefers-reduced-motion`
- **No tracking, no cookies, no data collection**

## Pricing model

- Base burger: **$8.00**
- First **3 condiments**: free
- Each additional condiment: **+$0.50**
- Per-ingredient upcharges defined in `app.js` (`CATEGORIES` object)

## Deployment

1. Push this folder to a GitHub repo
2. Connect the repo to [Vercel](https://vercel.com)
3. Vercel auto-detects it as a static site — no configuration needed
4. Done

The `vercel.json` file ensures aggressive caching of images (immutable, 1 year)
and explicit `X-Frame-Options: ALLOWALL` so the widget can be iframed from anywhere.

## Customization

- **Add/remove ingredients**: edit the `CATEGORIES` object in `app.js`
- **Change pricing**: tweak `BASE_PRICE`, `FREE_CONDIMENTS`, `CONDIMENT_OVERAGE` constants
- **Restyle**: all colors are CSS custom properties at the top of `style.css`
- **Default burger**: edit `DEFAULT_STATE` in `app.js`

## Credits

Original Build-A-Burger by 4food (closed 2014). This is a static memorial
recreation built from the original ingredient artwork preserved in the
`fourfood-django` and `fourfood-static` repos.
