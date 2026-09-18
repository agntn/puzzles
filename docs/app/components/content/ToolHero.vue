<script setup lang="ts">
defineProps<{ title: string; accent: string; description?: string }>();
</script>

<template>
  <header
    class="puzzles-hero mx-auto w-full max-w-[var(--ui-container)] px-8 pt-16 pb-10 text-center sm:px-12 lg:px-16"
  >
    <h1
      class="mx-auto max-w-3xl text-3xl leading-[1.1] font-medium tracking-tight text-highlighted sm:text-4xl lg:text-[3rem]"
    >
      {{ title }} <span class="text-primary">{{ accent }}</span>
    </h1>
    <p v-if="description" class="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">
      {{ description }}
    </p>
    <slot />
  </header>
</template>
