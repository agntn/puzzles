<script setup lang="ts">
defineProps<{
  title: string;
  to: string;
  link: string;
  checks: readonly string[];
  reverse?: boolean;
}>();
</script>

<template>
  <section class="puzzles-section">
    <div
      class="mx-auto grid w-full max-w-[var(--ui-container)] items-center gap-10 px-8 py-20 sm:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16"
    >
      <div :class="reverse ? 'lg:order-2' : ''">
        <h2 class="text-2xl font-medium tracking-tight text-highlighted sm:text-[1.75rem]">
          {{ title }}
        </h2>
        <p class="mt-4 max-w-md text-sm leading-6 text-muted">
          <slot />
        </p>
        <ul class="mt-6 max-w-md border-t border-muted">
          <li
            v-for="check in checks"
            :key="check"
            class="border-b border-muted py-2.5 text-sm leading-6 text-muted"
          >
            {{ check }}
          </li>
        </ul>
        <NuxtLink
          :to="to"
          class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {{ link }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="min-w-0" :class="reverse ? 'lg:order-1' : ''">
        <slot name="visual" />
      </div>
    </div>
  </section>
</template>
