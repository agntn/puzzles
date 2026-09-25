<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <PuzzlesCallout kind="warning" :title="title"><slot mdc-unwrap="p" /></PuzzlesCallout>
</template>
