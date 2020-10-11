import doesItemMatchQuery from "./query/doesItemMatchQuery";
import parseQuery from "./query/parseQuery";
import mountExampleFilters from "./exampleFilters/mountExampleFilters";
import syncIntegratedQueries from "./exampleFilters/syncIntegratedQueries";

import "./search.css";


function extractUrlParams(url) {
    const result = {};
    const params = new URL(url, "http://x.invalid").searchParams;
    for (const k of params.keys()) {
        result[k] = Array.from(params.getAll(k));
    }

    return result;
}


function prepareSearchableItems(gallery) {
    const items = [];
    for (const link of gallery.querySelectorAll("a")) {
        items.push({
            fields: extractUrlParams(link.getAttribute("href")),
            element: link,
        });
    }

    return items;
}


function syncShownItemsToQuery(items, rawQuery) {
    const query = parseQuery(rawQuery);
    for (const item of items) {
        if (doesItemMatchQuery(item, query)) {
            item.element.classList.remove("hidden");
        } else {
            item.element.classList.add("hidden");
        }
    }
}


function setupSearch(gallery, search, filters) {
    const selectedFilters = new Set();
    function handleToggleFilter(isSelected, label) {
        if (isSelected) {
            selectedFilters.add(label);
        } else {
            selectedFilters.delete(label)
        }

        const integratedQueries = (
            search.getElementsByClassName("integrated-queries")[0]);
        syncIntegratedQueries({
            mountPoint: integratedQueries,
            filters,
            selectedFilters,
        });

        handleQuery();
    }

    const filtersContainer = search.getElementsByClassName("filters")[0];
    mountExampleFilters({
        mountTo: filtersContainer,
        onToggle: handleToggleFilter,
        filters
    });

    const filtersButton = search.getElementsByClassName("filters-toggle")[0];
    filtersButton.addEventListener("click", function() {
        if (filtersContainer.classList.toggle("hidden")) {
            filtersButton.innerHTML = "show example filters";
        } else {
            filtersButton.innerHTML = "hide example filters";
        }
    });

    const items = prepareSearchableItems(gallery);

    const searchbar = search.getElementsByClassName("searchbar")[0];
    function handleQuery() {
        const integratedQuery = (
            filters
                .filter(function([label, _]) {
                    return selectedFilters.has(label);
                })
                .map(function([_, query]) {
                    return query;
                })
                .join(" "));
        syncShownItemsToQuery(items, searchbar.value + " " + integratedQuery);
    }
    searchbar.addEventListener("keyup", handleQuery);
    handleQuery();
}


export default setupSearch;
