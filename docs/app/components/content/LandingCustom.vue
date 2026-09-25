<script setup lang="ts">
import { tokens } from "../../utils/tokens";

const { copied, copy } = useCopied();

interface File {
  readonly name: string;
  readonly lines: readonly string[];
}

const collection: File = {
  name: "mine.ts",
  lines: [
    'import { NamedCollection, party } from "@agntn/puzzles";',
    'import { minePuzzleFirst } from "./mine/first";',
    "",
    "export class MineCollection extends NamedCollection {",
    '  static readonly key = "mine";',
    "  constructor() {",
    '    super(MineCollection.key, party("you"), [minePuzzleFirst]);',
    "  }",
    "}",
    "",
    "export const mine = new MineCollection();",
  ],
};

const loader: File = {
  name: "main.ts",
  lines: [
    'import { registerCollection } from "@agntn/puzzles";',
    "",
    "registerCollection({",
    '  key: "mine",',
    '  load: () => import("./mine").then((m) => m.mine),',
    "});",
  ],
};
</script>

<template>
  <div class="tool-console landing-custom">
    <header class="console-bar">
      <span class="console-title"><span class="console-tag">File</span>{{ collection.name }}</span>
      <button
        type="button"
        class="console-button"
        :aria-label="copied === collection.name ? 'Copied' : `Copy ${collection.name}`"
        :data-copied="copied === collection.name"
        @click="copy(collection.name, collection.lines.join('\n'))"
      >
        <UIcon
          :name="copied === collection.name ? 'i-lucide-check' : 'i-lucide-copy'"
          class="size-3"
          aria-hidden="true"
        />
        {{ copied === collection.name ? "copied" : "copy" }}
      </button>
    </header>

    <div class="custom-body">
      <pre
        class="console-snippet console-lines"
      ><code><span v-for="(line, index) in collection.lines" :key="index"><span v-for="(token, part) in tokens(line)" :key="part" :class="token.cls">{{ token.text }}</span></span></code></pre>
      <p class="console-label console-rule-title">
        <span
          ><span class="custom-file">{{ loader.name }}</span
          >{{ " "
          }}<span class="custom-role" aria-hidden="true">[ loads on first get() ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
        <button
          type="button"
          class="console-button"
          :aria-label="copied === loader.name ? 'Copied' : `Copy ${loader.name}`"
          :data-copied="copied === loader.name"
          @click="copy(loader.name, loader.lines.join('\n'))"
        >
          <UIcon
            :name="copied === loader.name ? 'i-lucide-check' : 'i-lucide-copy'"
            class="size-3"
            aria-hidden="true"
          />
          {{ copied === loader.name ? "copied" : "copy" }}
        </button>
      </p>
      <pre
        class="console-snippet console-lines"
      ><code><span v-for="(line, index) in loader.lines" :key="index"><span v-for="(token, part) in tokens(line)" :key="part" :class="token.cls">{{ token.text }}</span></span></code></pre>
    </div>
  </div>
</template>

<style scoped>
.custom-body {
  padding: 14px 20px 16px;
}
.custom-body > .console-rule-title {
  margin-bottom: 10px;
}
/* Wrap between words only, so a string such as "./mine" never splits at its slash. */
.custom-body > .console-lines {
  overflow-wrap: break-word;
}
.custom-file {
  text-transform: none;
  color: var(--ui-text-highlighted);
}
@media (width < 640px) {
  .custom-body > .console-rule-title > .console-mark {
    display: none;
  }
}
@media (width < 400px) {
  .custom-body {
    padding-inline: 14px;
  }
  .custom-role {
    display: none;
  }
}
</style>
