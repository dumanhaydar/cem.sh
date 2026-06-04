# cem.sh

A terminal in your browser that does nothing in particular. A showcase, a vibe, an experiment.

Pure **CSR** SvelteKit SPA — no backend, no tracking, no purpose. fish-flavored, in
[Victor Mono](https://rubjo.github.io/victor-mono/), on an anthracite screen.

## Features

- Fake **fish shell**: live syntax highlighting (valid commands green, unknown red,
  options cyan, strings yellow), ghost-text **autosuggestions** from history (`Tab` / `→` to accept).
- Harmless faux commands: `help`, `about`, `whoami`, `echo`, `date`, `ls`, `cat`,
  `sudo`, `cowsay`, `matrix`, `theme`, `clear`, `exit`…
- Cosmetic CRT scanlines, vignette, blinking block cursor, boot sequence.
- `matrix` toggles a canvas rain; `theme` cycles the accent color.

## Stack

- [SvelteKit](https://svelte.dev/) (Svelte 5 runes) — CSR-only (`ssr = false`)
- [TailwindCSS v4](https://tailwindcss.com/)
- Deploys to [Cloudflare Pages](https://pages.cloudflare.com/) via `@sveltejs/adapter-cloudflare`

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # → .svelte-kit/cloudflare/
npm run preview
```

## Deploy (Cloudflare Pages)

Git-integrated: connect the repo in the Cloudflare dashboard with build command
`npm run build` and output directory `.svelte-kit/cloudflare`. Or one-shot:

```sh
npm run build && npx wrangler pages deploy
```

