export const localeOptions = ['zh-CN', 'en-US'] as const
export const colorModeOptions = ['system', 'light', 'dark'] as const
export const accentOptionKeys = ['petrol', 'cobalt', 'orchid', 'ember'] as const

export type AppLocale = (typeof localeOptions)[number]
export type ColorMode = (typeof colorModeOptions)[number]
export type ResolvedColorMode = Exclude<ColorMode, 'system'>
export type AccentKey = (typeof accentOptionKeys)[number]

export interface AppPreferences {
  locale: AppLocale
  colorMode: ColorMode
  accent: AccentKey
}

export interface AccentOption {
  label: string
  cssVars: {
    accent: string
    accentForeground: string
    accentSoft: string
    accentBorder: string
    ring: string
  }
}

type PreferenceRoot = {
  classList: {
    add(value: string): void
    remove(value: string): void
  }
  dataset: Record<string, string | undefined>
  style: {
    setProperty(name: string, value: string): void
  }
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  locale: 'zh-CN',
  colorMode: 'system',
  accent: 'petrol',
}

export const accentOptions: Record<AccentKey, AccentOption> = {
  petrol: {
    label: 'Petrol green',
    cssVars: {
      accent: 'hsl(176 58% 32%)',
      accentForeground: 'hsl(180 36% 96%)',
      accentSoft: 'hsl(176 52% 90%)',
      accentBorder: 'hsl(176 48% 44%)',
      ring: 'hsl(176 58% 42%)',
    },
  },
  cobalt: {
    label: 'Cobalt',
    cssVars: {
      accent: 'hsl(219 76% 53%)',
      accentForeground: 'hsl(214 38% 98%)',
      accentSoft: 'hsl(218 82% 94%)',
      accentBorder: 'hsl(219 72% 58%)',
      ring: 'hsl(219 76% 56%)',
    },
  },
  orchid: {
    label: 'Orchid',
    cssVars: {
      accent: 'hsl(294 55% 56%)',
      accentForeground: 'hsl(300 48% 98%)',
      accentSoft: 'hsl(294 58% 94%)',
      accentBorder: 'hsl(294 54% 61%)',
      ring: 'hsl(294 55% 58%)',
    },
  },
  ember: {
    label: 'Ember',
    cssVars: {
      accent: 'hsl(18 86% 55%)',
      accentForeground: 'hsl(24 45% 98%)',
      accentSoft: 'hsl(18 92% 94%)',
      accentBorder: 'hsl(18 76% 58%)',
      ring: 'hsl(18 86% 56%)',
    },
  },
}

function isOption<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === 'string' && options.includes(value)
}

export function normalizePreferences(value: unknown): AppPreferences {
  if (!value || typeof value !== 'object') return { ...DEFAULT_PREFERENCES }
  const input = value as Partial<Record<keyof AppPreferences, unknown>>

  return {
    locale: isOption(input.locale, localeOptions)
      ? input.locale
      : DEFAULT_PREFERENCES.locale,
    colorMode: isOption(input.colorMode, colorModeOptions)
      ? input.colorMode
      : DEFAULT_PREFERENCES.colorMode,
    accent: isOption(input.accent, accentOptionKeys)
      ? input.accent
      : DEFAULT_PREFERENCES.accent,
  }
}

export function resolveColorMode(
  colorMode: ColorMode,
  prefersDark: boolean,
): ResolvedColorMode {
  return colorMode === 'system' ? (prefersDark ? 'dark' : 'light') : colorMode
}

export function applyDocumentPreferences(
  preferences: AppPreferences,
  root: PreferenceRoot,
  prefersDark: boolean,
): ResolvedColorMode {
  const resolvedMode = resolveColorMode(preferences.colorMode, prefersDark)
  const accent = accentOptions[preferences.accent]

  if (resolvedMode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  root.dataset.accent = preferences.accent
  root.style.setProperty('--accent', accent.cssVars.accent)
  root.style.setProperty('--accent-foreground', accent.cssVars.accentForeground)
  root.style.setProperty('--accent-soft', accent.cssVars.accentSoft)
  root.style.setProperty('--accent-border', accent.cssVars.accentBorder)
  root.style.setProperty('--ring', accent.cssVars.ring)

  return resolvedMode
}
