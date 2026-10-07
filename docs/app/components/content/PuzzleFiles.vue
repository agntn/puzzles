<script setup lang="ts">
import type { VNode } from "vue";
import { readFileText, resolveFileLinks } from "../../utils/files";
import { linkText } from "../../utils/format";
import type { FileRow } from "../../utils/puzzle-view";

/** The puzzle's whole shelf: every file `puzzles_assets` would hand a model, one viewer for all. */
const props = defineProps<{
  files: readonly FileRow[];
  id: string;
  /** The page the record's own files were taken from. */
  source?: string | undefined;
}>();

const app = useAppConfig();
const open = ref(false);
const index = ref(0);
const current = computed(() => props.files[index.value]);

/** What the viewer has fetched for the open file: nothing yet, the text, or why there's none. */
const text = shallowRef<
  | { readonly state: "idle" | "loading" }
  | { readonly state: "ready"; readonly path: string; readonly text: string }
  | { readonly state: "failed"; readonly reason: string }
>({ state: "idle" });

/**
 * Opens the viewer on one file.
 *
 * @param {string} url - The file's site path, the one a stage artifact links to.
 */
function show(url: string) {
  const found = props.files.findIndex((file) => file.url === url);
  if (found === -1) return;
  index.value = found;
  open.value = true;
}

function step(by: number) {
  const total = props.files.length;
  index.value = (index.value + by + total) % total;
}

/**
 * Fetches the open file's text and keeps it only while that file is still the one on screen.
 *
 * @param {FileRow} file - The file to read.
 */
async function load(file: FileRow) {
  text.value = { state: "loading" };
  const read = await readFileText(file.url);
  if (current.value?.path !== file.path) return;
  if ("reason" in read) {
    text.value = { state: "failed", reason: read.reason };
    return;
  }
  const body =
    file.format === "markdown"
      ? resolveFileLinks(read.text, file.path, app.github.url ?? "")
      : read.text;
  text.value = { state: "ready", path: file.path, text: body };
}

watch(
  [open, current],
  ([isOpen, file]) => {
    if (isOpen && (file?.format === "markdown" || file?.format === "text")) void load(file);
  },
  { immediate: true },
);

/** The text file's lines for the numbered snippet, without the empty one after its last newline. */
const lines = computed(() =>
  text.value.state === "ready" ? text.value.text.replace(/\n$/u, "").split("\n") : [],
);

defineShortcuts({
  arrowleft: { usingInput: false, handler: () => open.value && step(-1) },
  arrowright: { usingInput: false, handler: () => open.value && step(1) },
});

/**
 * A file's name without the directories, for the tile.
 *
 * @param {string} path - The file's path.
 * @returns {string} The last segment.
 */
function baseName(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

/**
 * Bytes as a reader counts them: 910 B, 5.4 KB, 1.2 MB.
 *
 * @param {number | undefined} bytes - The pinned size, when the record has one.
 * @returns {string | undefined} The size, or nothing for an unpinned file.
 */
function size(bytes: number | undefined): string | undefined {
  if (bytes === undefined) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const ICONS = {
  image: "i-lucide-image",
  markdown: "i-lucide-file-text",
  text: "i-lucide-file-code",
  document: "i-lucide-file",
} as const;

/** A plain `<img>`, since IPX 404s on `/assets`; a post's own screenshot has its own column. */
const plainImage = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    return (): VNode | null =>
      attrs["src"] === current.value?.screenshot ? null : h("img", { ...attrs, loading: "lazy" });
  },
});

const { copied, copy } = useCopied();

defineExpose({ show });
</script>

