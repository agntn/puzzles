<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <PuzzlesCallout kind="tip" :title="title"><slot mdc-unwrap="p" /></PuzzlesCallout>
</template>
