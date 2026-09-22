<script setup lang="ts">
definePageMeta({ layout: "default" });

const title = "Playground";
const description =
  "Show one puzzle, list a collection, verify a published key, or read the statistics. In the browser, same library the CLI and the agent tools run.";
/** The OG pipeline drops commas from its props, so the card gets a version written without them. */
const cardDescription =
  "Show one puzzle. List a collection. Verify a published key. Read the statistics. In the browser with the library itself.";

useSeo({
  title,
  description,
  type: "article",
  breadcrumbs: [{ title: "Playground", path: "/playground" }],
});

defineOgImage(
  "Docs",
  { headline: "Playground", title, description: cardDescription },
  {
    alt: "The @agntn/puzzles playground: show, list, verify, collections, authors and stats in the browser",
  },
);
</script>

<template>
  <div class="puzzles-landing not-prose">
    <ToolHero
      title="Any puzzle, any collection."
      accent="Right here, in the page."
      description="The page imports @agntn/puzzles and runs it in your browser. Balances go through the worker to the chain's explorer. Every state is a link you can send to someone."
    >
      <p
        class="mx-auto mt-5 inline-flex max-w-xl items-start gap-2 text-left text-sm leading-6 text-dimmed"
      >
        <UIcon name="i-lucide-shield-alert" class="mt-1 size-4 shrink-0 text-primary" />
        <span
          >Verified means a published key derives the stored address. It doesn't mean the address
          still holds anything. The balance line is what the explorer said, five minutes ago at
          most.</span
        >
      </p>
    </ToolHero>

    <section class="puzzles-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-12 sm:px-12 lg:px-16">
        <PuzzlesPlayground />
      </div>
    </section>
  </div>
</template>
