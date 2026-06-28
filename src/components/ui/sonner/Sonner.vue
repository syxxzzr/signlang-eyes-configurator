<script setup lang="ts">
import type { ToasterProps } from 'vue-sonner'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'top-right',
  closeButtonPosition: 'top-right',
  closeButton: true,
  richColors: true,
  visibleToasts: 4,
})
</script>

<template>
  <Toaster
    v-bind="props"
    :toast-options="{
      class: 'border-border bg-card text-card-foreground shadow-lg',
      descriptionClass: 'text-muted-foreground',
      ...props.toastOptions,
    }"
  />
</template>
