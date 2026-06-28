# SignLang Eyes Configurator

[![License](https://img.shields.io/badge/license-Apache--2.0-0f766e)](LICENSE)

[简体中文](README.md) | [English](README.en.md)

SignLang Eyes Configurator is a configuration console for the SignLang Eyes gesture recognition device, built with Vue 3 and the Web Bluetooth API

It enables users to connect to the [SignLang Eyes](https://github.com/syxxzzr/signlang-eyes) device via Bluetooth, view real-time hand landmark streams, display recognition results, record gesture samples, and manage the on-device gesture library

## Local Development

This project uses `pnpm` as its package manager. Please make sure `pnpm` is installed in your development environment before getting started

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm run dev
```

Build for production:

```sh
pnpm run build
```

## Deploying to Cloudflare Pages

This project is a serverless web application, making it easy to deploy globally using Cloudflare Pages.

### Deploy from a Git Repository
For detailed deployment instructions, please refer to the official Cloudflare documentation: https://developers.cloudflare.com/pages/get-started/git-integration/

### Deploy with Cloudflare Wrangler

This project also supports deployment using the `Wrangler CLI`

Preview the Pages deployment locally:

```sh
pnpm run pages:preview
```

Build and deploy to Cloudflare Pages:

```sh
pnpm run pages:deploy
```

---

After deployment, Cloudflare Pages will provide a default `*.pages.dev` domain for accessing your application.

> In some regions, the default `*.pages.dev` domain may not be accessible. In such cases, you can configure a custom domain using Cloudflare's official custom domain support.

## Acknowledgements

- [Vue](https://github.com/vuejs/core)
- [Vite](https://github.com/vitejs/vite)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [Pinia](https://github.com/vuejs/pinia)
- [Vue I18n](https://github.com/intlify/vue-i18n)
- [VueUse](https://github.com/vueuse/vueuse)
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
- [shadcn-vue](https://github.com/unovue/shadcn-vue)
- [Reka UI](https://github.com/unovue/reka-ui)
- [Lucide](https://github.com/lucide-icons/lucide)
- [vue-sonner](https://github.com/xiaoluoboding/vue-sonner)
- [Vitest](https://github.com/vitest-dev/vitest)
- [Wrangler](https://github.com/cloudflare/workers-sdk)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Shields.io](https://github.com/badges/shields)
