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
  "/authors": "i-lucide-users",
  "/solvers": "i-lucide-trophy",
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
 * The first page under a section, which is where its tab in the header leads.
 *
 * @param {ContentNavigationItem} item - A section of the tree.
 * @returns {string} The path of its first page.
 */
function firstPagePath(item: ContentNavigationItem): string {
  let current = item;
  while (current.children?.length) current = current.children[0]!;
  return current.path;
}

/**
 * The navigation with this site's icons. With sub-navigation in the header the sidebar holds the
 * current section only, title included; `sections` feeds the header's tabs and `fullNavigation` the
 * mobile menu, which has no tabs and needs every section.
 *
 * @returns {object} `sidebarNavigation`, `fullNavigation` and `sections`.
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

  const fullNavigation = computed(() => withIcons(navigation?.value ?? []));

  const sidebarNavigation = computed(() =>
    subNavigationMode.value === "header" && currentSection.value
      ? withIcons([currentSection.value])
      : fullNavigation.value,
  );

  const sections = computed(() =>
    fullNavigation.value.map((item) => ({
      title: item.title,
      icon: item.icon,
      to: firstPagePath(item),
      active: route.path === item.path || route.path.startsWith(`${item.path}/`),
    })),
  );

  return { sidebarNavigation, fullNavigation, sections };
}
