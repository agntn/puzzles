<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <PuzzlesCallout kind="caution" :title="title"><slot mdc-unwrap="p" /></PuzzlesCallout>
</template>
