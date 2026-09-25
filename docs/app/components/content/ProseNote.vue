<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <PuzzlesCallout kind="note" :title="title"><slot mdc-unwrap="p" /></PuzzlesCallout>
</template>
