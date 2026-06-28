# SignLang Eyes Configurator

[![License](https://img.shields.io/badge/license-Apache--2.0-0f766e)](LICENSE)

[简体中文](README.md) | [English](README.en.md)

SignLang Eyes Configurator is a configuration console for the SignLang Eyes gesture recognition device, built with Vue 3 and the Web Bluetooth API

It enables users to connect to the [SignLang Eyes](https://github.com/syxxzzr/signlang-eyes) device via Bluetooth, view real-time hand landmark streams, display recognition results, record gesture samples, and manage the on-device gesture library

> [![9th National College Student Embedded Chip and System Design Competition](src/assets/race_sign.png)](https://www.socchina.net/)

> This project is a configuration tool for the Smart Sign Language Glasses, developed for the entry `RK3588-Based Sign Language Translation and Sound Alert System` in the 9th [National College Student Embedded Chip and System Design Competition](https://www.socchina.net/). It communicates with the smart glasses via Bluetooth, enabling real-time display of sign language recognition results and dynamic addition or removal of sign language gestures

> This branch contains minor UI refinements specifically for the 9th [National College Student Embedded Chip and System Design Competition](https://www.socchina.net/) entry `RK3588-Based Sign Language Translation and Sound Alert System`. Compared with the master branch, the only differences are small UI adjustments and documentation updates

> The device-side code for the 9th [National College Student Embedded Chip and System Design Competition](https://www.socchina.net/) entry `RK3588-Based Sign Language Translation and Sound Alert System` is also fully open source. The repository is available at: [https://github.com/syxxzzr/signlang-eyes](https://github.com/syxxzzr/signlang-eyes)

> You can access our Demo, which is deployed under the Cloudflare Pages service, via the following link:
> - [https://signlang-eyes-configurator.soc-race.syxxzzr.eu.org](https://signlang-eyes-configurator.soc-race.syxxzzr.eu.org)
> - [https://signlang-eyes-configurator.pages.dev](https://signlang-eyes-configurator.pages.dev)

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
