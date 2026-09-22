<script setup lang="ts">
import { tokenizeToolResponse } from "../../utils/tool-response";

/**
 * The `03 Full tool response` row of an instrument and the dialog it opens. The dialog reads the
 * title and text captured when it opened, so a record change under it never swaps the response.
 */
const props = defineProps<{ title: string; text: string }>();

const captured = shallowRef({ title: props.title, text: props.text });
const tokens = computed(() => tokenizeToolResponse(captured.value.text));
const { copied, copy } = useCopied();

function capture(open: boolean) {
  if (open) captured.value = { title: props.title, text: props.text };
}
</script>

<template>
  <UModal
    :title="captured.title"
    description="The complete text the tool returned."
    :transition="false"
    :ui="{
      content: 'max-w-5xl rounded-sm shadow-none',
      header: 'min-h-0 py-4 pr-14',
      title: 'font-mono text-sm font-normal break-all',
      body: 'p-0 sm:p-0 min-h-0 overflow-hidden flex flex-col',
    }"
    @update:open="capture"
  >
    <button type="button" class="console-output">
      <span><span class="console-index">03</span> Full tool response</span>
      <UIcon name="i-lucide-expand" class="size-3.5" aria-hidden="true" />
    </button>
    <template #body>
      <div class="response-toolbar">
        <span>content[0].text</span>
        <UButton
          color="neutral"
          variant="ghost"
          :icon="copied === 'response' ? 'i-lucide-check' : 'i-lucide-copy'"
          @click="copy('response', captured.text)"
          >{{ copied === "response" ? "Copied" : "Copy response" }}</UButton
        >
      </div>
      <pre
        class="response-text"
        tabindex="0"
        aria-label="Full tool response"
      ><code><span v-for="(token, index) in tokens" :key="index" :class="`response-${token.kind}`">{{ token.text }}</span></code></pre>
    </template>
  </UModal>
</template>

<style scoped>
.console-output {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  padding: 10px 20px;
  border-block: 1px solid var(--console-line);
  cursor: pointer;
  color: var(--ui-text-muted);
  text-align: left;
}
.console-output:hover {
  color: var(--ui-text-highlighted);
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
}
.console-output:focus-visible,
.response-text:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: -3px;
}
.response-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: none;
  padding: 8px 20px;
  border-bottom: 1px solid var(--ui-border-muted);
  color: var(--ui-text-muted);
  font-family: var(--font-mono);
  font-size: 12px;
}
.response-text {
  height: min(60dvh, 36rem);
  min-height: 0;
  margin: 0;
  padding: 20px;
  overflow: auto;
  overscroll-behavior: contain;
  white-space: pre;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.85;
  tab-size: 2;
  color: var(--ui-text-highlighted);
  background: var(--ui-bg);
}
.response-label {
  color: var(--ui-text-muted);
}
.response-url {
  color: var(--ui-primary);
}
.response-date {
  color: var(--ui-text-muted);
}
.response-hash {
  color: var(--ui-text-highlighted);
}
.response-status,
.response-number {
  color: var(--ui-primary);
}
</style>
