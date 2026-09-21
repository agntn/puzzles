<script lang="ts" setup>
/** Overrides the Docus landing template. Takumi has no CSS variables, so tokens are literals. */
defineProps<{ title?: string; description?: string }>();

import { STATS_STATIC } from "../../utils/landing";
import { COLLECTIONS as ALL } from "../../utils/puzzles";

const TAGLINE = `Public crypto bounties and puzzles as typed records: ${STATS_STATIC.total} puzzles in ${ALL.length} collections, with addresses, key material, prizes and outcomes. Library, CLI, MCP, Pi and OMP.`;

const { name: siteName } = useSiteConfig();

const COLLECTIONS = ALL.slice(0, 5).map((entry) => entry.key);
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between px-[72px] py-[56px]"
    style="background-color: #0b0d10; font-family: &quot;Figtree&quot;; color: #d5e4ee"
  >
    <div
      class="absolute top-0 left-[150px] w-[900px] h-[560px]"
      style="
        background-image: radial-gradient(
          ellipse at top,
          rgba(252, 211, 77, 0.16) 0%,
          rgba(252, 211, 77, 0.04) 45%,
          transparent 70%
        );
      "
    />

    <div class="flex items-center justify-between w-full">
      <p class="m-0 text-[22px]" style="font-family: &quot;Fira Code&quot;; color: #f0f4f8">
        {{ siteName }}
      </p>
      <div
        class="flex items-center px-[16px] h-[38px] rounded-[8px] text-[18px] leading-none"
        style="
          font-family: &quot;Fira Code&quot;;
          color: #a5b0bc;
          background-color: #11141a;
          border: 1px solid #262c35;
          line-height: 38px;
        "
      >
        $ pnpm add @agntn/puzzles
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center items-center w-full">
      <div class="flex items-baseline">
        <h1
          class="m-0 text-[76px] font-medium leading-[1.05] tracking-[-0.03em]"
          style="color: #f0f4f8"
        >
          Every puzzle,
        </h1>
        <h1
          class="m-0 ml-[22px] text-[76px] font-medium leading-[1.05] tracking-[-0.03em]"
          style="color: #fcd34d"
        >
          one record.
        </h1>
      </div>
      <p
        class="m-0 mt-[24px] text-[26px] leading-[1.4] text-center max-w-[880px]"
        style="color: #8a97a5"
      >
        {{ TAGLINE }}
      </p>
    </div>

    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <div
          v-for="(collection, index) in COLLECTIONS"
          :key="collection"
          class="flex items-center mr-[10px] px-[12px] h-[36px] rounded-[8px] text-[16px] leading-none"
          :style="{
            fontFamily: 'Fira Code',
            color: index === 0 ? '#fcd34d' : '#a5b0bc',
            backgroundColor: '#11141a',
            border: index === 0 ? '1px solid rgba(252, 211, 77, 0.5)' : '1px solid #262c35',
            lineHeight: '36px',
          }"
        >
          {{ collection }}
        </div>
      </div>
      <p
        class="m-0 ml-[24px] text-[16px]"
        style="font-family: &quot;Fira Code&quot;; color: #6d7884"
      >
        puzzles.agntn.dev
      </p>
    </div>
  </div>
</template>
