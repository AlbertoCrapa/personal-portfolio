import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * useCollectionFilter
 *
 * One search/facet/sort engine behind the projects, playground and blog
 * listings, so the three pages can't drift into three different ideas of what
 * "search" means. Everything it returns is derived — the only state is what
 * the visitor actually chose.
 *
 * Options (all field readers take an item and return the value):
 *   searchFields    – strings matched against the query
 *   facetField      – array of facet values (tech stack, tags)
 *   groupField      – single value used by the group segmented control
 *   groupLabels     – { value: label } for that control
 *   dateField       – sortable date string
 *   titleField      – sortable title
 *   highlightField  – truthy for items the "featured" toggle keeps
 *   defaultSort     – 'newest' | 'oldest' | 'az'
 *
 * `?tag=X&tag=Y` in the URL seeds the facet selection, so a tag on a detail
 * page or a card can link straight to the listing already narrowed to it. It
 * is re-read whenever the URL's tags change, so a tag link followed while the
 * listing is already open (a card's tag, the back button) applies too.
 */

const NOOP_ARRAY = [];

export const useCollectionFilter = (
  items,
  {
    searchFields = () => NOOP_ARRAY,
    facetField = () => NOOP_ARRAY,
    groupField = null,
    groupLabels = {},
    dateField = () => "",
    titleField = () => "",
    highlightField = null,
    defaultSort = "newest",
  } = {},
) => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [facets, setFacets] = useState(() => params.getAll("tag"));
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState(defaultSort);
  const [onlyHighlighted, setOnlyHighlighted] = useState(false);
  const [view, setView] = useState("grid");

  const urlTags = params.getAll("tag").join("\u0000");
  useEffect(() => {
    setFacets(urlTags ? urlTags.split("\u0000") : NOOP_ARRAY);
  }, [urlTags]);

  /**
   * Facet options carry the count of items that *would* match if they were
   * added to the current selection minus themselves — so a count is never a
   * promise of zero results.
   */
  const facetOptions = useMemo(() => {
    const counts = new Map();
    items.forEach((item) => {
      facetField(item).forEach((value) => {
        counts.set(value, (counts.get(value) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, label: value, count }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const groupOptions = useMemo(() => {
    if (!groupField) return NOOP_ARRAY;
    const counts = new Map();
    items.forEach((item) => {
      const value = groupField(item);
      if (!value) return;
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    if (counts.size < 2) return NOOP_ARRAY;
    return [
      { value: "all", label: "All", count: items.length },
      ...[...counts.entries()].map(([value, count]) => ({
        value,
        label: groupLabels[value] || value,
        count,
      })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (onlyHighlighted && highlightField && !highlightField(item)) return false;
      if (group !== "all" && groupField && groupField(item) !== group) return false;

      // Every selected facet must be present: narrowing, not widening. A
      // visitor who picks "C++" and "Unreal" is asking for the intersection.
      if (facets.length) {
        const owned = facetField(item);
        if (!facets.every((facet) => owned.includes(facet))) return false;
      }

      if (!needle) return true;
      return searchFields(item)
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });

    const sorted = [...filtered];
    if (sort === "az") {
      sorted.sort((a, b) => String(titleField(a)).localeCompare(String(titleField(b))));
    } else {
      const direction = sort === "oldest" ? 1 : -1;
      sorted.sort(
        (a, b) => direction * String(dateField(a) || "").localeCompare(String(dateField(b) || "")),
      );
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, facets, group, sort, onlyHighlighted]);

  const isFiltered =
    Boolean(query.trim()) || facets.length > 0 || group !== "all" || onlyHighlighted;

  const reset = useCallback(() => {
    setQuery("");
    setFacets(NOOP_ARRAY);
    setGroup("all");
    setOnlyHighlighted(false);
  }, []);

  return {
    query,
    setQuery,
    facets,
    setFacets,
    facetOptions,
    group,
    setGroup,
    groupOptions,
    sort,
    setSort,
    onlyHighlighted,
    setOnlyHighlighted,
    hasHighlight: Boolean(highlightField),
    view,
    setView,
    results,
    total: items.length,
    isFiltered,
    reset,
  };
};

export default useCollectionFilter;
