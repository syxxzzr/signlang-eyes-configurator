<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ActivityIcon,
  BluetoothIcon,
  ChevronsUpDownIcon,
  CircleAlertIcon,
  DatabaseIcon,
  HandIcon,
  LanguagesIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  PauseIcon,
  PlayIcon,
  PowerIcon,
  RadioIcon,
  RefreshCwIcon,
  SquareIcon,
  SunIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from '@lucide/vue'
import { useSignlangDevice } from '@/composables/useSignlangDevice'
import { usePreferencesStore } from '@/stores/preferences'
import HandposeCanvas from '@/components/HandposeCanvas.vue'
import type { GestureInfo } from '@/ble/protocol'
import {
  accentOptionKeys,
  accentOptions,
  type AccentKey,
  type AppLocale,
  type ColorMode,
} from '@/lib/preferences'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const dev = useSignlangDevice()
const preferences = usePreferencesStore()
const { t, locale } = useI18n()

const gestureName = ref('')
const replaceExisting = ref(false)
const languageOpen = ref(false)

watch(
  () => preferences.locale,
  (next) => {
    locale.value = next
  },
  { immediate: true },
)

watch(
  () => [t('app.title'), preferences.locale],
  ([title]) => {
    document.title = title ?? 'signlang-eyes-configurator'
  },
  { immediate: true },
)

const localeChoices: Array<{ value: AppLocale; label: string }> = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
]

const currentLocaleLabel = computed(
  () =>
    localeChoices.find((choice) => choice.value === preferences.locale)?.label ??
    preferences.locale,
)

const colorModeChoices: Array<{
  value: ColorMode
  labelKey: string
  icon: Component
}> = [
  { value: 'system', labelKey: 'theme.system', icon: MonitorIcon },
  { value: 'light', labelKey: 'theme.light', icon: SunIcon },
  { value: 'dark', labelKey: 'theme.dark', icon: MoonIcon },
]

const statusText = computed(() => {
  switch (dev.state.value) {
    case 'connected':
      return t('status.connectedTo', { name: dev.deviceName.value || 'SignLang Eyes' })
    case 'connecting':
      return t('common.connecting')
    default:
      return t('common.disconnected')
  }
})

const streamText = computed(() =>
  dev.streaming.value ? t('controls.streamStop') : t('controls.streamStart'),
)

const uploadPercent = computed(() => Math.round(dev.uploadProgress.value * 100))
const themeSignal = computed(
  () => `${preferences.accent}-${preferences.resolvedColorMode}-${preferences.locale}`,
)

function fmtBig(v: bigint | undefined) {
  return v === undefined ? '-' : v.toString()
}

function onLocaleChange(value: unknown) {
  if (typeof value === 'string') {
    preferences.setLocale(value as AppLocale)
    languageOpen.value = false
  }
}

function onColorModeChange(value: ColorMode) {
  preferences.setColorMode(value)
}

function onAccentChange(value: AccentKey) {
  preferences.setAccent(value)
}

async function onUpload() {
  await dev.uploadGesture(gestureName.value, replaceExisting.value)
}

function onDelete(g: GestureInfo) {
  if (window.confirm(t('library.confirmDelete', { name: g.name, id: g.id }))) {
    dev.deleteGesture(g)
  }
}
</script>