<template>
  <div class="console-band">
    <p class="console-label console-rule-title">
      <span
        >Files <span aria-hidden="true">[ open any of {{ files.length }} ]</span></span
      >
      <span class="console-mark" aria-hidden="true" />
    </p>
    <ul class="puzzle-files">
      <li v-for="(file, position) in files" :key="file.path">
        <button
          type="button"
          :aria-label="`Open ${file.label}, ${file.path}`"
          @click="
            index = position;
            open = true;
          "
        >
          <img
            v-if="file.format === 'image' || file.screenshot"
            :src="file.screenshot ?? file.url"
            alt=""
            loading="lazy"
          />
          <span v-else class="puzzle-file-glyph" aria-hidden="true">
            <UIcon :name="ICONS[file.format]" class="size-6" />
            <span>{{ baseName(file.path).split(".").pop() }}</span>
          </span>
          <span class="puzzle-file-caption">
            <span class="console-tag">{{ file.label }}</span>
            <span class="puzzle-file-name">{{ baseName(file.path) }}</span>
            <span v-if="file.date ?? size(file.bytes)" class="puzzle-file-meta">{{
              file.date ?? size(file.bytes)
            }}</span>
          </span>
        </button>
      </li>
    </ul>
    <p v-if="source" class="console-lead puzzle-files-source">
      <span class="console-tag">From</span>
      <UTooltip :text="source">
        <a :href="source" target="_blank" rel="noopener">{{ linkText(source) }}</a>
      </UTooltip>
      <span class="console-leader" aria-hidden="true" />
    </p>

    <UModal
      v-model:open="open"
      :title="current ? `${current.label} · ${current.path}` : id"
      :description="`File ${index + 1} of ${files.length} for ${id}`"
      :transition="false"
      :ui="{ content: 'max-w-6xl' }"
    >
      <template #content="{ close }">
        <div v-if="current" class="file-viewer">
          <header class="console-bar file-bar">
            <span class="console-title file-title"
              ><span class="console-tag">{{ current.label }}</span
              ><span class="file-path">{{ current.path }}</span></span
            >
            <span class="file-steps">
              <UButton
                color="neutral"
                variant="chip"
                icon="i-lucide-chevron-left"
                aria-label="Previous file"
                :disabled="files.length < 2"
                @click="step(-1)"
              />
              <span class="console-file"
                >{{ String(index + 1).padStart(2, "0") }} / {{ files.length }}</span
              >
              <UButton
                color="neutral"
                variant="chip"
                icon="i-lucide-chevron-right"
                aria-label="Next file"
                :disabled="files.length < 2"
                @click="step(1)"
              />
              <UButton
                color="neutral"
                variant="chip"
                icon="i-lucide-x"
                aria-label="Close"
                @click="close"
              />
            </span>
          </header>
          <div class="console-ruler" aria-hidden="true" />

          <div
            class="file-stage"
            :class="{ 'file-stage-split': current.screenshot && current.format === 'markdown' }"
          >
            <div class="file-pane" tabindex="0" :aria-label="current.path">
              <figure v-if="current.format === 'image'" class="file-picture">
                <img :key="current.path" :src="current.url" :alt="`${current.label} for ${id}`" />
              </figure>
              <iframe
                v-else-if="current.format === 'document'"
                :key="current.path"
                class="file-document"
                :src="current.url"
                :title="current.path"
              />
              <p v-else-if="text.state === 'failed'" class="file-state">
                This one didn't come through ({{ text.reason }}). The raw link below still knows the
                way.
              </p>
              <p
                v-else-if="text.state !== 'ready' || text.path !== current.path"
                class="file-state"
              >
                <span class="console-cursor console-cursor-busy" aria-hidden="true" />
                Pulling {{ baseName(current.path) }} off the shelf
              </p>
              <article v-else-if="current.format === 'markdown'" class="file-reading">
                <LazyMDC :value="text.text">
                  <template #default="{ body, data }">
                    <MDCRenderer
                      v-if="body"
                      :body="body"
                      :data="data"
                      :components="{ img: plainImage, pre: 'pre' }"
                    />
                  </template>
                </LazyMDC>
              </article>
              <pre
                v-else
                class="console-snippet console-lines file-text"
              ><code><span v-for="(line, row) in lines" :key="row">{{ line }}</span></code></pre>
            </div>
            <figure v-if="current.screenshot && current.format === 'markdown'" class="file-capture">
              <figcaption class="console-label console-rule-title">
                <span>Screenshot <span aria-hidden="true">[ as captured ]</span></span>
                <span class="file-capture-actions">
                  <UButton
                    color="neutral"
                    variant="chip"
                    icon="i-lucide-external-link"
                    aria-label="Open the screenshot in a new tab"
                    :to="current.screenshot"
                    target="_blank"
                  />
                  <UButton
                    color="neutral"
                    variant="chip"
                    icon="i-lucide-download"
                    aria-label="Download the screenshot"
                    :to="current.screenshot"
                    :download="baseName(current.screenshot)"
                    external
                  />
                </span>
              </figcaption>
              <a
                :href="current.screenshot"
                target="_blank"
                rel="noopener"
                class="file-capture-link"
              >
                <img
                  :key="current.screenshot"
                  :src="current.screenshot"
                  :alt="`Screenshot of the ${current.label} for ${id}`"
                />
              </a>
            </figure>
          </div>

          <footer class="file-leads">
            <p class="console-lead">
              <span class="console-tag">Raw</span>
              <a :href="current.url" target="_blank" rel="noopener">{{ current.path }}</a>
              <span class="console-leader" aria-hidden="true" />
            </p>
            <p v-if="current.origin" class="console-lead">
              <span class="console-tag">Original</span>
              <UTooltip :text="current.origin">
                <a :href="current.origin" target="_blank" rel="noopener">{{
                  linkText(current.origin)
                }}</a>
              </UTooltip>
              <span class="console-leader" aria-hidden="true" />
            </p>
            <p v-if="current.archive" class="console-lead">
              <span class="console-tag">Archive</span>
              <UTooltip :text="current.archive">
                <a :href="current.archive" target="_blank" rel="noopener">{{
                  linkText(current.archive)
                }}</a>
              </UTooltip>
              <span class="console-leader" aria-hidden="true" />
            </p>
            <p class="file-actions">
              <span class="file-hint">← → flip through the shelf</span>
              <span class="file-buttons">
                <UButton
                  color="neutral"
                  variant="chip"
                  icon="i-lucide-external-link"
                  label="New tab"
                  :to="current.url"
                  target="_blank"
                />
                <UButton
                  color="neutral"
                  variant="chip"
                  icon="i-lucide-download"
                  label="Download"
                  :to="current.url"
                  :download="baseName(current.path)"
                  external
                />
                <UButton
                  v-if="text.state === 'ready' && current.format !== 'image'"
                  color="neutral"
                  variant="chip"
                  :icon="copied === 'file' ? 'i-lucide-check' : 'i-lucide-copy'"
                  :label="copied === 'file' ? 'Copied' : 'Copy text'"
                  @click="copy('file', text.text)"
                />
              </span>
            </p>
          </footer>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.puzzle-files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.puzzle-files button {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 0 1px var(--console-line);
  color: var(--ui-text-muted);
  text-align: left;
  cursor: zoom-in;
}
.puzzle-files button:hover {
  color: var(--console-accent);
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.puzzle-files button:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: -3px;
}
.puzzle-files img,
.puzzle-file-glyph {
  width: 100%;
  height: 8.5rem;
  padding: 1px;
  object-fit: contain;
  object-position: top;
  background: color-mix(in srgb, var(--ui-text-muted) 4%, var(--ui-bg));
}
.puzzle-file-glyph {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.puzzle-file-caption {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 8px 10px;
  font-size: 11px;
}
.puzzle-file-name {
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.puzzle-file-meta {
  font-family: var(--font-mono);
}
.puzzle-files-source {
  flex-wrap: nowrap;
  margin-top: 12px;
}
.puzzle-files-source > a {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* The instrument's own face, as in `.tool-console`: mono at panel size, the reading pane aside. */
.file-viewer {
  font-family: var(--font-mono);
  font-size: 12px;
  font-variant-ligatures: none;
  display: flex;
  flex-direction: column;
  height: min(86dvh, 54rem);
  min-height: 0;
}
.file-bar {
  flex: none;
}
.file-title {
  min-width: 0;
}
.file-path {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-steps {
  display: flex;
  flex: none;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.file-stage {
  display: grid;
  flex: 1;
  min-height: 0;
}
.file-stage-split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 26rem);
}
.file-pane,
.file-capture {
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 22px 24px;
}
.file-pane:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: -3px;
}
.file-capture {
  margin: 0;
  border-left: 1px solid var(--console-line);
}
.file-capture img,
.file-picture img {
  display: block;
  max-width: 100%;
  box-shadow: 0 0 0 1px var(--console-line);
  background: color-mix(in srgb, var(--ui-text-muted) 4%, var(--ui-bg));
}
.file-capture-link {
  display: block;
  cursor: zoom-in;
}
.file-capture-link:hover img {
  box-shadow: 0 0 0 1px var(--console-corner);
}
.file-picture {
  display: grid;
  place-items: center;
  min-height: 100%;
  margin: 0;
}
.file-document {
  width: 100%;
  height: 100%;
  border: 0;
}
.file-state {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ui-text-muted);
  font-family: var(--font-mono);
  font-size: 12px;
}
.file-text {
  margin: 0;
}
/* A file read like a dossier band: the reading face at panel size, section heads as rule titles. */
.file-reading {
  max-width: 46rem;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.7;
  color: var(--ui-text);
}
.file-reading :deep(h1) {
  margin: 0 0 14px;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ui-text-highlighted);
}
.file-reading :deep(h2),
.file-reading :deep(h3) {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 26px 0 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.12em;
  line-height: 1.4;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.file-reading :deep(h2)::after,
.file-reading :deep(h3)::after {
  content: "";
  flex: 1;
  height: 7px;
  background:
    radial-gradient(circle at 3px 3.5px, var(--console-corner) 0 1.5px, transparent 2px) no-repeat,
    linear-gradient(var(--console-line), var(--console-line)) 6px 3px / calc(100% - 6px) 1px
      no-repeat;
}
.file-reading :deep(:is(h2, h3) a) {
  color: inherit;
}
.file-reading :deep(p),
.file-reading :deep(ul),
.file-reading :deep(ol) {
  margin: 0 0 10px;
}
.file-reading :deep(:is(p, li)) {
  line-height: inherit;
}
.file-reading :deep(li) {
  margin: 0 0 4px;
}
.file-reading :deep(a) {
  overflow-wrap: anywhere;
  color: var(--console-accent);
  text-decoration: none;
}
.file-reading :deep(a:hover) {
  text-decoration: underline;
}
.file-reading :deep(blockquote) {
  margin: 0 0 12px;
  padding: 10px 14px;
  border: 0;
  box-shadow: inset 2px 0 0 var(--console-accent);
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
  font-style: normal;
  color: var(--ui-text-highlighted);
}
.file-reading :deep(blockquote p:last-child) {
  margin-bottom: 0;
}
.file-reading :deep(pre) {
  margin: 0 0 12px;
  padding: 10px 14px;
  outline: 1px dashed var(--console-line);
  outline-offset: -1px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.file-reading :deep(img) {
  display: block;
  max-width: min(100%, 32rem);
  margin: 12px 0;
  box-shadow: 0 0 0 1px var(--console-line);
}
.file-leads {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  flex: none;
  gap: 6px;
  padding: 12px 24px 14px;
  border-top: 1px solid var(--console-line);
  background: color-mix(in srgb, var(--ui-text-muted) 3%, var(--ui-bg));
}
.file-leads .console-lead {
  flex-wrap: nowrap;
  margin: 0;
}
.file-leads .console-lead a {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 4px 0 0;
}
.file-buttons,
.file-capture-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.file-capture-actions {
  order: 3;
}
.file-hint {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-dimmed);
}
@media (width < 900px) {
  .file-stage {
    display: block;
    overflow: auto;
    overscroll-behavior: contain;
  }
  .file-stage-split {
    grid-template-columns: minmax(0, 1fr);
  }
  .file-pane,
  .file-capture {
    overflow: visible;
  }
  .file-capture {
    border-top: 1px solid var(--console-line);
    border-left: 0;
  }
}
@media (width < 640px) {
  .file-pane,
  .file-capture {
    padding: 16px;
  }
  .file-leads {
    padding: 10px 16px 12px;
  }
  .file-buttons,
  .file-capture-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .file-capture-actions {
    order: 3;
  }
  .file-hint {
    display: none;
  }
}
</style>
