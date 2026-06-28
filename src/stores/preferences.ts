import { computed, ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { defineStore } from 'pinia'
import {
  DEFAULT_PREFERENCES,
  type AccentKey,
  type AppLocale,
  type AppPreferences,
  type ColorMode,
  applyDocumentPreferences,
  normalizePreferences,
  resolveColorMode,
} from '@/lib/preferences'

const STORAGE_KEY = 'signlang-eyes:preferences'

function hasBrowserApis() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function readStoredPreferences(): AppPreferences {
  if (!hasBrowserApis()) return { ...DEFAULT_PREFERENCES }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return normalizePreferences(raw ? JSON.parse(raw) : null)
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

function writeStoredPreferences(preferences: AppPreferences) {
  if (!hasBrowserApis()) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Storage can be disabled in private contexts; visual preferences still apply.
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const initial = readStoredPreferences()
  const locale = ref<AppLocale>(initial.locale)
  const colorMode = ref<ColorMode>(initial.colorMode)
  const accent = ref<AccentKey>(initial.accent)
  const prefersDark = usePreferredDark()

  const preferences = computed<AppPreferences>(() => ({
    locale: locale.value,
    colorMode: colorMode.value,
    accent: accent.value,
  }))

  const resolvedColorMode = computed(() =>
    resolveColorMode(colorMode.value, prefersDark.value),
  )

  function apply() {
    const next = preferences.value
    writeStoredPreferences(next)

    if (!hasBrowserApis()) return

    const root = document.documentElement
    const resolved = applyDocumentPreferences(next, root, prefersDark.value)
    root.lang = next.locale
    root.dataset.colorMode = resolved
  }

  function setLocale(value: AppLocale) {
    locale.value = value
  }

  function setColorMode(value: ColorMode) {
    colorMode.value = value
  }

  function setAccent(value: AccentKey) {
    accent.value = value
  }

  watch([locale, colorMode, accent, prefersDark], apply, { immediate: true })

  return {
    locale,
    colorMode,
    accent,
    preferences,
    resolvedColorMode,
    setLocale,
    setColorMode,
    setAccent,
  }
})
