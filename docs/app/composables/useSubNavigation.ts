import type { ContentNavigationItem } from "@nuxt/content";
import { COLLECTIONS } from "../utils/puzzles";

const NAV_ICONS: Record<string, string> = {
  "/guide": "i-lucide-book-open",
  "/guide/records": "i-lucide-file-json",
  "/guide/registry": "i-lucide-list-tree",
  "/guide/lookups": "i-lucide-search",
  "/guide/verification": "i-lucide-badge-check",
  "/guide/balances": "i-lucide-coins",
  "/guide/cli": "i-lucide-terminal",
  "/guide/agents": "i-lucide-bot",
  "/guide/custom": "i-lucide-plus",
  "/guide/playground": "i-lucide-flask-conical",
  "/collections": "i-lucide-layers",
  "/playground": "i-lucide-flask-conical",
  ...Object.fromEntries(COLLECTIONS.map((entry) => [entry.to, entry.icon])),
};

function withIcons(items: readonly ContentNavigationItem[]): ContentNavigationItem[] {
  return items.map((item) => ({
    ...item,
    icon: NAV_ICONS[item.path] ?? item.icon,
    /** Leaf pages match exactly, so /guide isn't highlighted together with /guide/cli. */
    exact: !item.children?.length,
    children: item.children ? withIcons(item.children) : item.children,
  }));
}

/**
 * The sidebar tree with this site's icons: the current section's children when Docus runs
 * sub-navigation in the header, the whole tree otherwise.
 *
 * @returns {{ sidebarNavigation: ComputedRef<ContentNavigationItem[]> }} The items the aside renders.
 */
export function useSubNavigation() {
  const route = useRoute();
  const appConfig = useAppConfig();
  const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");

  const subNavigationMode = computed(() =>
    route.meta.layout === "docs"
      ? (appConfig.navigation as { sub?: "header" | "aside" } | undefined)?.sub
      : undefined,
  );

  const currentSection = computed(() => {
    if (!subNavigationMode.value || !navigation?.value) return undefined;
    return navigation.value.find(
      (item) => route.path === item.path || route.path.startsWith(`${item.path}/`),
    );
  });

  const sidebarNavigation = computed(() => {
    const items =
      subNavigationMode.value && currentSection.value
        ? (currentSection.value.children ?? [])
        : (navigation?.value ?? []);
    return withIcons(items);
  });

  return { sidebarNavigation };
}
