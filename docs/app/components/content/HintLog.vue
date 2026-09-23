<script setup lang="ts">
import type { Hint } from "@agntn/puzzles";
import { host, linkText } from "../../utils/format";

/** A hint as recorded, plus whether the puzzle inherits it from its collection. */
export interface HintEntry extends Hint {
  readonly shared?: boolean;
}

/**
 * The hint log of a dossier: date on the left, the kind and text, then the source and the
 * confirmation as leads. The collection dossier and the puzzle dossier both print hints this way.
 */
defineProps<{ hints: readonly HintEntry[] }>();
</script>

<template>
  <ol class="hint-log">
    <li v-for="(hint, index) in hints" :key="index" class="hint-log-entry">
      <span class="hint-log-date"
        ><span>{{ hint.date?.slice(0, 10) ?? "undated" }}</span
        ><span v-if="hint.date && hint.date.length > 10">{{ hint.date.slice(11) }}</span></span
      >
      <div class="hint-log-body">
        <p>
          <span class="console-tag">{{ hint.kind }}</span
          ><span v-if="hint.shared" class="console-tag">collection</span>{{ hint.text }}
        </p>
        <p class="console-lead">
          <span class="console-tag">Source</span>
          <UTooltip :text="hint.source">
            <a :href="hint.source" target="_blank" rel="noopener">{{ linkText(hint.source) }}</a>
          </UTooltip>
          <span class="console-leader" aria-hidden="true" />
        </p>
        <p v-if="hint.confirmation" class="console-lead">
          <span class="console-tag">Confirm</span>
          <UTooltip :text="hint.confirmation.url">
            <a :href="hint.confirmation.url" target="_blank" rel="noopener"
              >{{ hint.confirmation.description ?? linkText(hint.confirmation.url)
              }}<span v-if="hint.confirmation.description" class="hint-log-host">
                {{ host(hint.confirmation.url) }}</span
              ></a
            >
          </UTooltip>
          <span class="console-leader" aria-hidden="true" />
        </p>
        <details v-if="hint.answer" class="hint-log-answer">
          <summary>Published answer</summary>
          <p>{{ hint.answer.text }}</p>
          <p class="console-lead">
            <span class="console-tag">{{ hint.answer.date?.slice(0, 10) ?? "Source" }}</span>
            <UTooltip :text="hint.answer.source">
              <a :href="hint.answer.source" target="_blank" rel="noopener">{{
                linkText(hint.answer.source)
              }}</a>
            </UTooltip>
            <span class="console-leader" aria-hidden="true" />
          </p>
        </details>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.hint-log {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hint-log-entry {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: 16px;
}
.hint-log-date {
  display: grid;
  align-content: start;
  padding-top: 3px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
}
.hint-log-date > span:first-child {
  color: var(--ui-text-muted);
}
.hint-log-entry:hover .hint-log-date > span:first-child {
  color: var(--console-accent);
}
.hint-log-body {
  min-width: 0;
}
.hint-log-body > p:first-child {
  margin: 0 0 6px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ui-text-highlighted);
}
.hint-log-body > p:first-child > .console-tag {
  font-family: var(--font-mono);
  vertical-align: 1px;
}
.hint-log-entry .console-lead {
  flex-wrap: nowrap;
  gap: 0 10px;
  margin-top: 4px;
}
.hint-log-entry .console-lead > a {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: normal;
  color: var(--ui-text-muted);
}
.hint-log-entry .console-lead > a:hover {
  color: var(--console-accent);
}
.hint-log-host {
  margin-left: 8px;
  color: var(--ui-text-dimmed);
}
.hint-log-answer {
  margin-top: 8px;
}
.hint-log-answer summary {
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.hint-log-answer > p:first-of-type {
  margin: 6px 0 0;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ui-text-highlighted);
}
@media (width < 640px) {
  .hint-log-entry {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
  .hint-log-date {
    display: flex;
    gap: 8px;
  }
  .hint-log-entry .console-lead > .console-tag {
    min-width: 4.5rem;
  }
  .hint-log-entry .console-leader {
    display: none;
  }
}
</style>