<template>
  <TooltipProvider>
    <Toaster :theme="preferences.resolvedColorMode" />
    <main
      class="min-h-screen bg-background px-4 py-4 text-foreground sm:px-6 lg:px-8"
    >
      <div class="mx-auto flex max-w-360 flex-col gap-4">
        <header
          class="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div class="flex min-w-0 items-start gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent-border bg-accent-soft text-accent"
            >
              <HandIcon class="size-5" />
            </div>
            <div class="min-w-0">
              <h1 class="text-2xl font-semibold leading-tight sm:text-3xl">
                {{ t('app.title') }}
              </h1>
              <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
                {{ t('app.subtitle') }}
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  class="gap-1.5 bg-card text-card-foreground"
                >
                  <span
                    class="size-2 rounded-full"
                    :class="{
                      'bg-accent': dev.state.value === 'connected',
                      'bg-chart-5': dev.state.value === 'connecting',
                      'bg-muted-foreground': dev.state.value === 'disconnected',
                    }"
                  />
                  {{ statusText }}
                </Badge>
                <Badge variant="secondary" class="gap-1.5">
                  <RadioIcon class="size-3" />
                  {{ t('live.fps', { fps: dev.fps.value }) }}
                </Badge>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <div class="flex flex-wrap items-center gap-2">
              <Popover v-model:open="languageOpen">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    role="combobox"
                    class="w-38 justify-between"
                    :aria-expanded="languageOpen"
                    :title="t('controls.language')"
                  >
                    <span class="flex min-w-0 items-center gap-2">
                      <LanguagesIcon class="size-4 shrink-0 text-muted-foreground" />
                      <span class="truncate">{{ currentLocaleLabel }}</span>
                    </span>
                    <ChevronsUpDownIcon class="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-38 p-1" align="end">
                  <Command
                    :model-value="preferences.locale"
                    @update:model-value="onLocaleChange"
                  >
                    <CommandList>
                      <CommandEmpty>{{ t('controls.languageEmpty') }}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          v-for="choice in localeChoices"
                          :key="choice.value"
                          :value="choice.value"
                          @select="onLocaleChange(choice.value)"
                        >
                          {{ choice.label }}
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div
                class="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                :aria-label="t('controls.theme')"
              >
                <Tooltip
                  v-for="choice in colorModeChoices"
                  :key="choice.value"
                >
                  <TooltipTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      :title="t(choice.labelKey)"
                      :class="[
                        preferences.colorMode === choice.value
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-muted-foreground',
                      ]"
                      @click="onColorModeChange(choice.value)"
                    >
                      <component :is="choice.icon" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t(choice.labelKey) }}</TooltipContent>
                </Tooltip>
              </div>

              <div
                class="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                :aria-label="t('controls.accent')"
              >
                <PaletteIcon class="mx-1 size-4 text-muted-foreground" />
                <Tooltip
                  v-for="accent in accentOptionKeys"
                  :key="accent"
                >
                  <TooltipTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      :title="t(`accent.${accent}`)"
                      :class="[
                        preferences.accent === accent
                          ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                          : '',
                      ]"
                      @click="onAccentChange(accent)"
                    >
                      <span
                        class="size-4 rounded-full border border-border"
                        :style="{ background: accentOptions[accent].cssVars.accent }"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t(`accent.${accent}`) }}</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button
                v-if="dev.state.value !== 'connected'"
                :disabled="!dev.supported || dev.state.value === 'connecting'"
                class="bg-accent text-accent-foreground hover:bg-accent/90"
                @click="dev.connect"
              >
                <Spinner v-if="dev.state.value === 'connecting'" />
                <BluetoothIcon v-else />
                {{ t('controls.connect') }}
              </Button>
              <template v-else>
                <Button variant="outline" @click="dev.disconnect">
                  <PowerIcon />
                  {{ t('controls.disconnect') }}
                </Button>
                <Button
                  :class="
                    dev.streaming.value
                      ? ''
                      : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  "
                  :variant="dev.streaming.value ? 'secondary' : 'default'"
                  @click="dev.setStreaming(!dev.streaming.value)"
                >
                  <PauseIcon v-if="dev.streaming.value" />
                  <PlayIcon v-else />
                  {{ streamText }}
                </Button>
                <Button variant="outline" @click="dev.refreshGestures">
                  <RefreshCwIcon />
                  {{ t('controls.refresh') }}
                </Button>
              </template>
            </div>
          </div>
        </header>

        <div
          v-if="!dev.supported"
          class="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <CircleAlertIcon class="mt-0.5 size-4 shrink-0" />
          <span>{{ t('status.browserUnsupported') }}</span>
        </div>

        <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Card class="overflow-hidden">
            <CardHeader class="border-b border-border pb-4">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle class="flex items-center gap-2">
                    <ActivityIcon class="size-4 text-accent" />
                    {{ t('live.title') }}
                  </CardTitle>
                  <CardDescription>
                    {{ t('live.detectedHands') }} {{ dev.handCount.value }}
                  </CardDescription>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Badge variant="secondary" class="gap-1">
                    <HandIcon class="size-3" />
                    {{ dev.handCount.value }}
                  </Badge>
                  <Badge variant="secondary">
                    {{ t('live.fps', { fps: dev.fps.value }) }}
                  </Badge>
                  <Badge
                    :variant="dev.streaming.value ? 'default' : 'outline'"
                    :class="
                      dev.streaming.value
                        ? 'bg-accent text-accent-foreground'
                        : ''
                    "
                  >
                    {{ t('live.stream') }}
                    {{ dev.streaming.value ? t('common.on') : t('common.off') }}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent class="p-3 sm:p-4">
              <HandposeCanvas
                :frame="dev.frame.value"
                :recognition="dev.recognition.value"
                :hide-recognition="dev.recordingSessionActive.value"
                :countdown-seconds="dev.recordingCountdownSeconds.value"
                :countdown-progress="dev.recordingCountdownProgress.value"
                :empty-label="t('live.noHand')"
                :left-label="t('live.leftHand')"
                :right-label="t('live.rightHand')"
                :theme-key="themeSignal"
              />

              <div
                v-if="dev.frame.value"
                class="mt-3 grid gap-2 sm:grid-cols-2"
              >
                <div
                  v-for="(d, i) in dev.frame.value.detections"
                  :key="i"
                  class="flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  :class="
                    d.present
                      ? 'border-border bg-background/70'
                      : 'border-dashed bg-muted/40 text-muted-foreground'
                  "
                >
                  <template v-if="d.present">
                    <Badge
                      variant="outline"
                      class="border-accent-border text-accent"
                    >
                      {{ d.isLeftHand ? t('live.leftHand') : t('live.rightHand') }}
                    </Badge>
                    <span class="truncate">
                      {{ t('live.confidence', { value: (d.confidence * 100).toFixed(0) }) }}
                    </span>
                    <span class="ml-auto text-muted-foreground">
                      {{ t('live.classId', { id: d.classId }) }}
                    </span>
                  </template>
                  <template v-else>
                    <span>{{ t('live.slotEmpty', { index: i }) }}</span>
                  </template>
                </div>
              </div>
            </CardContent>
          </Card>

          <aside class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <BluetoothIcon class="size-4 text-accent" />
                  {{ t('common.connected') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl
                  v-if="dev.status.value"
                  class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm"
                >
                  <dt class="text-muted-foreground">
                    {{ t('status.protocolVersion') }}
                  </dt>
                  <dd class="text-right">{{ dev.status.value.protocolVersion }}</dd>
                  <dt class="text-muted-foreground">
                    {{ t('status.encoderSequenceLen') }}
                  </dt>
                  <dd class="text-right">{{ dev.status.value.encoderSequenceLen }}</dd>
                  <dt class="text-muted-foreground">
                    {{ t('status.embeddingDim') }}
                  </dt>
                  <dd class="text-right">{{ dev.status.value.embeddingDim }}</dd>
                  <dt class="text-muted-foreground">{{ t('status.streamFps') }}</dt>
                  <dd class="text-right">{{ dev.status.value.streamFps }}</dd>
                  <dt class="text-muted-foreground">
                    {{ t('status.streamingEnabled') }}
                  </dt>
                  <dd class="text-right">
                    {{ dev.status.value.streamingEnabled ? t('common.on') : t('common.off') }}
                  </dd>
                </dl>
                <p v-else class="text-sm text-muted-foreground">
                  {{ t('common.empty') }}
                </p>

                <template v-if="dev.frame.value">
                  <Separator class="my-4" />
                  <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt class="text-muted-foreground">{{ t('status.sequence') }}</dt>
                    <dd class="text-right">
                      {{ fmtBig(dev.frame.value.sequenceNumber) }}
                    </dd>
                    <dt class="text-muted-foreground">{{ t('status.imageSize') }}</dt>
                    <dd class="text-right">
                      {{ dev.frame.value.imageWidth }}x{{ dev.frame.value.imageHeight }}
                    </dd>
                  </dl>
                </template>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <SquareIcon class="size-4 text-accent" />
                  {{ t('recording.title') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  v-if="dev.state.value !== 'connected'"
                  class="text-sm text-muted-foreground"
                >
                  {{ t('recording.unavailable') }}
                </p>
                <template v-else>
                  <div class="grid gap-2">
                    <Label for="gesture-name">
                      {{ t('recording.nameLabel') }}
                    </Label>
                    <Input
                      id="gesture-name"
                      v-model="gestureName"
                      :placeholder="t('recording.namePlaceholder')"
                      :disabled="dev.uploading.value"
                    />
                  </div>

                  <div class="mt-4 flex items-center justify-between gap-3">
                    <Label
                      for="replace-existing"
                      class="text-sm text-muted-foreground"
                    >
                      {{ t('recording.replaceExisting') }}
                    </Label>
                    <input
                      id="replace-existing"
                      v-model="replaceExisting"
                      type="checkbox"
                      class="size-4 shrink-0 rounded border border-border accent-accent disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="dev.uploading.value"
                    >
                  </div>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <Button
                      v-if="!dev.recordingSessionActive.value"
                      class="bg-accent text-accent-foreground hover:bg-accent/90"
                      :disabled="dev.uploading.value"
                      @click="dev.startRecording"
                    >
                      <Spinner v-if="dev.uploading.value" />
                      <RadioIcon v-else />
                      {{ t('controls.recordingStart') }}
                    </Button>
                    <Button
                      v-else-if="dev.recordingPreparing.value"
                      variant="destructive"
                      @click="dev.cancelRecording"
                    >
                      <XIcon />
                      {{ t('controls.recordingCancel') }}
                    </Button>
                    <Button
                      v-else
                      variant="destructive"
                      @click="dev.stopRecording"
                    >
                      <SquareIcon />
                      {{ t('controls.recordingStop') }}
                    </Button>
                    <Button
                      variant="outline"
                      :disabled="
                        dev.recordedCount.value === 0 || dev.uploading.value
                      "
                      @click="dev.clearRecording"
                    >
                      {{ t('controls.clear') }}
                    </Button>
                  </div>

                  <p class="mt-3 text-sm text-muted-foreground">
                    {{ t('recording.recordedHandFrames', { count: dev.recordedHandFrames.value }) }}
                  </p>

                  <Button
                    class="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    :disabled="
                      dev.recordedCount.value === 0 ||
                      !gestureName.trim() ||
                      dev.uploading.value
                    "
                    @click="onUpload"
                  >
                    <Spinner v-if="dev.uploading.value" />
                    <UploadIcon v-else />
                    {{ dev.uploading.value ? t('controls.uploading') : t('controls.upload') }}
                  </Button>

                  <Progress
                    v-if="dev.uploading.value"
                    :model-value="uploadPercent"
                    class="mt-3 h-2 **:data-[slot=progress-indicator]:bg-accent"
                  />

                </template>
              </CardContent>
            </Card>

            <Card class="flex max-h-130 min-h-65 flex-col md:col-span-2 xl:col-span-1 xl:max-h-[48vh]">
              <CardHeader class="shrink-0">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle class="flex items-center gap-2">
                      <DatabaseIcon class="size-4 text-accent" />
                      {{ t('library.title') }}
                    </CardTitle>
                    <CardDescription>
                      {{ t('library.count', { count: dev.gestures.value.length }) }}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{{ dev.gestures.value.length }}</Badge>
                </div>
              </CardHeader>
              <CardContent class="min-h-0 flex-1 overflow-y-auto pr-3">
                <ul
                  v-if="dev.gestures.value.length"
                  class="flex flex-col gap-2"
                >
                  <li
                    v-for="g in dev.gestures.value"
                    :key="g.id"
                    class="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium">{{ g.name }}</p>
                      <p class="text-xs text-muted-foreground">
                        #{{ g.id }} · {{ t('library.sampleCount', { count: g.sampleCount }) }}
                      </p>
                    </div>
                    <Badge :variant="g.enabled ? 'secondary' : 'outline'">
                      {{ g.enabled ? t('common.enabled') : t('common.disabled') }}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          :title="t('library.delete')"
                          class="text-muted-foreground hover:text-destructive"
                          @click="onDelete(g)"
                        >
                          <Trash2Icon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{{ t('library.delete') }}</TooltipContent>
                    </Tooltip>
                  </li>
                </ul>
                <p v-else class="text-sm text-muted-foreground">
                  {{
                    dev.state.value === 'connected'
                      ? t('library.empty')
                      : t('recording.unavailable')
                  }}
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>

        <footer
          class="flex flex-wrap items-center justify-center gap-2 border-t border-border pt-4"
        >
          <a
            href="https://github.com/syxxzzr/signlang-eyes-configurator"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <img
              src="https://img.shields.io/badge/GitHub-signlang--eyes--configurator-181717?logo=github&logoColor=white"
              alt="GitHub repository"
              class="h-5"
            >
          </a>
          <a
            href="https://github.com/syxxzzr/signlang-eyes-configurator/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            aria-label="Apache 2.0 license"
          >
            <img
              src="https://img.shields.io/badge/license-Apache--2.0-0f766e"
              alt="Apache 2.0 license"
              class="h-5"
            >
          </a>
        </footer>
      </div>
    </main>
  </TooltipProvider>
</template>
